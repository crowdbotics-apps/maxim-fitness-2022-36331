import base64
import json
from collections import OrderedDict

from django.db import transaction
from django.db.models import Prefetch, Q, Exists, OuterRef
from django.utils import timezone
import boto3
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from fcm_django.models import FCMDevice
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet, ViewSet, GenericViewSet
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status, permissions, parsers, mixins
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
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
from home.models import UserProgram, CaloriesRequired, Chat, PostImage, PostCommentReply, PostCommentLike, \
    PostVideo, ReportAUser, ReportAComment, ReportCommentReply, MealTime, MealHistory
from maxim_fitness_2022_36331.generate_jwt_app_store import get_app_store_jwt_token, get_app_store_subscription_status, \
    check_subscription_status
from users.models import Settings, UserPhoto, UserVideo
from home.api.v1.serializers import (
    SignupSerializer,
    UserSerializer,
    ProductSerializer,
    MealSerializer,
    MealPostSerializer,
    FoodItemSerializer,
    FoodItemPostSerializer,
    CategorySerializer,
    RecipeSerializer,
    PostSerializer,
    FormSerializer,

    ExerciseSerializer,
    SessionSerializer,
    ReportSerializer,
    SettingsSerializer,
    CommentSerializer,
    SetSerializer,
    CaloriesRequiredSerializer,
    ConsumeCaloriesSerializer,
    ProductUnitSerializer, RestSocialLoginSerializer, ReportAPostSerializer, BlockedUserSerializer, ChatSerializer,
    PostImageSerializer, CommentReplySerializer, CommentLikeSerializer, PostVideoSerializer, ReportAUserSerializer,
    ExerciseTypeSerializer, UserPhotoSerializer, UserVideoSerializer, ReportACommentSerializer,
    ReportCommentReplySerializer, MealTimeSerializer, MealHistorySerializer, CustomWorkoutSerializer,
    CustomExercisesSetsSerializer
)
from .permissions import (
    RecipePermission,
)
from home.models import Product, ProductUnit, Meal, FoodItem, Category, Recipe, Post, Form, ConsumeCalories, Following \
    , Comment, ReportAPost, BlockUser
from home.nutritionix import Nutritionix
from program.models import Exercise, Session, Workout, Set, Report, ProgramExercise, ExerciseType, CustomWorkout, \
    CustomExercise, CustomSet
from users.models import AnswerProgram
from notification.models import Notification

import stripe

# import stripe
from django.db.models import Count

from ...utils import send_notification

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
            if not subscription:
                subscription = False
        #
        # def get_subscription(self, customer_id):
        #     return stripe.Subscription.list(customer=customer_id, limit=1)
        return Response({'token': token.key, 'user': user_serializer.data, "subscription": subscription})


class ProfileViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        queryset = User.objects.filter(pk=self.request.user.pk)
        search = self.request.query_params.get("search")
        if search:
            queryset = User.objects.filter(username__icontains=search)

        return queryset

    def create_calories(self, calories, date):

        carbs = ((calories * 40) / 100) / 4
        protein = ((calories * 40) / 100) / 4
        fat = ((calories * 20) / 100) / 9

        new_values = {
            'calories': round(calories),
            'carbs': carbs,
            'protein': protein,
            'fat': fat
        }
        object, created = CaloriesRequired.objects.update_or_create(
            user=self.request.user,
            created=date,
            defaults=new_values
        )
        consume_cal = ConsumeCalories.objects.filter(user=self.request.user, created=timezone.now().date())
        if consume_cal.exists():
            ConsumeCalories.objects.update(goals_values=object)
        else:
            ConsumeCalories.objects.create(goals_values=object, user=self.request.user, carbs=0, fat=0, protein=0,
                                           calories=0)

    def update(self, request, *args, **kwargs):
        with transaction.atomic():
            queryset = self.get_queryset()
            request_from = self.request.data.get('request_type', None)
            height = self.request.data.get('height', None)
            weight = self.request.data.get('weight', None)
            male, female, rma, calories, age, fitness_goal, gender, activity_level = 0, 0, 0, 0, 0, 0, 0, 0
            u = ''
            current_date = datetime.now().strftime('%Y-%m-%d')
            if request_from and request_from == "goal":
                fitness_goal = self.request.data["fitness_goal"]
                obj = queryset[0]
                if fitness_goal:
                    if int(fitness_goal) == obj.fitness_goal:
                        return Response({"message": "Can't revised same fitness goal."},
                                        status=status.HTTP_400_BAD_REQUEST)

                    today = date.today()
                    age = today.year - obj.dob.year - ((today.month, today.day) < (obj.dob.month, obj.dob.day))
                    program = AnswerProgram.objects.filter(
                        age_min__lte=age,
                        age_max__gte=age,
                        exercise_level=obj.exercise_level,
                        number_of_training_days=obj.number_of_training_days,
                        fitness_goal=int(fitness_goal)
                    ).first()
                    if not program:
                        return Response({"message": "No program currently aligns with selected fitness goal."},
                                        status=status.HTTP_400_BAD_REQUEST)
                    obj.fitness_goal = self.request.data["fitness_goal"]
                    obj.save()
            if request_from and request_from == "days":
                obj = queryset[0]
                today = date.today()
                age = today.year - obj.dob.year - ((today.month, today.day) < (obj.dob.month, obj.dob.day))
                days = self.request.data["number_of_training_days"]
                if days:
                    if int(days) == obj.number_of_training_days:
                        if Session.objects.filter(user_id=obj.id, is_active=True).exists():
                            return Response({"message": "Already have same number of training days."},
                                            status=status.HTTP_400_BAD_REQUEST)
                    program = AnswerProgram.objects.filter(
                        age_min__lte=age,
                        age_max__gte=age,
                        exercise_level=obj.exercise_level,
                        number_of_training_days=int(self.request.data["number_of_training_days"]),
                        fitness_goal=obj.fitness_goal
                    ).first()
                    if not program:
                        return Response({"message": "No program currently aligns with this training days."},
                                        status=status.HTTP_400_BAD_REQUEST)
                    obj.number_of_training_days = self.request.data["number_of_training_days"]
                    obj.save()
            if request_from and request_from == 'mealTime':
                obj = queryset[0]
                no_meal = obj.number_of_meal
                height = obj.height
                weight = obj.weight
                # obj.last_update = current_date
                # obj.save()
                dob = obj.dob
                gender = obj.gender
                unit = obj.unit
                activity_level = obj.activity_level
                fitness_goal = obj.fitness_goal

                d2 = datetime.strptime(current_date, "%Y-%m-%d")
                age = relativedelta(d2, dob).years
                u = unit.split("/")
                u = u[0]
                date_time = self.request.data["date_time"]
                meal = Meal.objects.filter(user=self.request.user)
                meal_list = []
                if meal.exists():
                    meal_id = meal.last().id
                else:
                    meal = Meal.objects.create(user=self.request.user, no_of_meals=len(date_time))
                    meal_id = meal.id
                for i in date_time:
                    meal_list.append(MealTime(meal_id=meal_id,
                                              date_time=i["mealTime"], meal_name=f"meal_{i['mealTime']}"))
                MealTime.objects.bulk_create(meal_list)

                obj.number_of_meal = len(date_time)
                obj.save()

            if request_from and request_from == 'question':
                obj = queryset[0]
                obj.dob = self.request.data["dob"]
                obj.height = str(self.request.data["height"])
                obj.weight = str(self.request.data["weight"])
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
                if meal.exists():
                    meal_id = meal.last().id
                else:
                    meal = Meal.objects.create(user=self.request.user, no_of_meals=len(date_time))
                    meal_id = meal.id
                for i in date_time:
                    meal_list.append(MealTime(meal_id=meal_id,
                                              date_time=i["mealTime"], meal_name=f"meal_{i['mealTime']}"))
                MealTime.objects.bulk_create(meal_list)
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
                gender = obj.gender
                unit = obj.unit
                activity_level = obj.activity_level
                fitness_goal = obj.fitness_goal

                d2 = datetime.strptime(current_date, "%Y-%m-%d")
                age = relativedelta(d2, dob).years
                u = unit.split("/")
                u = u[0]
            if not height and not weight:
                height = obj.height
                weight = obj.weight
                gender = obj.gender
                activity_level = obj.activity_level
                u = obj.unit.split("/")
                u = u[0]
            if u == 'Feet':
                weight = float(weight) * 0.453592
                feet_inch = height.split(".")
                total_inch = (float(feet_inch[0]) * 12) + float(feet_inch[1])
                height = total_inch * 2.54
            else:
                weight = float(weight)  # Convert to float here
                height = float(height) * 100
            bmr = 1
            if gender == 'Male':
                bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
            if gender == 'Female':
                bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161

            if activity_level == 1:
                rma = bmr * 1.2
            if activity_level == 2:
                rma = bmr * 1.375
            if activity_level == 3:
                rma = bmr * 1.55
            if activity_level == 4:
                rma = bmr * 1.725

            calories = rma
            if fitness_goal == 1:
                calories = rma - 500
            elif fitness_goal == 2:
                calories = rma + 500
            self.create_calories(calories, current_date)

            return Response("data updated")

    @action(methods=['get'], detail=True, url_path='follower', url_name='follower')
    def get_follower(self, request, pk):
        # instance = self.get_object()
        instance = User.objects.filter(id=pk).first()
        likes = Post.objects.filter(user=self.request.user).aggregate(total_likes=Count('likes__id')).get('total_likes',
                                                                                                          0)
        post_ids = []
        follower = UserSerializer(Follow.objects.followers(instance), context={"request": request}, many=True)
        following = UserSerializer(Follow.objects.following(instance), context={'request': request}, many=True)
        # post = PostSerializer(Post.objects.filter(user=instance, hide=False).order_by('-id'), context={"request": request}, many=True)
        post = Post.objects.filter(user=instance).order_by('-id')
        for i in post:
            post_ids.append(i.id)
        post_image = PostImageSerializer(PostImage.objects.filter(post_id__in=post_ids), many=True,
                                         context={"request": request})
        post_video = PostVideoSerializer(PostVideo.objects.filter(post_id__in=post_ids), many=True,
                                         context={"request": request})
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
                         "user_detail": user_detail.data, "post_image": post_image.data, "post_video": post_video.data,
                         "likes_count": likes})

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, RecipePermission])
    def get_fav_recipes(self, request, pk=None):
        recipes = request.user.user_favorites.all()
        recipes = [recipe.recipe for recipe in recipes]
        serializer = RecipeSerializer(recipes, many=True, context={'request': request})
        return Response(serializer.data)


