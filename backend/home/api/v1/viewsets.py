import base64
import json
from collections import OrderedDict

from django.db.models import Prefetch, Q, Exists, OuterRef
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile

from friendship.models import Follow

from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.apple.views import AppleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from rest_auth.registration.views import SocialLoginView
from datetime import datetime, date, timedelta
# import datetime
from dateutil.relativedelta import relativedelta
from home.models import UserProgram, CaloriesRequired, Following, Chat, PostImage, PostCommentReply, PostCommentLike, \
    PostVideo, ReportAUser
from users.models import Settings
from home.api.v1.serializers import (
    SignupSerializer,
    UserSerializer,
    ProductSerializer,
    MealSerializer,
    MealPostSerializer,
    FoodItemSerializer,
    FoodItemPostSerializer,
    RecipeItemSerializer,
    CategorySerializer,
    RecipeSerializer,
    PostSerializer,
    FormSerializer,

    ExerciseSerializer,
    SessionSerializer,
    ReportSerializer,
    SettingsSerializer,
    CardDetailSerializer,
    CommentSerializer,
    SetSerializer,
    CaloriesRequiredSerializer,
    ConsumeCaloriesSerializer,
    ProductUnitSerializer, RestSocialLoginSerializer, ReportAPostSerializer, BlockedUserSerializer, ChatSerializer,
    PostImageSerializer, CommentReplySerializer, CommentLikeSerializer, PostVideoSerializer, ReportAUserSerializer
)
from .permissions import (
    RecipePermission,
    ProfilePermission,
    SocialPermission,
    ProgramPermission,
    DietPermission
)
from home.models import Product, ProductUnit, Meal, FoodItem, Category, Recipe, Post, Form, ConsumeCalories, Following\
    , Comment, ReportAPost, BlockUser
from home.nutritionix import Nutritionix
from program.models import Exercise, Session, Workout, Set, Report, ProgramExercise
from users.models import AnswerProgram
from notification.models import Notification

import stripe

# import stripe

User = get_user_model()
nix = Nutritionix(settings.NIX_APP_ID, settings.NIX_API_KEY)

stripe.api_key = settings.STRIPE_LIVE_SECRET_KEY if settings.STRIPE_LIVE_MODE else settings.STRIPE_TEST_SECRET_KEY


class PostPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = 'page_size'
    max_page_size = 10000


class SignupViewSet(ModelViewSet):
    serializer_class = SignupSerializer
    permission_classes = [AllowAny]
    http_method_names = ['post']


class LoginViewSet(ViewSet):
    """Based on rest_framework.authtoken.views.ObtainAuthToken"""

    serializer_class = AuthTokenSerializer
    permission_classes = [AllowAny, ]

    def create(self, request):
        subscription = False
        serializer = self.serializer_class(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        user_serializer = UserSerializer(user, context={'request': request})
        if user_serializer.data["stripe_customer_id"]:
            subscription = stripe.Subscription.list(customer=user_serializer.data["stripe_customer_id"], limit=1)
        #
        # def get_subscription(self, customer_id):
        #     return stripe.Subscription.list(customer=customer_id, limit=1)
        return Response({'token': token.key, 'user': user_serializer.data, "subscription": subscription})


class ProfileViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = User.objects.filter(pk=self.request.user.pk)
        search = self.request.query_params.get("search")
        if search:
            queryset = User.objects.filter(username__icontains=search)

        return queryset

    def create_calories(self, calories, date):
        new_values = {
            'calories': calories,
            'carbs': ((calories * 40) / 100) / 4,
            'protein': ((calories * 40) / 100) / 4,
            'fat': ((calories * 20) / 100) / 9
        }
        CaloriesRequired.objects.update_or_create(
            user=self.request.user,
            created=date,
            defaults=new_values
        )

    def update(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        request_from = self.request.data.get('request_type', None)
        height = self.request.data.get('height', 0)
        weight = self.request.data.get('weight', 0)
        male, female, rma, calories, age, fitness_goal, gender, activity_level = 0, 0, 0, 0, 0, 0, 0, 0
        u = ''
        current_date = datetime.now().strftime('%Y-%m-%d')
        if request_from and request_from == 'mealTime':
            obj = queryset[0]
            no_meal = obj.number_of_meal
            height = obj.height
            weight = obj.weight
            # obj.last_update = current_date
            # obj.save()
            dob = obj.dob
            gender = int(obj.gender)
            unit = obj.unit
            activity_level = obj.activity_level
            fitness_goal = obj.fitness_goal

            d2 = datetime.strptime(current_date, "%Y-%m-%d")
            age = relativedelta(d2, dob).years
            u = unit.split("/")
            u = u[0]
            date_time = self.request.data["date_time"]
            meal_list = []
            for i in date_time:
                meal_list.append(Meal(user=self.request.user, date_time=i["mealTime"]))
            Meal.objects.bulk_create(meal_list)
            meal = no_meal + len(date_time)
            obj.number_of_meal = meal
            obj.save()

        if request_from and request_from == 'question':
            obj = queryset[0]
            obj.dob = self.request.data["dob"]
            obj.height = self.request.data["height"]
            obj.weight = self.request.data["weight"]
            obj.unit = self.request.data["unit"]
            obj.gender = self.request.data["gender"]
            obj.exercise_level = self.request.data["exercise_level"]
            obj.activity_level = self.request.data["activity_level"]
            obj.understanding_level = self.request.data["understanding_level"]
            obj.number_of_training_days = self.request.data["number_of_training_days"]
            obj.fitness_goal = self.request.data["fitness_goal"]
            obj.is_survey = True
            obj.consultations = self.request.data["consultations"]
            no_meal = obj.number_of_meal
            total_meal = self.request.data["number_of_meal"]
            obj.number_of_meal = total_meal
            obj.last_update = current_date
            obj.save()
            meal_list = []
            date_time = self.request.data["date_time"]
            birth_date = self.request.data['dob']
            gender = self.request.data['gender']
            unit = self.request.data['unit']
            fitness_goal = self.request.data['fitness_goal']
            activity_level = self.request.data['activity_level']
            meal = Meal.objects.filter(user=self.request.user)
            if meal:
                meal.delete()
            for i in date_time:
                meal_list.append(Meal(user=self.request.user, date_time=i["mealTime"]))
            Meal.objects.bulk_create(meal_list)
            if Settings.objects.filter(user=self.request.user).exists():
                Settings.objects.update(diet_tracking_voice=True, diet_tracking_text=True,
                                        diet_tracking_barcode=True, diet_dynamic_feed=True,
                                        program_custom=True)

            d1 = datetime.strptime(birth_date, "%Y-%m-%d")
            d2 = datetime.strptime(current_date, "%Y-%m-%d")
            age = relativedelta(d2, d1).years
            u = unit.split("/")
            u = u[0]
        if request_from and request_from == 'weightUpdate':
            obj = queryset[0]
            height = obj.height
            obj.weight = weight
            obj.last_update = current_date
            obj.save()
            dob = obj.dob
            gender = int(obj.gender)
            unit = obj.unit
            activity_level = obj.activity_level
            fitness_goal = obj.fitness_goal

            d2 = datetime.strptime(current_date, "%Y-%m-%d")
            age = relativedelta(d2, dob).years
            u = unit.split("/")
            u = u[0]
        if u == 'Feet':
            weight = float(weight) / 2.2
            height = (float(height) * 30.48)

        if gender == 1:
            male = (9.99 * float(weight)) + (6.25 * float(height)) - (4.92 * age) + 5
        if gender == 2:
            female = (9.99 * float(weight)) + (6.25 * float(height)) - (4.92 * age) - 161

        if activity_level == 1:
            rma = male * 1.2 if male > 0 else female * 1.2
        if activity_level == 2:
            rma = male * 1.5 if male > 0 else female * 1.5
        if activity_level == 3:
            rma = male * 1.75 if male > 0 else female * 1.75
        if activity_level == 4:
            rma = male * 2.3 if male > 0 else female * 2.3

        calories = rma
        if fitness_goal == 1:
            calories = rma - 1000
        elif fitness_goal == 2:
            calories = rma + 1000
        self.create_calories(calories, current_date)

        return Response("data updated")

    @action(methods=['get'], detail=True, url_path='follower', url_name='follower')
    def get_follower(self, request, pk):
        # instance = self.get_object()
        instance = User.objects.filter(id=pk).first()
        post_ids = []
        follower = UserSerializer(Follow.objects.followers(instance), context={"request": request}, many=True)
        following = UserSerializer(Follow.objects.following(instance), context={'request': request}, many=True)
        # post = PostSerializer(Post.objects.filter(user=instance, hide=False).order_by('-id'), context={"request": request}, many=True)
        post = Post.objects.filter(user=instance, hide=False).order_by('-id')
        for i in post:
            post_ids.append(i.id)
        post_image = PostImageSerializer(PostImage.objects.filter(post_id__in=post_ids), many=True, context={"request": request})
        post_video = PostVideoSerializer(PostVideo.objects.filter(post_id__in=post_ids), many=True, context={"request": request})
        user_detail = UserSerializer(instance, context={"request": request})
        followers = len(follower.data)
        followings = len(following.data)
        posts = post.count()
        f = False
        if len(follower.data) > 0:
            for d_index in follower.data:
                if self.request.user.id == d_index['id']:
                    f = True
        return Response({"follower": followers, "post": posts, "following": followings, 'follow': f,
                         "user_detail": user_detail.data, "post_image": post_image.data, "post_video": post_video.data})

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, RecipePermission])
    def get_fav_recipes(self, request, pk=None):
        recipes = request.user.user_favorites.all()
        recipes = [recipe.recipe for recipe in recipes]
        serializer = RecipeSerializer(recipes, many=True, context={'request': request})
        return Response(serializer.data)