class UpdateProfile(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['patch']

    def get_queryset(self):
        queryset = User.objects.filter(pk=self.request.user.pk)
        return queryset


class UserPhotoViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    GenericViewSet
):
    serializer_class = UserPhotoSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    parser_classes = [parsers.FormParser, parsers.MultiPartParser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return UserPhoto.objects.filter(user=self.request.user)


class UserVideoViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    GenericViewSet
):
    serializer_class = UserVideoSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    parser_classes = [parsers.FormParser, parsers.MultiPartParser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return UserVideo.objects.filter(user=self.request.user)


class UserSearchViewSet(ModelViewSet):
    serializer_class = UserSerializer
    pagination_class = PostPagination

    def get_queryset(self):
        queryset = User.objects.all()
        search = self.request.query_params.get("search")
        if search:
            queryset = User.objects.filter(
                Q(username__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)).exclude(id=self.request.user.id)
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        # Use pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            data = []
            for i in page:
                a = Follow.objects.followers(i)
                f = True if a else False
                serializer = UserSerializer(i, context={"request": request})
                data_dic = {"user_detail": serializer.data, "follow": f}
                data.append(data_dic)
            return self.get_paginated_response(data)

        # If pagination is not applied
        data = []
        for i in queryset:
            a = Follow.objects.followers(i)
            f = True if a else False
            serializer = UserSerializer(i, context={"request": request})
            data_dic = {"user_detail": serializer.data, "follow": f}
            data.append(data_dic)

        return Response(data)


class ProductViewSet(ModelViewSet):
    """

    / -> returns all the products

    /code -> `code`: barcode associated with product, returns product if found
    """
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    @action(detail=False, methods=['post'])
    def code(self, request, pk=None):
        item_id = request.data.get('item_id')
        upc = request.data.get('upc')
        if upc:
            try:
                response = []
                for q in upc:
                    result = nix.item_detail(upc=q)
                    if not result.get("message"):
                        response.append(result)
                    else:
                        return Response(result.get("message"), status=400)
                return Response(response)
            except Exception as e:
                return Response({'error': str(e)}, status=500)
        elif item_id:
            try:
                response = []
                data = [{'foods': [{'food_name': 'Applesauce, Apple', 'brand_name': "Mott's", 'serving_qty': 1, 'serving_unit': 'container', 'serving_weight_grams': 111, 'nf_metric_qty': 111, 'nf_metric_uom': 'g', 'nf_calories': 50, 'nf_total_fat': 0, 'nf_saturated_fat': None, 'nf_cholesterol': None, 'nf_sodium': 0, 'nf_total_carbohydrate': 13, 'nf_dietary_fiber': 1, 'nf_sugars': 11, 'nf_protein': 0, 'nf_potassium': 80, 'nf_p': None, 'full_nutrients': [{'attr_id': 203, 'value': 0}, {'attr_id': 204, 'value': 0}, {'attr_id': 205, 'value': 13}, {'attr_id': 208, 'value': 50}, {'attr_id': 269, 'value': 11}, {'attr_id': 291, 'value': 1}, {'attr_id': 306, 'value': 80}, {'attr_id': 307, 'value': 0}, {'attr_id': 539, 'value': 0}], 'nix_brand_name': "Mott's", 'nix_brand_id': '51db37b5176fe9790a89884d', 'nix_item_name': 'Applesauce, Apple', 'nix_item_id': '52b65841ab70f55d2e00060c', 'metadata': {}, 'source': 8, 'ndb_no': None, 'alt_measures': None, 'lat': None, 'lng': None, 'photo': {'thumb': 'https://assets.syndigo.com/5388fa45-ab38-425f-a1c4-4efb68c17185', 'highres': None, 'is_user_uploaded': False}, 'note': None, 'class_code': None, 'brick_code': None, 'tag_id': None, 'updated_at': '2023-03-15T08:13:24+00:00', 'nf_ingredient_statement': 'Apples, Water, Ascorbic Acid (Vitamin C).'}]}, {'foods': [{'food_name': 'Yogurt, Nonfat, Greek, Caramel Apple Pie', 'brand_name': 'Dannon', 'serving_qty': 1, 'serving_unit': 'cup', 'serving_weight_grams': 150, 'nf_metric_qty': 150, 'nf_metric_uom': 'g', 'nf_calories': 80, 'nf_total_fat': 0, 'nf_saturated_fat': 0, 'nf_cholesterol': 10, 'nf_sodium': 45, 'nf_total_carbohydrate': 9, 'nf_dietary_fiber': 0, 'nf_sugars': 8, 'nf_protein': 12, 'nf_potassium': 160, 'nf_p': None, 'full_nutrients': [{'attr_id': 203, 'value': 12}, {'attr_id': 204, 'value': 0}, {'attr_id': 205, 'value': 9}, {'attr_id': 208, 'value': 80}, {'attr_id': 269, 'value': 8}, {'attr_id': 291, 'value': 0}, {'attr_id': 301, 'value': 140}, {'attr_id': 303, 'value': 0}, {'attr_id': 306, 'value': 160}, {'attr_id': 307, 'value': 45}, {'attr_id': 324, 'value': 0}, {'attr_id': 328, 'value': 0}, {'attr_id': 539, 'value': 2}, {'attr_id': 601, 'value': 10}, {'attr_id': 605, 'value': 0}, {'attr_id': 606, 'value': 0}], 'nix_brand_name': 'Dannon', 'nix_brand_id': '51db37c5176fe9790a89933c', 'nix_item_name': 'Yogurt, Nonfat, Greek, Caramel Apple Pie', 'nix_item_id': '578707998eb128fc315a5be2', 'metadata': {}, 'source': 8, 'ndb_no': None, 'alt_measures': None, 'lat': None, 'lng': None, 'photo': {'thumb': 'https://assets.syndigo.com/c00adaf0-9a64-4852-83fc-7222113b05d2', 'highres': None, 'is_user_uploaded': False}, 'note': None, 'class_code': None, 'brick_code': None, 'tag_id': None, 'updated_at': '2023-08-11T18:58:51+00:00', 'nf_ingredient_statement': 'Cultured Non Fat Milk, Water, Apples, Fructose, Less than 1%: Cinnamon, Natural & Artificial Flavors, Modified Food Starch, Carrageenan, Sucralose, Malic Acid, Acesulfame Potassium, Potassium Sorbate (to Maintain Freshness), Active Yogurt Cultures L. Bulgaricus & S. Thermophilus.'}]}, {'foods': [{'food_name': 'Rice Cakes, Apple Cinnamon', 'brand_name': 'Quaker', 'serving_qty': 1, 'serving_unit': 'cake', 'serving_weight_grams': 13, 'nf_metric_qty': 13, 'nf_metric_uom': 'g', 'nf_calories': 50, 'nf_total_fat': 0, 'nf_saturated_fat': 0, 'nf_cholesterol': 0, 'nf_sodium': 0, 'nf_total_carbohydrate': 11, 'nf_dietary_fiber': 0, 'nf_sugars': 3, 'nf_protein': 0.5, 'nf_potassium': 30, 'nf_p': None, 'full_nutrients': [{'attr_id': 203, 'value': 0.5}, {'attr_id': 204, 'value': 0}, {'attr_id': 205, 'value': 11}, {'attr_id': 208, 'value': 50}, {'attr_id': 269, 'value': 3}, {'attr_id': 291, 'value': 0}, {'attr_id': 301, 'value': 0}, {'attr_id': 303, 'value': 0.2}, {'attr_id': 306, 'value': 30}, {'attr_id': 307, 'value': 0}, {'attr_id': 328, 'value': 0}, {'attr_id': 539, 'value': 3}, {'attr_id': 601, 'value': 0}, {'attr_id': 605, 'value': 0}, {'attr_id': 606, 'value': 0}, {'attr_id': 645, 'value': 0}, {'attr_id': 646, 'value': 0}], 'nix_brand_name': 'Quaker', 'nix_brand_id': '51db37b5176fe9790a898851', 'nix_item_name': 'Rice Cakes, Apple Cinnamon', 'nix_item_id': '51c36eaf97c3e69de4b09495', 'metadata': {}, 'source': 8, 'ndb_no': None, 'alt_measures': None, 'lat': None, 'lng': None, 'photo': {'thumb': 'https://assets.syndigo.com/474b5316-4fb5-4305-911d-fed7f01ac8a8', 'highres': None, 'is_user_uploaded': False}, 'note': None, 'class_code': None, 'brick_code': None, 'tag_id': None, 'updated_at': '2023-08-29T08:01:13+00:00', 'nf_ingredient_statement': 'Whole Grain Brown Rice, Sugar, Fructose, Maltodextrin, Natural Flavor, Cinnamon, Soy Lecithin.'}]}, {'foods': [{'food_name': 'Natural Chicken & Maple Breakfast Sausage Links (Frozen)', 'brand_name': 'Applegate Naturals', 'serving_qty': 3, 'serving_unit': 'links', 'serving_weight_grams': 59, 'nf_metric_qty': 59, 'nf_metric_uom': 'g', 'nf_calories': 110, 'nf_total_fat': 7, 'nf_saturated_fat': 2, 'nf_cholesterol': 45, 'nf_sodium': 390, 'nf_total_carbohydrate': 3, 'nf_dietary_fiber': 0, 'nf_sugars': 3, 'nf_protein': 9, 'nf_potassium': 93, 'nf_p': None, 'full_nutrients': [{'attr_id': 203, 'value': 9}, {'attr_id': 204, 'value': 7}, {'attr_id': 205, 'value': 3}, {'attr_id': 208, 'value': 110}, {'attr_id': 269, 'value': 3}, {'attr_id': 291, 'value': 0}, {'attr_id': 301, 'value': 8}, {'attr_id': 303, 'value': 1}, {'attr_id': 306, 'value': 93}, {'attr_id': 307, 'value': 390}, {'attr_id': 328, 'value': 0}, {'attr_id': 539, 'value': 3}, {'attr_id': 601, 'value': 45}, {'attr_id': 605, 'value': 0}, {'attr_id': 606, 'value': 2}], 'nix_brand_name': 'Applegate Naturals', 'nix_brand_id': '526831043203b9c33900009c', 'nix_item_name': 'Natural Chicken & Maple Breakfast Sausage Links (Frozen)', 'nix_item_id': '51c36af597c3e69de4b07630', 'metadata': {}, 'source': 8, 'ndb_no': None, 'alt_measures': None, 'lat': None, 'lng': None, 'photo': {'thumb': 'https://assets.syndigo.com/ce5bcd05-5c8f-4d79-a0e6-cb0e026bfbb6', 'highres': None, 'is_user_uploaded': False}, 'note': None, 'class_code': None, 'brick_code': None, 'tag_id': None, 'updated_at': '2023-11-10T08:01:19+00:00', 'nf_ingredient_statement': 'Chicken (Chicken Never Administered Antibiotics, Added Growth Hormones, or Fed Animal By-Products. Federal Regulations Prohibit the Use of Added Hormones in Poultry), Water, Cane Sugar, Maple Syrup. Contains Less than 2% of the Following: Salt, Spices, Maple Sugar.'}]}, {'foods': [{'food_name': 'Turkey Bacon, Uncured, Hickory Smoked', 'brand_name': 'Applegate', 'serving_qty': 1, 'serving_unit': 'pan fried slice', 'serving_weight_grams': 15, 'nf_metric_qty': 15, 'nf_metric_uom': 'g', 'nf_calories': 30, 'nf_total_fat': 1.5, 'nf_saturated_fat': 0, 'nf_cholesterol': 20, 'nf_sodium': 150, 'nf_total_carbohydrate': 0, 'nf_dietary_fiber': 0, 'nf_sugars': 0, 'nf_protein': 5, 'nf_potassium': 40, 'nf_p': None, 'full_nutrients': [{'attr_id': 203, 'value': 5}, {'attr_id': 204, 'value': 1.5}, {'attr_id': 205, 'value': 0}, {'attr_id': 208, 'value': 30}, {'attr_id': 269, 'value': 0}, {'attr_id': 291, 'value': 0}, {'attr_id': 301, 'value': 0}, {'attr_id': 303, 'value': 0}, {'attr_id': 306, 'value': 40}, {'attr_id': 307, 'value': 150}, {'attr_id': 324, 'value': 0}, {'attr_id': 328, 'value': 0}, {'attr_id': 539, 'value': 0}, {'attr_id': 601, 'value': 20}, {'attr_id': 605, 'value': 0}, {'attr_id': 606, 'value': 0}], 'nix_brand_name': 'Applegate', 'nix_brand_id': '51db37b5176fe9790a8988b3', 'nix_item_name': 'Turkey Bacon, Uncured, Hickory Smoked', 'nix_item_id': '51c36ade97c3e69de4b07591', 'metadata': {}, 'source': 8, 'ndb_no': None, 'alt_measures': None, 'lat': None, 'lng': None, 'photo': {'thumb': 'https://assets.syndigo.com/897e504e-582d-4f70-b1c0-5717605eac6a', 'highres': None, 'is_user_uploaded': False}, 'note': None, 'class_code': None, 'brick_code': None, 'tag_id': None, 'updated_at': '2023-11-09T21:08:52+00:00', 'nf_ingredient_statement': 'Tukey (Turkey Never Administered Antibiotics or Animal By-Products), Water, Contains Less than 2% of the Following: Sea Salt, Celery Powder, Onion Powder, Spices.'}]}]
                # for q in item_id:
                #     result = nix.item_detail(item_id=q)
                #     if not result.get("message"):
                #         response.append(result)
                #     else:
                #         return Response(result.get("message"), status=400)
                return Response(data)
            except Exception as e:
                return Response({'error': str(e)}, status=500)
        # if item:
        #     if item.get('message'):
        #         return Response(item['message'], status=status.HTTP_404_NOT_FOUND)
        #     elif item.get('foods'):
        #         return Response(item['foods'][0])
        #         # product = Product.get_or_add_product_from_nix(item['foods'][0])
        #         # serializer = self.serializer_class(product)
        #         # return Response(serializer.data)

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

    # @action(detail=False, methods=['post'], url_path="speech")
    # def speech_text(self, request):
    #     query = request.data.get('query')
    #     if query:
    #         return Response(nix.food_detail(query))
    #     return Response({'error': {'query': 'query is required'}}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def search_food(self, request):
        query = request.data.get('query')
        if query:
            try:
                response = []
                # data = [{'foods': [{'food_name': 'apple', 'brand_name': None, 'serving_qty': 1, 'serving_unit': 'medium (3" dia)', 'serving_weight_grams': 182, 'nf_calories': 94.64, 'nf_total_fat': 0.31, 'nf_saturated_fat': 0.05, 'nf_cholesterol': 0, 'nf_sodium': 1.82, 'nf_total_carbohydrate': 25.13, 'nf_dietary_fiber': 4.37, 'nf_sugars': 18.91, 'nf_protein': 0.47, 'nf_potassium': 194.74, 'nf_p': 20.02, 'full_nutrients': [{'attr_id': 203, 'value': 0.4732}, {'attr_id': 204, 'value': 0.3094}, {'attr_id': 205, 'value': 25.1342}, {'attr_id': 207, 'value': 0.3458}, {'attr_id': 208, 'value': 94.64}, {'attr_id': 209, 'value': 0.091}, {'attr_id': 210, 'value': 3.7674}, {'attr_id': 211, 'value': 4.4226}, {'attr_id': 212, 'value': 10.738}, {'attr_id': 213, 'value': 0}, {'attr_id': 214, 'value': 0}, {'attr_id': 221, 'value': 0}, {'attr_id': 255, 'value': 155.7192}, {'attr_id': 262, 'value': 0}, {'attr_id': 263, 'value': 0}, {'attr_id': 268, 'value': 396.76}, {'attr_id': 269, 'value': 18.9098}, {'attr_id': 287, 'value': 0}, {'attr_id': 291, 'value': 4.368}, {'attr_id': 301, 'value': 10.92}, {'attr_id': 303, 'value': 0.2184}, {'attr_id': 304, 'value': 9.1}, {'attr_id': 305, 'value': 20.02}, {'attr_id': 306, 'value': 194.74}, {'attr_id': 307, 'value': 1.82}, {'attr_id': 309, 'value': 0.0728}, {'attr_id': 312, 'value': 0.0491}, {'attr_id': 313, 'value': 6.006}, {'attr_id': 315, 'value': 0.0637}, {'attr_id': 317, 'value': 0}, {'attr_id': 318, 'value': 98.28}, {'attr_id': 319, 'value': 0}, {'attr_id': 320, 'value': 5.46}, {'attr_id': 321, 'value': 49.14}, {'attr_id': 322, 'value': 0}, {'attr_id': 323, 'value': 0.3276}, {'attr_id': 324, 'value': 0}, {'attr_id': 328, 'value': 0}, {'attr_id': 334, 'value': 20.02}, {'attr_id': 337, 'value': 0}, {'attr_id': 338, 'value': 52.78}, {'attr_id': 341, 'value': 0}, {'attr_id': 342, 'value': 0}, {'attr_id': 343, 'value': 0}, {'attr_id': 401, 'value': 8.372}, {'attr_id': 404, 'value': 0.0309}, {'attr_id': 405, 'value': 0.0473}, {'attr_id': 406, 'value': 0.1656}, {'attr_id': 410, 'value': 0.111}, {'attr_id': 415, 'value': 0.0746}, {'attr_id': 417, 'value': 5.46}, {'attr_id': 418, 'value': 0}, {'attr_id': 421, 'value': 6.188}, {'attr_id': 429, 'value': 0}, {'attr_id': 430, 'value': 4.004}, {'attr_id': 431, 'value': 0}, {'attr_id': 432, 'value': 5.46}, {'attr_id': 435, 'value': 5.46}, {'attr_id': 454, 'value': 0.182}, {'attr_id': 501, 'value': 0.0018}, {'attr_id': 502, 'value': 0.0109}, {'attr_id': 503, 'value': 0.0109}, {'attr_id': 504, 'value': 0.0237}, {'attr_id': 505, 'value': 0.0218}, {'attr_id': 506, 'value': 0.0018}, {'attr_id': 507, 'value': 0.0018}, {'attr_id': 508, 'value': 0.0109}, {'attr_id': 509, 'value': 0.0018}, {'attr_id': 510, 'value': 0.0218}, {'attr_id': 511, 'value': 0.0109}, {'attr_id': 512, 'value': 0.0091}, {'attr_id': 513, 'value': 0.02}, {'attr_id': 514, 'value': 0.1274}, {'attr_id': 515, 'value': 0.0455}, {'attr_id': 516, 'value': 0.0164}, {'attr_id': 517, 'value': 0.0109}, {'attr_id': 518, 'value': 0.0182}, {'attr_id': 601, 'value': 0}, {'attr_id': 605, 'value': 0}, {'attr_id': 606, 'value': 0.051}, {'attr_id': 607, 'value': 0}, {'attr_id': 608, 'value': 0}, {'attr_id': 609, 'value': 0}, {'attr_id': 610, 'value': 0}, {'attr_id': 611, 'value': 0}, {'attr_id': 612, 'value': 0.0018}, {'attr_id': 613, 'value': 0.0437}, {'attr_id': 614, 'value': 0.0055}, {'attr_id': 617, 'value': 0.0127}, {'attr_id': 618, 'value': 0.0783}, {'attr_id': 619, 'value': 0.0164}, {'attr_id': 620, 'value': 0}, {'attr_id': 621, 'value': 0}, {'attr_id': 626, 'value': 0}, {'attr_id': 627, 'value': 0}, {'attr_id': 628, 'value': 0}, {'attr_id': 629, 'value': 0}, {'attr_id': 630, 'value': 0}, {'attr_id': 631, 'value': 0}, {'attr_id': 636, 'value': 21.84}, {'attr_id': 645, 'value': 0.0127}, {'attr_id': 646, 'value': 0.0928}], 'nix_brand_name': None, 'nix_brand_id': None, 'nix_item_name': None, 'nix_item_id': None, 'upc': None, 'consumed_at': '2024-05-20T07:11:17+00:00', 'metadata': {'is_raw_food': False}, 'source': 1, 'ndb_no': 9003, 'tags': {'item': 'apple', 'measure': None, 'quantity': '1.0', 'food_group': 3, 'tag_id': 384}, 'alt_measures': [{'serving_weight': 125, 'measure': 'cup, quartered or chopped', 'seq': 1, 'qty': 1}, {'serving_weight': 109, 'measure': 'cup slices', 'seq': 2, 'qty': 1}, {'serving_weight': 223, 'measure': 'large (3-1/4" dia)', 'seq': 3, 'qty': 1}, {'serving_weight': 182, 'measure': 'medium (3" dia)', 'seq': 4, 'qty': 1}, {'serving_weight': 149, 'measure': 'small (2-3/4" dia)', 'seq': 5, 'qty': 1}, {'serving_weight': 101, 'measure': 'extra small (2-1/2" dia)', 'seq': 6, 'qty': 1}, {'serving_weight': 242, 'measure': 'NLEA serving', 'seq': 7, 'qty': 1}, {'serving_weight': 28.35, 'measure': 'oz', 'seq': 80, 'qty': 1}, {'serving_weight': 100, 'measure': 'g', 'seq': None, 'qty': 100}], 'lat': None, 'lng': None, 'meal_type': 1, 'photo': {'thumb': 'https://nix-tag-images.s3.amazonaws.com/384_thumb.jpg', 'highres': 'https://nix-tag-images.s3.amazonaws.com/384_highres.jpg', 'is_user_uploaded': False}, 'sub_recipe': None, 'class_code': None, 'brick_code': None, 'tag_id': None}]}, {'foods': [{'food_name': 'apples', 'brand_name': None, 'serving_qty': 1, 'serving_unit': 'medium (3" dia)', 'serving_weight_grams': 182, 'nf_calories': 94.64, 'nf_total_fat': 0.31, 'nf_saturated_fat': 0.05, 'nf_cholesterol': 0, 'nf_sodium': 1.82, 'nf_total_carbohydrate': 25.13, 'nf_dietary_fiber': 4.37, 'nf_sugars': 18.91, 'nf_protein': 0.47, 'nf_potassium': 194.74, 'nf_p': 20.02, 'full_nutrients': [{'attr_id': 203, 'value': 0.4732}, {'attr_id': 204, 'value': 0.3094}, {'attr_id': 205, 'value': 25.1342}, {'attr_id': 207, 'value': 0.3458}, {'attr_id': 208, 'value': 94.64}, {'attr_id': 209, 'value': 0.091}, {'attr_id': 210, 'value': 3.7674}, {'attr_id': 211, 'value': 4.4226}, {'attr_id': 212, 'value': 10.738}, {'attr_id': 213, 'value': 0}, {'attr_id': 214, 'value': 0}, {'attr_id': 221, 'value': 0}, {'attr_id': 255, 'value': 155.7192}, {'attr_id': 262, 'value': 0}, {'attr_id': 263, 'value': 0}, {'attr_id': 268, 'value': 396.76}, {'attr_id': 269, 'value': 18.9098}, {'attr_id': 287, 'value': 0}, {'attr_id': 291, 'value': 4.368}, {'attr_id': 301, 'value': 10.92}, {'attr_id': 303, 'value': 0.2184}, {'attr_id': 304, 'value': 9.1}, {'attr_id': 305, 'value': 20.02}, {'attr_id': 306, 'value': 194.74}, {'attr_id': 307, 'value': 1.82}, {'attr_id': 309, 'value': 0.0728}, {'attr_id': 312, 'value': 0.0491}, {'attr_id': 313, 'value': 6.006}, {'attr_id': 315, 'value': 0.0637}, {'attr_id': 317, 'value': 0}, {'attr_id': 318, 'value': 98.28}, {'attr_id': 319, 'value': 0}, {'attr_id': 320, 'value': 5.46}, {'attr_id': 321, 'value': 49.14}, {'attr_id': 322, 'value': 0}, {'attr_id': 323, 'value': 0.3276}, {'attr_id': 324, 'value': 0}, {'attr_id': 328, 'value': 0}, {'attr_id': 334, 'value': 20.02}, {'attr_id': 337, 'value': 0}, {'attr_id': 338, 'value': 52.78}, {'attr_id': 341, 'value': 0}, {'attr_id': 342, 'value': 0}, {'attr_id': 343, 'value': 0}, {'attr_id': 401, 'value': 8.372}, {'attr_id': 404, 'value': 0.0309}, {'attr_id': 405, 'value': 0.0473}, {'attr_id': 406, 'value': 0.1656}, {'attr_id': 410, 'value': 0.111}, {'attr_id': 415, 'value': 0.0746}, {'attr_id': 417, 'value': 5.46}, {'attr_id': 418, 'value': 0}, {'attr_id': 421, 'value': 6.188}, {'attr_id': 429, 'value': 0}, {'attr_id': 430, 'value': 4.004}, {'attr_id': 431, 'value': 0}, {'attr_id': 432, 'value': 5.46}, {'attr_id': 435, 'value': 5.46}, {'attr_id': 454, 'value': 0.182}, {'attr_id': 501, 'value': 0.0018}, {'attr_id': 502, 'value': 0.0109}, {'attr_id': 503, 'value': 0.0109}, {'attr_id': 504, 'value': 0.0237}, {'attr_id': 505, 'value': 0.0218}, {'attr_id': 506, 'value': 0.0018}, {'attr_id': 507, 'value': 0.0018}, {'attr_id': 508, 'value': 0.0109}, {'attr_id': 509, 'value': 0.0018}, {'attr_id': 510, 'value': 0.0218}, {'attr_id': 511, 'value': 0.0109}, {'attr_id': 512, 'value': 0.0091}, {'attr_id': 513, 'value': 0.02}, {'attr_id': 514, 'value': 0.1274}, {'attr_id': 515, 'value': 0.0455}, {'attr_id': 516, 'value': 0.0164}, {'attr_id': 517, 'value': 0.0109}, {'attr_id': 518, 'value': 0.0182}, {'attr_id': 601, 'value': 0}, {'attr_id': 605, 'value': 0}, {'attr_id': 606, 'value': 0.051}, {'attr_id': 607, 'value': 0}, {'attr_id': 608, 'value': 0}, {'attr_id': 609, 'value': 0}, {'attr_id': 610, 'value': 0}, {'attr_id': 611, 'value': 0}, {'attr_id': 612, 'value': 0.0018}, {'attr_id': 613, 'value': 0.0437}, {'attr_id': 614, 'value': 0.0055}, {'attr_id': 617, 'value': 0.0127}, {'attr_id': 618, 'value': 0.0783}, {'attr_id': 619, 'value': 0.0164}, {'attr_id': 620, 'value': 0}, {'attr_id': 621, 'value': 0}, {'attr_id': 626, 'value': 0}, {'attr_id': 627, 'value': 0}, {'attr_id': 628, 'value': 0}, {'attr_id': 629, 'value': 0}, {'attr_id': 630, 'value': 0}, {'attr_id': 631, 'value': 0}, {'attr_id': 636, 'value': 21.84}, {'attr_id': 645, 'value': 0.0127}, {'attr_id': 646, 'value': 0.0928}], 'nix_brand_name': None, 'nix_brand_id': None, 'nix_item_name': None, 'nix_item_id': None, 'upc': None, 'consumed_at': '2024-05-20T07:11:18+00:00', 'metadata': {'is_raw_food': False}, 'source': 1, 'ndb_no': 9003, 'tags': {'item': 'apple', 'measure': None, 'quantity': '1.0', 'food_group': 3, 'tag_id': 384}, 'alt_measures': [{'serving_weight': 125, 'measure': 'cup, quartered or chopped', 'seq': 1, 'qty': 1}, {'serving_weight': 109, 'measure': 'cup slices', 'seq': 2, 'qty': 1}, {'serving_weight': 223, 'measure': 'large (3-1/4" dia)', 'seq': 3, 'qty': 1}, {'serving_weight': 182, 'measure': 'medium (3" dia)', 'seq': 4, 'qty': 1}, {'serving_weight': 149, 'measure': 'small (2-3/4" dia)', 'seq': 5, 'qty': 1}, {'serving_weight': 101, 'measure': 'extra small (2-1/2" dia)', 'seq': 6, 'qty': 1}, {'serving_weight': 242, 'measure': 'NLEA serving', 'seq': 7, 'qty': 1}, {'serving_weight': 28.35, 'measure': 'oz', 'seq': 80, 'qty': 1}, {'serving_weight': 100, 'measure': 'g', 'seq': None, 'qty': 100}], 'lat': None, 'lng': None, 'meal_type': 1, 'photo': {'thumb': 'https://nix-tag-images.s3.amazonaws.com/384_thumb.jpg', 'highres': 'https://nix-tag-images.s3.amazonaws.com/384_highres.jpg', 'is_user_uploaded': False}, 'sub_recipe': None, 'class_code': None, 'brick_code': None, 'tag_id': None}]}, {'foods': [{'food_name': 'appletini', 'brand_name': None, 'serving_qty': 1, 'serving_unit': 'cocktail', 'serving_weight_grams': 84.75, 'nf_calories': 149.11, 'nf_total_fat': 0.01, 'nf_saturated_fat': 0, 'nf_cholesterol': 0, 'nf_sodium': 3.12, 'nf_total_carbohydrate': 6.69, 'nf_dietary_fiber': 0.05, 'nf_sugars': 6.37, 'nf_protein': 0.03, 'nf_potassium': 9.09, 'nf_p': 3.25, 'full_nutrients': [{'attr_id': 203, 'value': 0.0343}, {'attr_id': 204, 'value': 0.0053}, {'attr_id': 205, 'value': 6.6939}, {'attr_id': 207, 'value': 0.0401}, {'attr_id': 208, 'value': 149.1117}, {'attr_id': 210, 'value': 6.2541}, {'attr_id': 211, 'value': 0.0641}, {'attr_id': 212, 'value': 0.0534}, {'attr_id': 213, 'value': 0}, {'attr_id': 214, 'value': 0}, {'attr_id': 221, 'value': 17.8659}, {'attr_id': 255, 'value': 60.1141}, {'attr_id': 262, 'value': 0}, {'attr_id': 263, 'value': 0}, {'attr_id': 268, 'value': 624.1394}, {'attr_id': 269, 'value': 6.3708}, {'attr_id': 287, 'value': 0}, {'attr_id': 291, 'value': 0.0534}, {'attr_id': 301, 'value': 1.3461}, {'attr_id': 303, 'value': 0.0165}, {'attr_id': 304, 'value': 0.7074}, {'attr_id': 305, 'value': 3.2459}, {'attr_id': 306, 'value': 9.0864}, {'attr_id': 307, 'value': 3.1222}, {'attr_id': 309, 'value': 0.0215}, {'attr_id': 312, 'value': 0.0102}, {'attr_id': 313, 'value': 12.3641}, {'attr_id': 315, 'value': 0.0035}, {'attr_id': 317, 'value': 0.0452}, {'attr_id': 318, 'value': 2.5163}, {'attr_id': 319, 'value': 0}, {'attr_id': 320, 'value': 0.1525}, {'attr_id': 321, 'value': 0}, {'attr_id': 322, 'value': 0}, {'attr_id': 323, 'value': 0.0175}, {'attr_id': 324, 'value': 0}, {'attr_id': 328, 'value': 0}, {'attr_id': 334, 'value': 3.05}, {'attr_id': 337, 'value': 0}, {'attr_id': 338, 'value': 0.8388}, {'attr_id': 341, 'value': 0}, {'attr_id': 342, 'value': 0}, {'attr_id': 343, 'value': 0}, {'attr_id': 344, 'value': 0}, {'attr_id': 345, 'value': 0}, {'attr_id': 346, 'value': 0}, {'attr_id': 347, 'value': 0}, {'attr_id': 401, 'value': 1.0904}, {'attr_id': 404, 'value': 0.0044}, {'attr_id': 405, 'value': 0.0059}, {'attr_id': 406, 'value': 0.0152}, {'attr_id': 410, 'value': 0.0061}, {'attr_id': 415, 'value': 0.0029}, {'attr_id': 417, 'value': 0.6863}, {'attr_id': 418, 'value': 0}, {'attr_id': 421, 'value': 0.3889}, {'attr_id': 428, 'value': 0}, {'attr_id': 429, 'value': 0}, {'attr_id': 430, 'value': 0.0076}, {'attr_id': 431, 'value': 0}, {'attr_id': 432, 'value': 0.6863}, {'attr_id': 435, 'value': 0.6863}, {'attr_id': 501, 'value': 0}, {'attr_id': 502, 'value': 0}, {'attr_id': 503, 'value': 0}, {'attr_id': 504, 'value': 0}, {'attr_id': 505, 'value': 0}, {'attr_id': 506, 'value': 0}, {'attr_id': 507, 'value': 0}, {'attr_id': 508, 'value': 0}, {'attr_id': 509, 'value': 0}, {'attr_id': 510, 'value': 0}, {'attr_id': 511, 'value': 0}, {'attr_id': 512, 'value': 0}, {'attr_id': 513, 'value': 0}, {'attr_id': 514, 'value': 0}, {'attr_id': 515, 'value': 0}, {'attr_id': 516, 'value': 0}, {'attr_id': 517, 'value': 0}, {'attr_id': 518, 'value': 0}, {'attr_id': 601, 'value': 0}, {'attr_id': 605, 'value': 0}, {'attr_id': 606, 'value': 0.0021}, {'attr_id': 607, 'value': 0}, {'attr_id': 608, 'value': 0}, {'attr_id': 609, 'value': 0}, {'attr_id': 610, 'value': 0}, {'attr_id': 611, 'value': 0}, {'attr_id': 612, 'value': 0.0002}, {'attr_id': 613, 'value': 0.0011}, {'attr_id': 614, 'value': 0.0005}, {'attr_id': 615, 'value': 0}, {'attr_id': 617, 'value': 0.0005}, {'attr_id': 618, 'value': 0.0008}, {'attr_id': 619, 'value': 0.0005}, {'attr_id': 620, 'value': 0}, {'attr_id': 621, 'value': 0}, {'attr_id': 624, 'value': 0}, {'attr_id': 625, 'value': 0}, {'attr_id': 626, 'value': 0}, {'attr_id': 627, 'value': 0}, {'attr_id': 628, 'value': 0}, {'attr_id': 629, 'value': 0}, {'attr_id': 630, 'value': 0}, {'attr_id': 631, 'value': 0}, {'attr_id': 645, 'value': 0.0005}, {'attr_id': 646, 'value': 0.0013}, {'attr_id': 652, 'value': 0.0002}, {'attr_id': 653, 'value': 0}, {'attr_id': 654, 'value': 0}, {'attr_id': 662, 'value': 0}, {'attr_id': 663, 'value': 0}, {'attr_id': 664, 'value': 0}, {'attr_id': 670, 'value': 0}, {'attr_id': 671, 'value': 0}, {'attr_id': 672, 'value': 0}, {'attr_id': 673, 'value': 0}, {'attr_id': 674, 'value': 0.0005}, {'attr_id': 675, 'value': 0.0008}, {'attr_id': 676, 'value': 0}, {'attr_id': 685, 'value': 0}, {'attr_id': 687, 'value': 0}, {'attr_id': 689, 'value': 0}, {'attr_id': 693, 'value': 0}, {'attr_id': 695, 'value': 0}, {'attr_id': 697, 'value': 0}, {'attr_id': 852, 'value': 0}, {'attr_id': 853, 'value': 0}, {'attr_id': 858, 'value': 0}], 'nix_brand_name': None, 'nix_brand_id': None, 'nix_item_name': None, 'nix_item_id': None, 'upc': None, 'consumed_at': '2024-05-20T07:11:19+00:00', 'metadata': {'is_raw_food': False}, 'source': 1, 'ndb_no': 1002010, 'tags': {'item': 'appletini', 'measure': None, 'quantity': '1.0', 'food_group': 9, 'tag_id': 5031}, 'alt_measures': [{'serving_weight': 84.75, 'measure': 'cocktail', 'seq': 1, 'qty': 1}, {'serving_weight': 29, 'measure': 'fl oz', 'seq': 2, 'qty': 1}, {'serving_weight': 100, 'measure': 'g', 'seq': None, 'qty': 100}, {'serving_weight': 232, 'measure': 'cup', 'seq': 100, 'qty': 1}, {'serving_weight': 4.83, 'measure': 'tsp', 'seq': 101, 'qty': 1}, {'serving_weight': 14.5, 'measure': 'tbsp', 'seq': 102, 'qty': 1}], 'lat': None, 'lng': None, 'meal_type': 1, 'photo': {'thumb': 'https://nix-tag-images.s3.amazonaws.com/5031_thumb.jpg', 'highres': 'https://nix-tag-images.s3.amazonaws.com/5031_highres.jpg', 'is_user_uploaded': False}, 'sub_recipe': None, 'class_code': None, 'brick_code': None, 'tag_id': None}]}, {'foods': [{'food_name': 'apple pie', 'brand_name': None, 'serving_qty': 1, 'serving_unit': 'piece (1/8 of 9" dia)', 'serving_weight_grams': 125, 'nf_calories': 296.25, 'nf_total_fat': 13.75, 'nf_saturated_fat': 4.75, 'nf_cholesterol': 0, 'nf_sodium': 251.25, 'nf_total_carbohydrate': 42.5, 'nf_dietary_fiber': 2, 'nf_sugars': 19.56, 'nf_protein': 2.38, 'nf_potassium': 81.25, 'nf_p': 30, 'full_nutrients': [{'attr_id': 203, 'value': 2.375}, {'attr_id': 204, 'value': 13.75}, {'attr_id': 205, 'value': 42.5}, {'attr_id': 207, 'value': 1.125}, {'attr_id': 208, 'value': 296.25}, {'attr_id': 221, 'value': 0}, {'attr_id': 255, 'value': 65.25}, {'attr_id': 262, 'value': 0}, {'attr_id': 263, 'value': 0}, {'attr_id': 268, 'value': 1240}, {'attr_id': 269, 'value': 19.5625}, {'attr_id': 291, 'value': 2}, {'attr_id': 301, 'value': 13.75}, {'attr_id': 303, 'value': 0.5625}, {'attr_id': 304, 'value': 8.75}, {'attr_id': 305, 'value': 30}, {'attr_id': 306, 'value': 81.25}, {'attr_id': 307, 'value': 251.25}, {'attr_id': 309, 'value': 0.2}, {'attr_id': 312, 'value': 0.0575}, {'attr_id': 315, 'value': 0.2275}, {'attr_id': 317, 'value': 1.25}, {'attr_id': 318, 'value': 155}, {'attr_id': 319, 'value': 38.75}, {'attr_id': 320, 'value': 40}, {'attr_id': 321, 'value': 11.25}, {'attr_id': 322, 'value': 0}, {'attr_id': 323, 'value': 1.9}, {'attr_id': 324, 'value': 0}, {'attr_id': 328, 'value': 0}, {'attr_id': 334, 'value': 7.5}, {'attr_id': 337, 'value': 0}, {'attr_id': 338, 'value': 11.25}, {'attr_id': 401, 'value': 4}, {'attr_id': 404, 'value': 0.035}, {'attr_id': 405, 'value': 0.0338}, {'attr_id': 406, 'value': 0.3288}, {'attr_id': 410, 'value': 0.1488}, {'attr_id': 415, 'value': 0.0475}, {'attr_id': 417, 'value': 33.75}, {'attr_id': 418, 'value': 0.0125}, {'attr_id': 421, 'value': 9}, {'attr_id': 430, 'value': 4.375}, {'attr_id': 431, 'value': 28.75}, {'attr_id': 432, 'value': 5}, {'attr_id': 435, 'value': 53.75}, {'attr_id': 454, 'value': 20.5}, {'attr_id': 501, 'value': 0.0325}, {'attr_id': 502, 'value': 0.0675}, {'attr_id': 503, 'value': 0.0913}, {'attr_id': 504, 'value': 0.1613}, {'attr_id': 505, 'value': 0.0875}, {'attr_id': 506, 'value': 0.04}, {'attr_id': 507, 'value': 0.05}, {'attr_id': 508, 'value': 0.11}, {'attr_id': 509, 'value': 0.0675}, {'attr_id': 510, 'value': 0.105}, {'attr_id': 511, 'value': 0.0925}, {'attr_id': 512, 'value': 0.0475}, {'attr_id': 513, 'value': 0.075}, {'attr_id': 514, 'value': 0.1188}, {'attr_id': 515, 'value': 0.7338}, {'attr_id': 516, 'value': 0.0813}, {'attr_id': 517, 'value': 0.2488}, {'attr_id': 518, 'value': 0.1238}, {'attr_id': 601, 'value': 0}, {'attr_id': 606, 'value': 4.7463}, {'attr_id': 607, 'value': 0}, {'attr_id': 608, 'value': 0}, {'attr_id': 609, 'value': 0}, {'attr_id': 610, 'value': 0}, {'attr_id': 611, 'value': 0.0263}, {'attr_id': 612, 'value': 0.1575}, {'attr_id': 613, 'value': 2.5775}, {'attr_id': 614, 'value': 1.9175}, {'attr_id': 617, 'value': 5.1363}, {'attr_id': 618, 'value': 2.5825}, {'attr_id': 619, 'value': 0.1538}, {'attr_id': 620, 'value': 0}, {'attr_id': 621, 'value': 0}, {'attr_id': 626, 'value': 0.1825}, {'attr_id': 627, 'value': 0}, {'attr_id': 628, 'value': 0}, {'attr_id': 629, 'value': 0}, {'attr_id': 630, 'value': 0}, {'attr_id': 631, 'value': 0}, {'attr_id': 645, 'value': 5.485}, {'attr_id': 646, 'value': 2.7475}], 'nix_brand_name': None, 'nix_brand_id': None, 'nix_item_name': None, 'nix_item_id': None, 'upc': None, 'consumed_at': '2024-05-20T07:11:22+00:00', 'metadata': {'is_raw_food': False}, 'source': 1, 'ndb_no': 18301, 'tags': {'item': 'Apple pie', 'measure': None, 'quantity': '1.0', 'food_group': 8, 'tag_id': 15060}, 'alt_measures': [{'serving_weight': 28.35, 'measure': 'oz', 'seq': 1, 'qty': 1}, {'serving_weight': 125, 'measure': 'piece (1/8 of 9" dia)', 'seq': 2, 'qty': 1}, {'serving_weight': 117, 'measure': 'piece (1/6 of 8" pie)', 'seq': 3, 'qty': 1}, {'serving_weight': 100, 'measure': 'g', 'seq': None, 'qty': 100}], 'lat': None, 'lng': None, 'meal_type': 1, 'photo': {'thumb': 'https://nix-tag-images.s3.amazonaws.com/1291_thumb.jpg', 'highres': 'https://nix-tag-images.s3.amazonaws.com/1291_highres.jpg', 'is_user_uploaded': False}, 'sub_recipe': None, 'class_code': None, 'brick_code': None, 'tag_id': None}]}, {'foods': [{'food_name': 'applesauce', 'brand_name': None, 'serving_qty': 1, 'serving_unit': 'container', 'serving_weight_grams': 111, 'nf_calories': 75.48, 'nf_total_fat': 0.19, 'nf_saturated_fat': 0.03, 'nf_cholesterol': 0, 'nf_sodium': 2.22, 'nf_total_carbohydrate': 19.41, 'nf_dietary_fiber': 1.33, 'nf_sugars': 16.28, 'nf_protein': 0.18, 'nf_potassium': 83.25, 'nf_p': 6.66, 'full_nutrients': [{'attr_id': 203, 'value': 0.1776}, {'attr_id': 204, 'value': 0.1887}, {'attr_id': 205, 'value': 19.4139}, {'attr_id': 207, 'value': 0.2331}, {'attr_id': 208, 'value': 75.48}, {'attr_id': 210, 'value': 1.11}, {'attr_id': 211, 'value': 6.105}, {'attr_id': 212, 'value': 8.0697}, {'attr_id': 213, 'value': 0}, {'attr_id': 214, 'value': 0.9879}, {'attr_id': 221, 'value': 0}, {'attr_id': 255, 'value': 90.9978}, {'attr_id': 262, 'value': 0}, {'attr_id': 263, 'value': 0}, {'attr_id': 268, 'value': 314.13}, {'attr_id': 269, 'value': 16.2837}, {'attr_id': 287, 'value': 0}, {'attr_id': 291, 'value': 1.332}, {'attr_id': 301, 'value': 3.33}, {'attr_id': 303, 'value': 0.1332}, {'attr_id': 304, 'value': 3.33}, {'attr_id': 305, 'value': 6.66}, {'attr_id': 306, 'value': 83.25}, {'attr_id': 307, 'value': 2.22}, {'attr_id': 309, 'value': 0.0333}, {'attr_id': 312, 'value': 0.0355}, {'attr_id': 315, 'value': 0.0333}, {'attr_id': 317, 'value': 0.333}, {'attr_id': 318, 'value': 6.66}, {'attr_id': 319, 'value': 0}, {'attr_id': 320, 'value': 0}, {'attr_id': 321, 'value': 3.33}, {'attr_id': 322, 'value': 0}, {'attr_id': 323, 'value': 0.1998}, {'attr_id': 324, 'value': 0}, {'attr_id': 328, 'value': 0}, {'attr_id': 334, 'value': 2.22}, {'attr_id': 337, 'value': 0}, {'attr_id': 338, 'value': 19.98}, {'attr_id': 341, 'value': 0}, {'attr_id': 342, 'value': 0}, {'attr_id': 343, 'value': 0}, {'attr_id': 344, 'value': 0.0111}, {'attr_id': 345, 'value': 0}, {'attr_id': 346, 'value': 0}, {'attr_id': 347, 'value': 0}, {'attr_id': 401, 'value': 1.887}, {'attr_id': 404, 'value': 0.0189}, {'attr_id': 405, 'value': 0.0244}, {'attr_id': 406, 'value': 0.0799}, {'attr_id': 410, 'value': 0.0488}, {'attr_id': 415, 'value': 0.03}, {'attr_id': 417, 'value': 1.11}, {'attr_id': 418, 'value': 0}, {'attr_id': 421, 'value': 3.663}, {'attr_id': 428, 'value': 0}, {'attr_id': 429, 'value': 0}, {'attr_id': 430, 'value': 0.666}, {'attr_id': 431, 'value': 0}, {'attr_id': 432, 'value': 1.11}, {'attr_id': 435, 'value': 1.11}, {'attr_id': 501, 'value': 0.0022}, {'attr_id': 502, 'value': 0.0078}, {'attr_id': 503, 'value': 0.0078}, {'attr_id': 504, 'value': 0.0122}, {'attr_id': 505, 'value': 0.0122}, {'attr_id': 506, 'value': 0.0022}, {'attr_id': 507, 'value': 0.0022}, {'attr_id': 508, 'value': 0.0056}, {'attr_id': 509, 'value': 0.0033}, {'attr_id': 510, 'value': 0.0089}, {'attr_id': 511, 'value': 0.0067}, {'attr_id': 512, 'value': 0.0033}, {'attr_id': 513, 'value': 0.0078}, {'attr_id': 514, 'value': 0.0355}, {'attr_id': 515, 'value': 0.0211}, {'attr_id': 516, 'value': 0.0078}, {'attr_id': 517, 'value': 0.0067}, {'attr_id': 518, 'value': 0.0078}, {'attr_id': 601, 'value': 0}, {'attr_id': 605, 'value': 0}, {'attr_id': 606, 'value': 0.0333}, {'attr_id': 607, 'value': 0}, {'attr_id': 608, 'value': 0}, {'attr_id': 609, 'value': 0}, {'attr_id': 610, 'value': 0}, {'attr_id': 611, 'value': 0.0011}, {'attr_id': 612, 'value': 0.0011}, {'attr_id': 613, 'value': 0.0278}, {'attr_id': 614, 'value': 0.0044}, {'attr_id': 617, 'value': 0.0078}, {'attr_id': 618, 'value': 0.05}, {'attr_id': 619, 'value': 0.01}, {'attr_id': 620, 'value': 0}, {'attr_id': 621, 'value': 0}, {'attr_id': 626, 'value': 0}, {'attr_id': 627, 'value': 0}, {'attr_id': 628, 'value': 0}, {'attr_id': 629, 'value': 0}, {'attr_id': 630, 'value': 0}, {'attr_id': 631, 'value': 0}, {'attr_id': 645, 'value': 0.0078}, {'attr_id': 646, 'value': 0.0599}], 'nix_brand_name': None, 'nix_brand_id': None, 'nix_item_name': None, 'nix_item_id': None, 'upc': None, 'consumed_at': '2024-05-20T07:11:24+00:00', 'metadata': {'is_raw_food': False}, 'source': 1, 'ndb_no': 9020, 'tags': {'item': 'apple sauce', 'measure': None, 'quantity': '1.0', 'food_group': 3, 'tag_id': 386}, 'alt_measures': [{'serving_weight': 246, 'measure': 'cup', 'seq': 1, 'qty': 1}, {'serving_weight': 111, 'measure': 'container', 'seq': 80, 'qty': 1}, {'serving_weight': 90, 'measure': 'pouch', 'seq': 81, 'qty': 1}, {'serving_weight': 100, 'measure': 'g', 'seq': None, 'qty': 100}, {'serving_weight': 28.3495, 'measure': 'wt. oz', 'seq': None, 'qty': 1}, {'serving_weight': 5.13, 'measure': 'tsp', 'seq': 101, 'qty': 1}, {'serving_weight': 15.38, 'measure': 'tbsp', 'seq': 102, 'qty': 1}], 'lat': None, 'lng': None, 'meal_type': 1, 'photo': {'thumb': 'https://nix-tag-images.s3.amazonaws.com/386_thumb.jpg', 'highres': 'https://nix-tag-images.s3.amazonaws.com/386_highres.jpg', 'is_user_uploaded': False}, 'sub_recipe': None, 'class_code': None, 'brick_code': None, 'tag_id': None}]}]
                for q in query:
                    result = nix.food_detail(q)
                    if not result.get("message"):
                        response.append(result)
                    else:
                        return Response(result.get("message"), status=400)
                return Response(response)
            except Exception as e:
                return Response({'error': str(e)}, status=500)
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
        return Meal.objects.filter(user=self.request.user).order_by("-id")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        meal_time = request.data.get('meal_time')
        instance.no_of_meals = len(meal_time)
        meal_list = []
        user = instance.user
        user.number_of_meal = len(meal_time)
        user.save()
        for i in meal_time:
            meal_list.append(MealTime(user=self.request.user, meal_id=instance.id,
                                      date_time=i["mealTime"], meal_name=f"meal_{i['mealTime']}"))
        MealTime.objects.bulk_create(meal_list)
        return Response()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        user = queryset.first().user
        no_of_meals = user.number_of_meal
        current_date = timezone.now().date()
        meal_times = MealTime.objects.filter(meal_id=queryset.first().id).order_by('-id')[:no_of_meals]
        data = []
        data_object = {}
        meals_serializer = MealTimeSerializer(meal_times, many=True, context={'current_date': current_date})
        data_object.update(
            {
                "id": queryset.first().id,
                "no_of_meals": queryset.first().no_of_meals,
                "meal_times": meals_serializer.data,
            }
        )
        data.append(data_object)
        return Response(data_object)

    @action(detail=False, methods=['get'])
    def history(self, request, pk=None):
        user = self.request.user
        meal_id = Meal.objects.filter(user=user).last().id
        current_datetime = timezone.now()
        data = []
        # .annotate(
        # food_items_count=Count('food_items_times')).filter(food_items_count__gt=0)
        user_meal_times_ids = MealTime.objects.filter(meal__user=user).order_by("-date_time__date").values_list("id",
                                                                                                                flat=True)
        unique_dates = FoodItem.objects.filter(meal_time_id__in=user_meal_times_ids).order_by(
            "-created__date").distinct("created__date").values_list("created__date", flat=True)
        # serializer = MealTimeSerializer(all_meal_times, many=True, context={'current_date': current_datetime})
        # return Response(serializer.data)
        # unique_dates = MealTime.objects.filter(meal__user=user).order_by("-date_time__date").distinct(
        #     "date_time__date").values_list("date_time__date", flat=True)
        req_calories = CaloriesRequired.objects.filter(user=self.request.user).last()
        for date in unique_dates:
            new_data = []
            if date == current_datetime.date():
                for meal_time in user_meal_times_ids:
                    food_item_meals = FoodItem.objects.filter(
                        created__date=current_datetime.date(), meal_time_id=meal_time,
                        created__lte=current_datetime).order_by("meal_time__date_time")
                    if not food_item_meals.exists():
                        pass
                    else:
                        serializer = FoodItemSerializer(food_item_meals, many=True)
                        new_data.append({"id": food_item_meals.first().meal_time.id,
                                         "date_time": food_item_meals.first().meal_time.date_time,
                                         "food_items": serializer.data})
                data.append({str(date): new_data})
            else:
                for meal_time in user_meal_times_ids:
                    food_item_meals = FoodItem.objects.filter(
                        created__date=date, meal_time_id=meal_time).order_by("meal_time__date_time")
                    if not food_item_meals.exists():
                        pass
                    else:
                        serializer = FoodItemSerializer(food_item_meals, many=True)
                        new_data.append({"id": food_item_meals.first().meal_time.id,
                                         "date_time": str(food_item_meals.first().meal_time.date_time),
                                         "food_items": serializer.data})
                data.append({str(date): new_data})

        return Response(data)

    @action(detail=True, methods=['post'])
    def add_log_food(self, request, pk):
        meal = Meal.objects.get(pk=pk)
        meal_history = MealHistory.objects.filter(meal_id=meal.id, meal_date_time__date=timezone.now().date())
        if not meal_history.exists():
            meal_history = MealHistory.objects.create(meal_id=meal.id, meal_date_time=timezone.now(), user=meal.user)
        else:
            meal_history = meal_history.last()
        message = ''
        data = request.data
        if data:
            meal_time_id = request.data[0]['meal_time_id']
            if meal_time_id:
                meal_time = MealTime.objects.get(id=meal_time_id)
                message = Product.get_or_add_food_from_sentence(meal_history, meal_time, data)
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
        list_of_ids = request.data.get('list_of_ids', [])
        if list_of_ids:
            deleted, _ = FoodItem.objects.filter(id__in=list_of_ids).delete()
            return Response(
                {'message': f'Successfully deleted {deleted} items'}
            )
        FoodItem.objects.get(id=id).delete()
        return Response('Food deleted from the meal.')

    @action(detail=False, methods=['get'])
    def get_by_date(self, request, pk=None):
        current_date = timezone.now().date()
        today = datetime.strptime(request.GET.get('date'), "%Y-%m-%d")
        # meal = Meal.objects.filter(date_time__date=today, user=request.user).order_by('-date_time')
        meal_time_id = request.GET.get('id')
        if meal_time_id:
            meal = MealTime.objects.filter(id=meal_time_id).prefetch_related(
                Prefetch("food_items_times", queryset=FoodItem.objects.filter(created__date=today))
            ).distinct()
            if meal:
                serializer = MealTimeSerializer(meal, many=True, context={'current_date': today})
                return Response(serializer.data)

        meal = MealTime.objects.filter(user=request.user).prefetch_related(
            Prefetch("food_items_times", queryset=FoodItem.objects.filter(created__date=today))
        ).distinct()
        if meal:
            serializer = MealTimeSerializer(meal, many=True, context={'current_date': today})
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

class ExerciseTypeViewSet(ModelViewSet):
    serializer_class = ExerciseTypeSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        queryset = ExerciseType.objects.all()
        return queryset


class ExerciseViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    serializer_class = ExerciseSerializer
    queryset = Exercise.objects.all()
    http_method_names = ['get', 'post']

    def get_queryset(self):
        queryset = self.queryset
        exercise_type = self.request.query_params.get("exercise_type")
        exercise_type_name = self.request.query_params.get("search")  # search on the bases of exercise_type name
        if exercise_type:
            queryset = queryset.filter(exercise_type__id=exercise_type)
        if exercise_type_name:
            queryset = queryset.filter(name__icontains=exercise_type_name)
        return queryset

    @action(detail=False, methods=['post'])
    def exercise_reps_range(self, request, pk=None):
        try:
            exercise_set = request.data.get('exercise_set')
            set_type = exercise_set.get('set_type')
            exercise_ids = exercise_set.get('exercise_ids', [])
            reps_range = []
            for exercise_id in exercise_ids:
                min_reps = 0
                max_reps = 100
                program_exercises = ProgramExercise.objects.filter(exercises__exercise_id=exercise_id)
                program_exercises = program_exercises.prefetch_related("program_exercie_sets").filter(
                    program_exercie_sets__set_type=set_type)
                if program_exercises.exists():
                    all_reps = []
                    reps_values = program_exercises.values_list('program_exercie_sets__reps', flat=True)
                    if '/' in reps_values:
                        for item in reps_values:
                            # Split the 'reps' string by '/' to separate repetitions
                            reps = item['program_exercie_sets__reps'].split('/')

                            # Convert each repetition string to integer and extend to all_reps list
                            all_reps.extend([int(r) for r in reps])
                    else:
                        all_reps.extend([int(r) for r in reps_values])
                    if all_reps:
                        min_reps = min(all_reps)
                        max_reps = max(all_reps)
                reps_range.append(f"{min_reps} - {max_reps}")
            return Response(reps_range, status=200)
        except:
            return Response([])




class SessionViewSet(ModelViewSet):
    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get_queryset(self):
        current_date = timezone.now().date()
        sessions = Session.objects.filter(user=self.request.user, is_active=True)
        last_session = sessions.order_by('-date_time').first()
        if last_session:
            if last_session.date_time < current_date:
                sessions.update(is_active=False)
        return sessions.order_by('date_time')

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        current_date = date.today()
        start_date = self.request.query_params.get("date")
        how_many_week = queryset.count() / 7
        all_sessions = self.request.query_params.get("all")
        date_in_week_number = 1
        prev_week_number = None
        next_week_number = None
        if queryset:
            first_day = queryset.first().date_time
            last_day = queryset.last().date_time
        day_with_date = {}
        day_no = 1
        for d in queryset:
            day_with_date[str(d.date_time)] = day_no
            day_no += 1

        d_no = day_with_date.get(start_date)
        if d_no and start_date:
            if d_no <= 7:
                date_in_week_number = 1
                next_week_number = 2
                last_day = first_day + timedelta(days=6)
            elif d_no <= 14:
                date_in_week_number = 2
                prev_week_number = 1
                next_week_number = 3
                first_day = first_day + timedelta(days=7)
                last_day = first_day + timedelta(days=6)
            elif d_no <= 21:
                date_in_week_number = 3
                prev_week_number = 2
                next_week_number = 4
                first_day = first_day + timedelta(days=14)
                last_day = first_day + timedelta(days=6)
            elif d_no <= 28:
                date_in_week_number = 4
                prev_week_number = 3
                first_day = first_day + timedelta(days=21)
                last_day = first_day + timedelta(days=6)
            queryset = queryset.filter(date_time__range=[first_day, last_day])
        elif start_date and not d_no:
            queryset = queryset.none()

        if all_sessions:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            day_no = day_with_date.get(str(current_date))
            if day_no:
                date_in_week_number = 1 if day_no <= 7 else 2
            data = {
                "week": int(how_many_week),
                "query": serializer.data,
                "date_in_week_number": date_in_week_number
            }
            return Response(data)
        if request.GET.get('reset'):
            for session in queryset:
                session.reset()
        serializer = self.get_serializer(queryset, many=True)
        if int(how_many_week) == 1:
            next_week_number = None
        data = {
            "week": int(how_many_week),
            "date_in_week_number": date_in_week_number,
            "prev_week_number": prev_week_number,
            "next_week_number": next_week_number,
            "query": serializer.data
        }
        return Response(data)

    @action(detail=False, methods=["post"])
    def create_custom_workout(self, request):
        session_date = self.request.data.get("session_date")
        workout_title = self.request.data.get("title")
        exercise_ids = self.request.data.get("exercise_ids")
        sets = self.request.data.get("set")
        adding_exercise_in_workout = self.request.data.get("adding_exercise_in_workout")
        if adding_exercise_in_workout:
            session_id = self.request.data.get("session_id")
            w_session = Session.objects.get(id=session_id)
            w_session.name = workout_title
            w_session.save()
            workout_obj = Workout.objects.filter(session_id=w_session.id).last()

            order = workout_obj.order + 1 if workout_obj else 1
            payload_exercises = Exercise.objects.filter(id__in=exercise_ids)
            workout = Workout.objects.create(
                session=w_session,
                exercise=payload_exercises.first(),
                order=order
            )
            # for exe_id in exercise_ids:
            # exercise = Exercise.objects.get(id=exe_id)
            # order = order + 1
            for set in sets:
                s_ = Set.objects.create(
                    workout=workout,
                    set_no=set["set_no"],
                    reps=set["reps"],
                    weight=set["weight"],
                    timer=set["timer"],
                    set_type=set["set_type"],
                )
                s_.exercises.set(payload_exercises)
            return Response("data save successful")

        session = Session.objects.filter(user=self.request.user, date_time=session_date).first()
        if session:
            w_session = Session.objects.create(
                user=self.request.user,
                date_time=session_date,
                program=session.program,
                cardio=session.cardio,
                strength=session.strength,
                cardio_length=session.cardio_length,
                cardio_frequency=session.cardio_frequency,
                heart_rate=session.heart_rate,
                location=session.location,
                protein=session.protein,
                carb=session.carb,
                carb_casual=session.carb_casual,
                name=workout_title,
            )
            session.is_active = False
            session.save()
            order = 1

            for exe_id in exercise_ids:
                exercise = Exercise.objects.get(id=exe_id)
                workout = Workout.objects.create(
                    session=w_session,
                    exercise=exercise,
                    order=order
                )
                order = order + 1
                for set in sets:
                    if set["ex_id"] == exercise.id:
                        s_ = Set.objects.create(
                            workout=workout,
                            set_no=set["set_no"],
                            reps=set["reps"],
                            weight=set["weight"],
                            timer=set["timer"],
                            set_type=set["set_type"],
                        )
        return Response("data save successful")

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

    @action(detail=False, methods=['post'])
    def mark_session_done(self, request):
        id = request.data.get('id')  # session  id
        if id:
            session = Session.objects.filter(id=id).first()
            if session:
                session.mark_done_completely()
                return Response("Session marked done")
            return Response({'error': "Session not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': {'id': 'id is required'}}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def list_exercises(self, request):
        # id = request.GET.get('id')
        # if id:
        #     workout = Workout.objects.filter(id=id).first()
        #     if workout:
        #         program = workout.session.program
        #         exercises = workout.exercises.all().values_list('id', flat=True).distinct()
        #         exercise = ProgramExercise.objects.filter(exercises__in=exercises, day__week__program=program).first()
        #         replacements = []
        #         if exercise:
        #             for rep in exercise.replacements.all():
        #                 replacements.append(rep.replacement)
        #             serializer = ExerciseSerializer(replacements, many=True, context={'request': request})
        #             return Response(serializer.data)
        #         return Response("no exercise available")
        #     return Response({'error': "Workout not found"}, status=status.HTTP_404_NOT_FOUND)
        # return Response({'error': {'id': 'id is required'}}, status=status.HTTP_400_BAD_REQUEST)
        exercise_type_id = request.GET.get('id')
        if exercise_type_id:
            exercises = Exercise.objects.filter(exercise_type_id=exercise_type_id)
            serializer = ExerciseSerializer(exercises, many=True, context={'request': request})
            return Response(serializer.data)
        return Response({'error': {'id': 'id is required'}}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def swap_exercise(self, request):
        workout_id = request.data.get('custom_workouts_exercise_id')  # workout id
        exercise_id = request.data.get('exercise_id')
        rest_of_program = request.data.get('rest_of_program')

        if workout_id and exercise_id:
            workout = Workout.objects.filter(id=workout_id).first()
            exercise = Exercise.objects.filter(id=exercise_id).first()
            if workout and exercise:
                if rest_of_program:
                    # workouts = Workout.objects.filter(session=workout.session, exercise=workout.exercise)
                    # for workout in workouts:
                    rest = Exercise.objects.filter(id=rest_of_program).first()
                    if workout.name.lower() not in ['superset', 'giantset']:
                        workout.name = rest.name
                        workout.save()
                    workout.exercises.remove(exercise)  # Remove the matched exercise
                    workout.exercises.add(rest)
                    workout.save()
                    sets = Set.objects.filter(workout=workout, exercises__in=[exercise])
                    for set in sets:
                        set.exercises.remove(exercise)
                        set.exercises.add(rest)
                        set.save()
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
            # date_time_obj = datetime.strptime(day, '%Y-%m-%d')
            # session = Session.objects.filter(user=request.user).first()
            session = Session.objects.filter(user=request.user, date_time=day, is_active=True).first()
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
        with transaction.atomic():
            post_image = []
            post_video = []
            image = ''
            video = ''
            if request.data.get("image"):
                image = dict((request.data).lists())['image']
            if request.data.get("video"):
                video = dict((request.data).lists())['video']
            post_content = {"content": self.request.data.get("content") if self.request.data.get("content") else ""}
            serializer = self.get_serializer(data=post_content)
            if serializer.is_valid():
                self.perform_create(serializer)
                headers = self.get_success_headers(serializer.data)
                if image:
                    for i in image:
                        image_data = {'post': serializer.data.get("id"), 'image': i}
                        # post_image.append(data)
                        post_image_serializer = PostImageSerializer(data=image_data)
                        if post_image_serializer.is_valid(raise_exception=True):
                            post_image_serializer.save()
                if video:
                    for v in video:
                        v_data = {'post': serializer.data.get("id"), "video": v}
                        # post_video.append(data)
                        post_video_serializer = PostVideoSerializer(data=v_data)
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
        if not post.user == request.user:
            title = post.title if post.title else ""
            send_notification(sender=request.user, receiver=post.user,
                              title="Comment on Post",
                              message=f"{request.user.username} comment on your post {title}",
                              post_id=post,
                              extra={"post_id": post.id, "sender": request.user.id, "receiver": post.user.id}
                              )
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
        sender_detail = UserSerializer(request.user)
        send_notification(sender=self.request.user, receiver=other_user, title="Follow",
                          message=f"{self.request.user.username} start following you", post_id=None,
                          extra={"sender": request.user.id, "receiver": other_user.id,
                                 'sender_detail': sender_detail.data}
                          )
        return Response("Added")

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def remove_follow(self, request, pk=None):
        other_user = User.objects.get(id=request.data['id'])
        Follow.objects.remove_follower(request.user, other_user)
        notification = Notification.objects.filter(sender=request.user, receiver=other_user, title="Follow").first()
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
            return Response({"success": True})
        else:
            if program:
                program.program.create_session(request.user)
                return Response({"success": True})
            else:
                return Response({"success": False})

    # @action(detail=False, methods=['get'])
    # def get_initial_form(self, request):
    #     sttng = Settings.objects.get()
    #     return Response(self.serializer_class(sttng.initial_form).data)


class SettingsViewSet(ModelViewSet):
    serializer_class = SettingsSerializer
    queryset = Settings.objects.all()
    permission_classes = [IsAuthenticated]


class SetViewSet(ModelViewSet):
    serializer_class = SetSerializer

    def get_queryset(self):
        return Set.objects.all().order_by('-id')


class CaloriesRequiredViewSet(ModelViewSet):
    serializer_class = CaloriesRequiredSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CaloriesRequired.objects.filter(user=self.request.user).order_by('-id')

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        req_calories = serializer.save()
        a = ConsumeCalories.objects.filter(user=self.request.user, created=date.today())
        if a.exists():
            a.update(goals_values=req_calories)
        else:
            ConsumeCalories.objects.create(calories=0, protein=0, carbs=0, fat=0, user=self.request.user,
                                           goals_values=req_calories)
        return Response(serializer.data)


class ConsumeCaloriesViewSet(ModelViewSet):
    serializer_class = ConsumeCaloriesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ConsumeCalories.objects.filter(
            user=self.request.user
        ).select_related('user', 'goals_values').order_by('-created')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        total_calories = 0
        total_proteins = 0
        total_carbohydrates = 0
        total_fat = 0
        req_calories = CaloriesRequired.objects.filter(user=self.request.user).order_by('-id').first()
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(created=date)
        if queryset.exists():
            meal_times = MealTime.objects.filter(meal__user=self.request.user).order_by('-date_time')
            meals_serializer = MealTimeSerializer(meal_times, many=True,
                                                  context={'current_date': timezone.now().date(),
                                                           "current_time": timezone.now()})
            cal_data = meals_serializer.data
            for food_items in cal_data:
                for food_item in food_items['food_items']:
                    total_calories = food_item["calories"] + total_calories
                    total_proteins = food_item["protein"] + total_proteins
                    total_carbohydrates = food_item["carbohydrate"] + total_carbohydrates
                    total_fat = food_item["fat"] + total_fat
            queryset.update(calories=total_calories, protein=total_proteins,
                            carbs=total_carbohydrates, fat=total_fat, goals_values=req_calories
                            )

        else:
            ConsumeCalories.objects.create(calories=0, protein=0, carbs=0, fat=0, user=self.request.user,
                                           goals_values=req_calories)
            queryset = self.get_queryset().last()
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        req_calories = CaloriesRequired.objects.filter(user=self.request.user).last()
        calories = request.data['calories']
        protein = request.data['protein']
        carbs = request.data['carbs']
        fat = request.data['fat']
        current_date = date.today()
        consume_calories = queryset.filter(created=current_date)
        if consume_calories.exists():
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
    queryset = Comment.objects.all()

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

    def update(self, request, *args, **kwargs):
        partial = True
        instance = self.get_object()
        product_unit = request.data.get("unit")
        serializer = self.get_serializer(instance, data=product_unit, partial=partial)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        product_data = request.data.get('food')
        product_serializer = ProductSerializer(obj.product, data=product_data, partial=True)
        product_serializer.is_valid(raise_exception=True)
        product_serializer.save()
        return Response(serializer.data)


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

    def create(self, request, *args, **kwargs):
        post_id = request.data.get("post")
        user = request.data.get('user')
        queryset = ReportAPost.objects.filter(user=user, post__id=post_id)
        if queryset:
            return Response({"is_report": True}, status=status.HTTP_200_OK)
        serializer = ReportAPostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        post = Post.objects.filter(id=post_id).first()
        send_notification(sender=self.request.user, receiver=post.user, title="Report Post",
                          message=f"Your post is reported by {self.request.user.username}", post_id=post,
                          extra={"post_id": post.id, "sender": request.user.id, "receiver": post.user.id}
                          )
        return Response({"data": "Reported successfully"}, status=status.HTTP_201_CREATED)


class ReportACommentViewSet(ModelViewSet):
    serializer_class = ReportACommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ReportAComment.objects.filter(user=self.request.user)
        return queryset

    def create(self, request, *args, **kwargs):
        comment_id = request.data.get("comment")
        user = request.data.get('user')
        queryset = ReportAComment.objects.filter(user=user, comment_id=comment_id)
        if queryset:
            return Response({"is_report": True}, status=status.HTTP_200_OK)
        serializer = ReportACommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        comment = Comment.objects.filter(id=comment_id).first()
        send_notification(sender=self.request.user, receiver=comment.user, title="Report Comment",
                          message=f"Your comment is reported by {self.request.user.username}", post_id=None,
                          extra={"post_id": comment.post.id, "sender": request.user.id, "receiver": comment.user.id,
                                 "comment_id": comment.id}
                          )
        return Response({"data": "Comment Reported successfully"}, status=status.HTTP_201_CREATED)


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
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        comment_reply_id = kwargs["pk"]
        comment_reply = PostCommentReply.objects.filter(id=comment_reply_id).first()
        if comment_reply:
            if comment_reply.user.id == self.request.user.id or self.request.user.is_superuser:
                comment_reply.delete()
                return Response("Comment Reply deleted successfully")
            return Response({'error': {'comment': 'you can not delete comment'}}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'id': 'cannot find comment_reply'}, status=status.HTTP_400_BAD_REQUEST)


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


class LogOutViewSet(ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        try:
            user = self.request.user
            registration_id = request.data.get('registration_id')
            FCMDevice.objects.filter(user=request.user, registration_id=registration_id).delete()
            Token.objects.filter(user=user).delete()
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"success": True})


class ReportCommentReplyViewSet(ModelViewSet):
    serializer_class = ReportCommentReplySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ReportCommentReply.objects.filter(user=self.request.user)
        return queryset

    def create(self, request, *args, **kwargs):
        comment_reply_id = request.data.get("comment_reply")
        user = request.data.get("user")
        queryset = ReportCommentReply.objects.filter(user=user, comment_reply=comment_reply_id)
        if queryset:
            return Response({"is_report": True}, status=status.HTTP_200_OK)
        serializer = ReportCommentReplySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({"data": "Reported successfully"}, status=status.HTTP_201_CREATED)


class CustomWorkoutViewSet(ModelViewSet):
    queryset = CustomWorkout.objects.all()
    serializer_class = CustomWorkoutSerializer

    def get_queryset(self):
        date = self.request.query_params.get('date', None)
        all = self.request.query_params.get('all', None)
        if date:
            return CustomWorkout.objects.filter(user=self.request.user, created_date=date).order_by('-created_date')
        if all:
            return CustomWorkout.objects.filter(user=self.request.user).order_by('-id', '-created_date')
        return CustomWorkout.objects.filter(user=self.request.user).order_by('-id', '-created_date')

    def create(self, request, *args, **kwargs):
        data = request.data
        custom_workout_serializer = self.get_serializer(data=data)
        custom_workout_serializer.is_valid(raise_exception=True)
        custom_workout = custom_workout_serializer.save()

        custom_exercises_data = data.get('custom_exercises', [])
        for custom_exercise_data in custom_exercises_data:
            if len(custom_exercise_data['exercises']) == 2:
                name = "Superset"
            elif len(custom_exercise_data['exercises']) == 3:
                name = "Giantset"
            else:
                try:
                    name = Exercise.objects.get(id=custom_exercise_data['exercises'][0]).name
                except Exception as e:
                    name = None

            custom_exercise_data['name'] = name
            custom_sets_data = custom_exercise_data.pop('custom_sets', [])
            exercise_json = []
            for index, exercise in enumerate(custom_exercise_data['exercises'], start=1):
                exercise_json.append({"order": index, "exercise": exercise})
            # exercises_order = json.dumps(exercise_json)
            custom_exercise = CustomExercise.objects.create(custom_workout=custom_workout, name=name,
                                                            exercises_order=exercise_json)
            custom_exercise.exercises.set(custom_exercise_data['exercises'])

            # Create custom sets
            for i in custom_exercise_data['exercises']:
                for custom_set_data in custom_sets_data:
                    try:
                        del custom_set_data['rest']
                    except:
                        pass
                    if custom_set_data.get('ex_id') == i:
                        del custom_set_data['ex_id']
                        custom_set = CustomSet.objects.create(custom_exercise=custom_exercise, **custom_set_data)
                        custom_set.exercises.set([i])
        return Response(custom_workout_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def mark_workout_done(self, request):
        id = request.data.get('id')  # workout  id
        if id:
            workout = CustomWorkout.objects.filter(id=id).first()
            if workout:
                workout.mark_done_completely()
                return Response("Workout marked done")
            return Response({'error': "Workout not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': {'id': 'id is required'}}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def reschedule_workout(self, request):
        workout_id = request.data.get('workout_id')  # workout id
        schedule_date = request.data.get('schedule_date')  # schedule date

        if not workout_id:
            return Response({'error': 'workout_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        if not schedule_date:
            return Response({'error': 'schedule_date is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Get the workout
        workout = CustomWorkout.objects.filter(id=workout_id).last()
        if not workout:
            return Response({'error': 'Workout not found'}, status=status.HTTP_404_NOT_FOUND)

        workout.created_date = schedule_date
        workout.save()
        # # Create a new workout with the same exercises and sets
        # new_workout = CustomWorkout.objects.create(created_date=schedule_date, name=workout.name, user=workout.user)
        #
        # # Clone exercises and sets from the original workout
        # for exercise in workout.custom_exercises_workouts.all():
        #     new_exercise = CustomExercise.objects.create(custom_workout=new_workout, name=exercise.name)
        #     new_exercise.exercises.set(exercise.exercises.all())
        #     for set_obj in exercise.custom_set_exercises.all():
        #         new_set = CustomSet.objects.create(
        #             custom_exercise=new_exercise,
        #             set_no=set_obj.set_no,
        #             reps=set_obj.reps,
        #             rest=set_obj.rest,
        #             weight=set_obj.weight,
        #             timer=set_obj.timer,
        #             set_type=set_obj.set_type,
        #             done=False  # Assuming the sets are not marked as done initially
        #         )

        return Response({'success': 'Workout rescheduled successfully'}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def mark_set_done(self, request):
        id = request.data.get('id')  # custom_set id
        if id:
            custom_set = CustomSet.objects.filter(id=id).first()
            if custom_set:
                custom_set.mark_done()
                return Response("Set marked done")
            return Response({'error': "Set not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': {'id': 'id is required'}}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def list_exercises(self, request):
        exercise_type_id = request.GET.get('id')
        if exercise_type_id:
            exercises = Exercise.objects.filter(exercise_type_id=exercise_type_id)
            serializer = ExerciseSerializer(exercises, many=True, context={'request': request})
            return Response(serializer.data)
        return Response({'error': {'id': 'id is required'}}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def swap_exercise(self, request):
        workout_id = request.data.get('workout_id')
        exercise_id = request.data.get('exercise_id')
        rest_of_program = request.data.get('rest_of_program')
        custom_workouts_exercise_id = request.data.get('custom_workouts_exercise_id')

        if workout_id and exercise_id:
            custom_workout = CustomWorkout.objects.filter(id=workout_id).first()
            exercise = Exercise.objects.filter(id=exercise_id).first()
            if custom_workout and exercise:
                if rest_of_program:
                    workouts = CustomExercise.objects.filter(id=custom_workouts_exercise_id,
                                                             custom_workout=custom_workout,
                                                             exercises__id__in=[exercise.id])
                    for workout in workouts:
                        rest = Exercise.objects.filter(id=rest_of_program).first()
                        workout.exercises.remove(exercise)  # Remove the matched exercise
                        workout.exercises.add(rest)
                        workout.save()
                        for custom_set in CustomSet.objects.filter(custom_exercise=workout,
                                                                   exercises__id__in=[exercise.id]):
                            custom_set.exercises.remove(exercise)
                            custom_set.exercises.add(rest)
                return Response("Exercise swapped")
            return Response({'error': "Workout/Exercise not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({'workout_id and exercise_id is required'}, status=status.HTTP_400_BAD_REQUEST)


class CustomSetViewSet(ModelViewSet):
    serializer_class = CustomExercisesSetsSerializer

    def get_queryset(self):
        return CustomSet.objects.all().order_by('-id')


class UserSubscriptionVerifyViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def list(self, request, *args, **kwargs):
        try:
            user = request.user
            subscription_id = user.subscription_id
            transaction_id = user.transaction_id
            if user.is_premium_user:
                if subscription_id and transaction_id:
                    stripe_subscription_status = check_subscription_status(subscription_id)
                    jwt_token = get_app_store_jwt_token()
                    app_store_status = get_app_store_subscription_status(int(transaction_id), jwt_token)
                    if app_store_status.get("success") or stripe_subscription_status.get("success"):
                        return Response({"status": True, "is_premium_user": user.is_premium_user}, status=200)
                    else:
                        if not app_store_status.get("error"):
                            user.transaction_id = None
                        if not stripe_subscription_status.get("error"):
                            user.subscription_id = None
                        user.is_premium_user = False
                        user.save()
                        return Response({"status": False, "is_premium_user": user.is_premium_user}, status=200)

                elif subscription_id and not transaction_id:
                    stripe_subscription_status = check_subscription_status(subscription_id)
                    if stripe_subscription_status.get("success"):
                        return Response({"status": True, "is_premium_user": user.is_premium_user}, status=200)
                    else:
                        if not stripe_subscription_status.get("error"):
                            user.is_premium_user = False
                            user.subscription_id = None
                            user.save()
                        return Response({"status": False, "is_premium_user": user.is_premium_user}, status=200)

                elif transaction_id and not subscription_id:
                    jwt_token = get_app_store_jwt_token()
                    app_store_status = get_app_store_subscription_status(int(transaction_id), jwt_token)
                    if app_store_status.get("success"):
                        return Response({"status": True, "is_premium_user": user.is_premium_user}, status=200)
                    else:
                        if not app_store_status.get("error"):
                            user.is_premium_user = False
                            user.transaction_id = None
                            user.save()
                            return Response({"status": False, "is_premium_user": user.is_premium_user}, status=200)
                else:
                    user.is_premium_user = False
                    user.transaction_id = None
                    user.save()
                    return Response({"status": False, "is_premium_user": user.is_premium_user}, status=200)
            else:
                user.subscription_id = None
                user.transaction_id = None
                user.save()
                return Response({"status": False, "is_premium_user": user.is_premium_user}, status=200)
        except Exception as e:
            return Response({"status": False, "error": str(e)}, status=500)