class UpdateProfile(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = User.objects.filter(pk=self.request.user.pk)
        return queryset


class UserSearchViewSet(ModelViewSet):
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.all()
        search = self.request.query_params.get("search")
        if search:
            queryset = User.objects.filter(username__icontains=search)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = []
        f = False
        for i in queryset:
            a = Follow.objects.followers(i)
            if a:
                f = True
            serializer = UserSerializer(i, context={"request": request})
            data_dic = {"user_detail": serializer.data, "follow": f}
            f = False
            data.append(data_dic)
        return Response(data)


class ProductViewSet(ModelViewSet):
    """

    / -> returns all the products

    /code -> `code`: barcode associated with product, returns product if found
    """
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    @action(detail=False, methods=['get'])
    def code(self, request, pk=None):
        item_id = request.GET.get('item_id')
        upc = request.GET.get('upc')
        item = None
        if upc:
            item = nix.item_detail(upc=upc)
        elif item_id:
            item = nix.item_detail(item_id=item_id)

        if item:
            if item.get('message'):
                return Response(item['message'], status=status.HTTP_404_NOT_FOUND)
            elif item.get('foods'):
                return Response(item['foods'][0])
                # product = Product.get_or_add_product_from_nix(item['foods'][0])
                # serializer = self.serializer_class(product)
                # return Response(serializer.data)

        return Response({'error': {'code': 'Code is required'}}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def get_or_create(self, request, pk=None):
        product = Product.get_or_add_product(request.data)
        serializer = self.serializer_class(product)
        return Response(serializer.data)


class FacebookLogin(SocialLoginView):
    authentication_classes = []
    permission_classes = [permissions.AllowAny]
    adapter_class = FacebookOAuth2Adapter

    def get_response(self):
        serializer_class = self.get_response_serializer()
        user = self.user
        user_detail = UserSerializer(self.user, many=False)
        serializer = serializer_class(instance=self.token,
                                          context={'request': self.request})
        resp = serializer.data
        resp["user_detail"] = user_detail.data
        resp["token"] = resp["key"]
        response = Response(resp, status=status.HTTP_200_OK)
        return response



class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    permission_classes = [AllowAny, ]
    callback_url = "https://developers.google.com/oauthplayground"

    def get_response(self):
        serializer_class = self.get_response_serializer()
        user = self.user
        user_detail = UserSerializer(self.user, many=False)
        serializer = serializer_class(instance=self.token,
                                          context={'request': self.request})
        resp = serializer.data
        resp["user_detail"] = user_detail.data
        resp["token"] = resp["key"]
        response = Response(resp, status=status.HTTP_200_OK)
        return response


class AppleLogin(SocialLoginView):
    authentication_classes = []
    permission_classes = [AllowAny]
    adapter_class = AppleOAuth2Adapter
    serializer_class = RestSocialLoginSerializer

    def get_response(self):
        serializer_class = self.get_response_serializer()
        user = self.user
        user_detail = UserSerializer(user, many=False)
        serializer = serializer_class(instance=self.token, context={'request': self.request})
        resp = serializer.data
        resp["user_detail"] = user_detail.data
        resp["token"] = resp["key"]
        response = Response(resp, status=status.HTTP_200_OK)
        return response


class FoodViewSet(ViewSet):
    """

    / -> returns all the Food

    """

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.GET.get('query')
        if query:
            return Response(nix.search(query))
        return Response({'error': {'query': 'query is required'}}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path="speech")
    def speech_text(self, request):
        query = request.data.get('query')
        if query:
            return Response(nix.food_detail(query))
        return Response({'error': {'query': 'query is required'}}, status=status.HTTP_400_BAD_REQUEST)


class MealViewSet(ModelViewSet):
    """

    / -> returns all the Meal


    add_food ->  array -> {"food_name" -> required, "item_id" -> required for branded products, "portion" -> required}

    """
    serializer_class = MealSerializer
    permission_classes = [IsAuthenticated]
    queryset = Meal.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MealPostSerializer
        return MealSerializer

    def get_queryset(self):
        return Meal.objects.filter(user=self.request.user).order_by("id")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_log_food(self, request, pk):
        meal = Meal.objects.get(pk=pk)
        message = ''
        if request.data:
            message = Product.get_or_add_food_from_sentence(meal, request.data)
        return Response(message)

        # message = ''
        # for food_name in item_name.split(","):
        #     message = Product.get_or_add_food_from_sentence(meal, food_name)
        # return Response(message)
        # # item = nix.item_detail(item_id=item_id)
        # # food_item = request.Get.get("food")
        # # message = Product.get_or_add_food_from_sentence(meal, item_name)

    @action(detail=True, methods=['post'])
    def add_food(self, request, pk=None):
        meal = Meal.objects.get(pk=pk)
        from_sentence = request.data.get('from_sentence')
        if meal:
            if from_sentence:
                # check if the user is allowed to add from sentence
                if not request.user.settings.diet_tracking_voice:
                    return Response({"detail": "You do not have permission to perform this action."},
                                    status=status.HTTP_403_FORBIDDEN)

                query = request.data.get('query')
                message = Product.get_or_add_food_from_sentence(meal, query)
                return Response(message)
            serializer = FoodItemPostSerializer(data=request.data.get('nix_food_items'), many=True)
            if serializer.is_valid():
                for food_item in serializer.data:
                    food = Product.get_or_add_product(food_item)
                    unit = ProductUnit.objects.filter(id=food_item.get('unit')).first()
                    FoodItem.objects.create(meal=meal, food=food, portion=food_item['portion'], unit=unit)
                return Response('Food added to the meal.')
        return Response({'error': "Meal not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def delete_food(self, request):
        id = request.data.get('food_id')
        FoodItem.objects.get(id=id).delete()
        return Response('Food deleted from the meal.')

    @action(detail=False, methods=['get'])
    def get_by_date(self, request, pk=None):
        today = datetime.strptime(request.GET.get('date'), "%Y-%m-%d")
        # meal = Meal.objects.filter(date_time__date=today, user=request.user).order_by('-date_time')
        m_id = request.GET.get('id')
        if m_id:
            meal = Meal.objects.filter(id=m_id).prefetch_related(
                Prefetch("food_items", queryset=FoodItem.objects.filter(created=today))
            ).distinct()
            if meal:
                serializer = MealSerializer(meal, many=True)
                return Response(serializer.data)

        meal = Meal.objects.filter(user=request.user).prefetch_related(
            Prefetch("food_items", queryset=FoodItem.objects.filter(created=today))
        ).distinct()
        if meal:
            serializer = MealSerializer(meal, many=True)
            return Response(serializer.data)
        return Response({'error': "Meal not found"}, status=status.HTTP_404_NOT_FOUND)


class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    http_method_names = ['get']


class RecipeViewSet(ModelViewSet):
    """

    / -> returns all the Recipes

    """
    serializer_class = RecipeSerializer
    queryset = Recipe.objects.get_queryset().order_by('id')
    http_method_names = ['get']
    permission_classes = [IsAuthenticated]
    paginate_by = 25

    @action(detail=False, methods=['get'])
    def search(self, request, pk=None):
        category = request.GET.get('category')
        time_to_prepare_lte = request.GET.get('time_to_prepare_lte')
        time_to_prepare_gte = request.GET.get('time_to_prepare_gte')
        code = request.GET.get('code')
        name = request.GET.get('name')

        recipe = Recipe.objects.all()

        if code:
            recipe = recipe.filter(recipe_items__food__code=code)
        if category:
            recipe = recipe.filter(category__slug=category)
        if time_to_prepare_lte:
            recipe = recipe.filter(time_to_prepare__lte=time_to_prepare_lte)
        if time_to_prepare_gte:
            recipe = recipe.filter(time_to_prepare__gte=time_to_prepare_gte)
        if name:
            recipe = recipe.filter(name__icontains=name)

        page = self.paginate_queryset(recipe)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.serializer_class(recipe, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def toggle_fav(self, request, pk=None):
        recipe = self.get_object()
        recipe.add_fav(request.user)
        return Response("Added/Removed Like")

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def get_fav(self, request, pk=None):
        recipe = self.get_object()
        return Response(recipe.get_fav(request.user))


# Program viewsets

class ExerciseViewSet(ModelViewSet):
    serializer_class = ExerciseSerializer
    queryset = Exercise.objects.all()
    http_method_names = ['get']


class SessionViewSet(ModelViewSet):
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Session.objects.filter(user=self.request.user).order_by('date_time')

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        how_many_week = queryset.count() / 7
        start_date = self.request.query_params.get("date")
        if start_date:
            date_time_obj = datetime.strptime(start_date, '%Y-%m-%d')
            end = date_time_obj + timedelta(days=7)
            queryset = queryset.filter(date_time__range=[date_time_obj, end])
        if request.GET.get('reset'):
            for session in queryset:
                session.reset()
        serializer = self.get_serializer(queryset, many=True)
        data = {
            "week": int(how_many_week),
            "query": serializer.data
        }
        return Response(data)
        # return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def mark_set_done(self, request):
        id = request.data.get('id')  # set id
        if id:
            set = Set.objects.filter(id=id).first()
            if set:
                set.mark_done()
                return Response("Set marked done")
            return Response({'error': "Set not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': {'id': 'id is required'}}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def mark_workout_done(self, request):
        id = request.data.get('id')  # workout  id
        if id:
            workout = Workout.objects.filter(id=id).first()
            if workout:
                workout.mark_done_completely()
                return Response("Workout marked done")
            return Response({'error': "Workout not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': {'id': 'id is required'}}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def list_exercises(self, request):
        id = request.GET.get('id')
        if id:
            workout = Workout.objects.filter(id=id).first()
            if workout:
                program = workout.session.program
                exercise = ProgramExercise.objects.filter(exercise=workout.exercise, day__week__program=program).first()
                replacements = []
                if exercise:
                    for rep in exercise.replacements.all():
                        replacements.append(rep.replacement)
                    serializer = ExerciseSerializer(replacements, many=True, context={'request': request})
                    return Response(serializer.data)
                return Response("no exercise available")
            return Response({'error': "Workout not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': {'id': 'id is required'}}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def swap_exercise(self, request):
        workout_id = request.data.get('workout_id')
        exercise_id = request.data.get('exercise_id')
        rest_of_program = request.data.get('rest_of_program')

        if workout_id and exercise_id:
            workout = Workout.objects.filter(id=workout_id).first()
            exercise = Exercise.objects.filter(id=exercise_id).first()
            if workout and exercise:
                if rest_of_program:
                    workouts = Workout.objects.filter(session=workout.session, exercise=workout.exercise)
                    for workout in workouts:
                        rest = Exercise.objects.filter(id=rest_of_program).first()
                        workout.exercise = rest
                        # workout.exercise = exercise
                        workout.save()
                else:
                    workout.exercise = exercise
                    workout.save()
                return Response("Exercise swapped")
            return Response({'error': "Workout/Exercise not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({'workout_id and exercise_id is required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def get_by_day(self, request):
        day = request.GET.get("day")
        reset = request.GET.get('reset')
        if day:
            session = Session.objects.filter(user=request.user, date_time__week_day=day).first()
            if reset:
                session.reset()
            serializer = self.serializer_class(session, context={'request': request})
            return Response(serializer.data if session else [])
        return Response({'error': {'day': 'day is required'}}, status=status.HTTP_400_BAD_REQUEST)


class ReportViewSet(ModelViewSet):
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']

    def get_queryset(self):
        return Report.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def get_by_day(self, request):
        day = request.GET.get("day")
        if day:
            report = Report.objects.filter(user=request.user, session__date_time__week_day=day).first()
            if report:
                sets = report.session.get_sets()
                completed_sets = list(filter(lambda x: x.done, sets))
                final_data = {"total_sets": len(sets), "completed_sets": len(completed_sets)}
                serializer = self.serializer_class(report)
                final_data.update(serializer.data)
            return Response(final_data if report else [])
        return Response({'error': {'day': 'day is required'}}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def get_by_date(self, request):
        date = request.GET.get("date")
        final_data = {'workout': OrderedDict(), "meal": OrderedDict()}
        if date:
            # check subscription for Program and exercise
            if request.user.settings.program_analytics:
                session = Session.objects.filter(user=request.user, date_time__date=date).first()
                if session:
                    workouts = session.workouts.all()
                    final_data["workout"]["exercises"] = OrderedDict()
                    for workout in workouts:
                        sets = workout.sets.all()
                        completed_sets = list(filter(lambda x: x.done, sets))
                        final_data["workout"]["exercises"][workout.exercise.name] = {
                            "total_sets": len(sets),
                            "completed_sets": len(completed_sets)
                        }

                    final_data["workout"]["calorie"] = {
                        "protein": session.protein,
                        "carb": session.carb,
                        "carb_casual": session.carb_casual
                    }

            # check subscription for diet
            if request.user.settings.diet_analytics:
                meals = Meal.objects.filter(date_time__date=date, user=request.user)
                for meal in meals:
                    final_data['meal'][str(meal.date_time)] = {
                        "protein": meal.protein,
                        "carb": meal.carbohydrate,
                        "fat": meal.fat,
                        "calories": meal.calories
                    }
            return Response(final_data if session else [])
        return Response({'error': {'date': 'date is required'}}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def get_weekly_report(self, request):
        today = datetime.date.today()
        start = today - timedelta(days=today.weekday())
        end = today + timedelta(days=today.weekday())
        final_data = {'workout': OrderedDict(), "meal": {"protein": 0, "carb": 0, "fat": 0, "calories": 0}}
        final_data["workout"]["exercises"] = OrderedDict()
        final_data["workout"]["calorie"] = {"protein": 0, "carb": 0, "carb_casual": 0}

        # check subscription for Program and exercise
        if request.user.settings.program_analytics:
            sessions = Session.objects.filter(user=request.user, date_time__date__range=(start, end))
            for session in sessions:
                workouts = session.workouts.all()
                for workout in workouts:
                    sets = workout.sets.all()
                    completed_sets = list(filter(lambda x: x.done, sets))
                    final_data["workout"]["exercises"][workout.exercise.name] = {
                        "total_sets": len(sets),
                        "completed_sets": len(completed_sets)
                    }
                final_data["workout"]["calorie"] = {
                    "protein": final_data["workout"]["calorie"]['protein'] + session.protein,
                    "carb": final_data["workout"]["calorie"]['carb'] + session.carb,
                    "carb_casual": final_data["workout"]["calorie"]['carb_casual'] + session.carb_casual
                }
        # check subscription for diet
        if request.user.settings.diet_analytics:
            meals = Meal.objects.filter(date_time__date__range=(start, end), user=request.user)
            for meal in meals:
                final_data['meal'] = {
                    "protein": final_data['meal']['protein'] + meal.protein,
                    "carb": final_data['meal']['carb'] + meal.carbohydrate,
                    "fat": final_data['meal']['fat'] + meal.fat,
                    "calories": final_data['meal']['calories'] + meal.calories
                }
        return Response(final_data)


class PostViewSet(ModelViewSet):
    serializer_class = PostSerializer
    # queryset = Post.objects.filter(hide=False).select_related('user').order_by('-id')
    permission_classes = [IsAuthenticated]
    pagination_class = PostPagination

    def get_queryset(self):
        # queryset = self.queryset
        queryset = Post.objects.filter(hide=False).select_related('user').order_by('-id')
        block_user = BlockUser.objects.filter(requested_user=self.request.user)
        request_user = BlockUser.objects.filter(blocked_user=self.request.user)
        block_user_list = []
        if block_user:
            for i in block_user:
                block_user_list.append(i.blocked_user.id)
        if request_user:
            for i in request_user:
                block_user_list.append(i.requested_user.id)

        queryset = queryset.exclude(user_id__in=block_user_list).order_by('-id')
        return queryset

    def create(self, request, *args, **kwargs):

        request_data = request.data

        # if 'image' in request_data.keys():
        #     print("The key exists")
        #     image = request_data['image']
        #     format, img_str = image.split(';base64,')
        #     ext = format.split('/')[-1]
        #     file_name = f'{datetime.now().strftime("%Y_%m_%d-%I:%M:%S_%p")}.{ext}'
        #     image = ContentFile(base64.b64decode(img_str), file_name)
        #     request_data['image'] = image
        # elif 'video' in request_data.keys():
        #     print("The key doesn't exist")
        #     video = request_data['video']
        #     format, video_str = video.split(';base64,')
        #     ext = format.split('/')[-1]
        #     file_name = f'{datetime.now().strftime("%Y_%m_%d-%I:%M:%S_%p")}.{ext}'
        #     video = ContentFile(base64.b64decode(video_str), file_name)
        #     request_data['video'] = video

        post_image = []
        post_video = []
        image = ''
        video = ''
        video_thumbnail = ''
        data = {}
        if request.data.get("image"):
            image = dict((request.data).lists())['image']
        if request.data.get("video"):
            video = dict((request.data).lists())['video']
        if request.data.get("video_thumbnail"):
            video_thumbnail = dict((request.data).lists())['video_thumbnail']
        post_content = {"content": self.request.data.get("content") if self.request.data.get("content") else ""}
        serializer = self.get_serializer(data=post_content)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            if image:
                for i in image:
                    data = {'post': serializer.data.get("id"), 'image': i}
                    post_image.append(data)
                post_image_serializer = PostImageSerializer(data=post_image, many=True)
                if post_image_serializer.is_valid(raise_exception=True):
                    post_image_serializer.save()
            if video and video_thumbnail:
                for v in video:
                    for thumbnail in video_thumbnail:
                        data = {'post': serializer.data.get("id"), "video": v, "video_thumbnail": thumbnail}
                        video_thumbnail.remove(thumbnail)
                        break
                    post_video.append(data)
                post_video_serializer = PostVideoSerializer(data=post_video, many=True)
                if post_video_serializer.is_valid(raise_exception=True):
                    post_video_serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_comment(self, request, pk=None):
        post = self.get_object()
        comment = request.data.get('comment')
        com = post.add_comment(request.user, comment)
        res = CommentSerializer(com, context={'request': request})
        return Response(res.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def add_like(self, request, pk=None):
        post = self.get_object()
        post.add_like(request.user)
        return Response("Added/Removed Like")

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def get_like(self, request, pk=None):
        post = self.get_object()
        return Response(post.get_like(request.user))

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PostImageVideoViewSet(ModelViewSet):
    serializer_class = PostImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        post_id = self.request.query_params.get("post_id")
        queryset = PostImage.objects.filter(post_id=post_id)
        return queryset


class FollowViewSet(ViewSet):

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_followers(self, request, pk=None):
        followers = Follow.objects.followers(request.user)
        serializer = UserSerializer(followers, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_following(self, request, pk=None):
        following = Follow.objects.following(request.user)
        serializer = UserSerializer(following, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def add_follow(self, request, pk=None):
        # from home.models import Following
        other_user = User.objects.get(id=request.data['id'])
        a = Following.add_follower(request.user, other_user)
        if a == 'already follows':
            return Response("already follow")
        return Response("Added")

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def remove_follow(self, request, pk=None):
        other_user = User.objects.get(id=request.data['id'])
        Follow.objects.remove_follower(request.user, other_user)
        notification = Notification.objects.filter(receiver=other_user, title="Follow").first()
        if notification:
            notification.delete()

        return Response("Removed")

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def get_if_following(self, request, pk=None):
        other_user = User.objects.get(id=request.data['id'])
        follows = Follow.objects.follows(request.user, other_user)
        return Response(follows)


class FormViewSet(ModelViewSet):
    serializer_class = FormSerializer
    queryset = Form.objects.all()
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def set_program(self, request, pk=None):
        user = request.user
        today = date.today()
        age = today.year - user.dob.year - ((today.month, today.day) < (user.dob.month, user.dob.day))
        program = AnswerProgram.objects.filter(
            age_min__lte=age,
            age_max__gte=age,
            exercise_level=user.exercise_level,
            # activity_level=user.activity_level,
            # understanding_level=user.understanding_level,
            # number_of_meal=user.number_of_meal,
            number_of_training_days=user.number_of_training_days,
            fitness_goal=user.fitness_goal
        ).first()
        user_program = UserProgram.objects.filter(user=request.user).first()
        if user_program:
            user_program.program.create_session(request.user)
        else:
            if program:
                program.program.create_session(request.user)
            return Response("program not assigned")
        return Response({"Program assigned"})

    # @action(detail=False, methods=['get'])
    # def get_initial_form(self, request):
    #     sttng = Settings.objects.get()
    #     return Response(self.serializer_class(sttng.initial_form).data)


class SettingsViewSet(ModelViewSet):
    serializer_class = SettingsSerializer
    queryset = Settings.objects.all()
    permission_classes = [IsAuthenticated]


class PaymentViewSet(ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def get_customer_id(self, request):
        if not request.user.stripe_customer_id:
            customer = stripe.Customer.create(
                description="Customer for {}".format(request.user.email),
                email=request.user.email
            )
            request.user.stripe_customer_id = customer.id
            request.user.save()
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def get_cards(self, request):
        if request.user.stripe_customer_id:
            cards = stripe.Customer.list_sources(
                request.user.stripe_customer_id,
                object="card",
            )
            return Response(cards)
        return Response("User not a customer", status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def create_card(self, request):
        if request.user.stripe_customer_id:
            try:
                card = stripe.Customer.create_source(
                    request.user.stripe_customer_id,
                    source=request.data['card_token'],
                )
            except Exception as e:
                return Response(str(e))
            return Response(card)
        return Response("User not a customer", status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def delete_card(self, request):
        if request.user.stripe_customer_id:
            response = stripe.Customer.delete_source(
                request.user.stripe_customer_id,
                request.data['card_id']
            )
            return Response(response)
        return Response("User not a customer", status=status.HTTP_400_BAD_REQUEST)

    def get_product(self, product_id):
        return stripe.Product.retrieve(product_id)

    @action(detail=False, methods=['get'])
    def get_products(self, request):
        return Response(stripe.Product.list())

    @action(detail=False, methods=['get'])
    def get_plans(self, request):
        return Response(stripe.Plan.list())

    def get_subscription(self, customer_id):
        return stripe.Subscription.list(customer=customer_id, limit=1)

    @action(detail=False, methods=['get'])
    def get_subs(self, request):
        if not request.user.stripe_customer_id:
            customer = stripe.Customer.create(
                description="Customer for {}".format(request.user.email),
                email=request.user.email
            )
            request.user.stripe_customer_id = customer.id
            request.user.save()
        return Response(self.get_subscription(request.user.stripe_customer_id))

    @action(detail=False, methods=['post'])
    def create_subscription(self, request):
        serializer = CardDetailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.data
        token = stripe.Token.create(
            card={
                "number": data.get("card_number"),
                "exp_month": data.get("card_exp_month"),
                "exp_year": data.get("card_exp_year"),
                "cvc": data.get("card_cvv")
            }, )
        try:
            stripe.Customer.create_source(
                request.user.stripe_customer_id,
                source=token.id,
            )
        except Exception as e:
            return Response(str(e))

        plan = data.get("plan_id")
        if plan:
            cus_sub = self.get_subscription(request.user.stripe_customer_id)
            if cus_sub:
                cus_sub = cus_sub.data[0]
            kwargs = {
                'customer': request.user.stripe_customer_id,
                'items': [
                    {"price": request.data['plan_id']},
                ],
            }

            # if the user doesn't have any other subs, give 7 days trial period
            if not cus_sub:
                kwargs['trial_period_days'] = 7
            try:
                subscription = stripe.Subscription.create(**kwargs)

                # remove any previous subs
                if cus_sub:
                    stripe.Subscription.delete(cus_sub.id)

                # request.user.update_settings(plan, self.get_product(data.get("product")))
                # request.user.update_settings(plan, self.get_product(plan.product))

            except stripe.error.InvalidRequestError as E:
                return Response(str(E), status=status.HTTP_400_BAD_REQUEST)

            return Response(subscription)


class SetViewSet(ModelViewSet):
    serializer_class = SetSerializer

    def get_queryset(self):
        return Set.objects.all()


class CaloriesRequiredViewSet(ModelViewSet):
    serializer_class = CaloriesRequiredSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CaloriesRequired.objects.filter(user=self.request.user).order_by('-id')


class ConsumeCaloriesViewSet(ModelViewSet):
    serializer_class = ConsumeCaloriesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ConsumeCalories.objects.filter(
            user=self.request.user
        ).select_related('user', 'goals_values').order_by('-created')

    def create(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        req_calories = CaloriesRequired.objects.filter(user=self.request.user).last()
        calories = request.data['calories']
        protein = request.data['protein']
        carbs = request.data['carbs']
        fat = request.data['fat']
        current_date = date.today()
        consume_calories = queryset.filter(created=current_date)
        if consume_calories:
            consume_calories.update(calories=calories, protein=protein, carbs=carbs, fat=fat, goals_values=req_calories)
            return Response("calories update")
        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            a = ConsumeCalories.objects.filter(user=self.request.user).last()
            a.goals_values = req_calories
            a.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class CommentViewSet(ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    # http_method_names = ['delete']

    def destroy(self, request, *args, **kwargs):
        c_id = kwargs["pk"]
        p_id = self.request.data['post_id']
        comment_user_id = request.data.get("comment_user_id")
        c = Comment.objects.filter(id=c_id).first()
        p = Post.objects.filter(id=p_id).first()
        notification = Notification.objects.filter(sender_id=comment_user_id, title="Comment Post").first()
        if c:
            if c.user.id == self.request.user.id or self.request.user.is_superuser:
                c.delete()
                if notification:
                    notification.delete()
                return Response("Comment delete successful")
            if p:
                if p.user.id == self.request.user.id or self.request.user.is_superuser:
                    c.delete()
                    if notification:
                        notification.delete()
                    return Response("Comment delete successful")
            return Response({'error': {'comment': 'you can not delete comment'}}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'id': 'comment id is require '}, status=status.HTTP_400_BAD_REQUEST)


class ProductUnitViewSet(ModelViewSet):
    serializer_class = ProductUnitSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self, **kwargs):
        queryset = ProductUnit.objects.filter(id=int(self.kwargs['pk']))
        return queryset


class CheckUserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # username = self.request.query_params.get("username")
        queryset = User.objects.all()
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        username = self.request.query_params.get("username")
        queryset = queryset.filter(username=username)
        if queryset:
            return Response("user already exist")
        return Response("ok")


class ReportAPostViewSet(ModelViewSet):
    serializer_class = ReportAPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ReportAPost.objects.filter(user=self.request.user)
        return queryset


class ReportAUserViewSet(ModelViewSet):
    serializer_class = ReportAUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ReportAUser.objects.filter(reporter_user=self.request.user)
        return queryset


class BlockedUserViewSet(ModelViewSet):
    serializer_class = BlockedUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = BlockUser.objects.filter(blocked_user=self.request.user)
        return queryset

    def create(self, request, *args, **kwargs):
        already_block = BlockUser.objects.filter(requested_user=request.data.get("requested_user"),
                                                 blocked_user=request.data.get("blocked_user"))
        if already_block:
            already_block.delete()
            return Response("unblock successfully")
        serializer = BlockedUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class FoodItemViewSet(ModelViewSet):
    serializer_class = FoodItemSerializer
    authentication_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = FoodItem.objects.all().order_by("id")
        return queryset


class ChatViewSet(ModelViewSet):
    serializer_class = ChatSerializer
    queryset = Chat.objects.all()

    def get_queryset(self):
        user = self.request.query_params.get('user')
        if user:
            return Chat.objects.filter(Q(user=user) | Q(match_id=user))
        return Chat.objects.filter(user=self.request.user)


class CommentReplyViewSet(ModelViewSet):
    queryset = PostCommentReply.objects.all()
    serializer_class = CommentReplySerializer

    def get_queryset(self):
        queryset = self.queryset
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = CommentReplySerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class CommentLikeViewSet(ModelViewSet):
    queryset = PostCommentLike.objects.all()
    serializer_class = CommentLikeSerializer

    def create(self, request, *args, **kwargs):
        comment = request.data.get("comment")
        comment_reply = request.data.get("comment_reply")
        user = request.data.get("user")
        if comment:
            comment_exit = PostCommentLike.objects.filter(comment_id=comment, user_id=user)
            if comment_exit:
                comment_exit.delete()
                return Response("unlike")
        if comment_reply:
            comment_reply_exit = PostCommentLike.objects.filter(comment_reply_id=comment_reply, user_id=user)
            if comment_reply_exit:
                comment_reply_exit.delete()
                return Response("unlike")
        serializer = CommentLikeSerializer(data=request.data)
        serializer.is_valid()
        serializer.save()
        return Response("like")