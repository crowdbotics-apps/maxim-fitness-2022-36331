from django.contrib.auth import get_user_model
from django.http import HttpRequest
from django.utils.translation import ugettext_lazy as _
from allauth.account import app_settings as allauth_settings
from allauth.account.forms import ResetPasswordForm
from allauth.socialaccount.helpers import complete_social_login
from allauth.utils import email_address_exists, generate_unique_username
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from rest_auth.models import TokenModel
from rest_framework import serializers
from rest_auth.serializers import PasswordResetSerializer
from rest_auth.registration.serializers import SocialLoginSerializer

from requests.exceptions import HTTPError
from home.models import Product, ProductUnit, Meal, FoodItem, Recipe, RecipeItem, Category, Post, Comment, Form, \
    Answer, Question, QuestionType, CaloriesRequired, ConsumeCalories, ReportAPost, BlockUser, Chat, PostImage, \
    PostCommentReply, PostCommentLike, PostVideo, ReportAUser

from program.models import Exercise, Session, Workout, Set, ExerciseType, ExerciseImages, Report
from users.models import Settings

User = get_user_model()


class RestSocialLoginSerializer(SocialLoginSerializer):
    id_token = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        view = self.context.get('view')
        request = self._get_request()

        if not view:
            raise serializers.ValidationError(
                _("View is not defined, pass it as a context variable")
            )

        adapter_class = getattr(view, 'adapter_class', None)
        if not adapter_class:
            raise serializers.ValidationError(_("Define adapter_class in view"))

        adapter = adapter_class(request)
        app = adapter.get_provider().get_app(request)

        # More info on code vs access_token
        # http://stackoverflow.com/questions/8666316/facebook-oauth-2-0-code-and-token

        # Case 1: We received the access_token
        if attrs.get('access_token'):
            access_token = attrs.get('access_token')

        # Case 2: We received the authorization code
        elif attrs.get('code'):
            self.callback_url = getattr(view, 'callback_url', None)
            self.client_class = getattr(view, 'client_class', None)

            if not self.callback_url:
                raise serializers.ValidationError(
                    _("Define callback_url in view")
                )
            if not self.client_class:
                raise serializers.ValidationError(
                    _("Define client_class in view")
                )

            code = attrs.get('code')

            provider = adapter.get_provider()
            scope = provider.get_scope(request)
            client = self.client_class(
                request,
                app.client_id,
                app.secret,
                adapter.access_token_method,
                adapter.access_token_url,
                self.callback_url,
                scope
            )
            token = client.get_access_token(code)
            access_token = token['access_token']

        else:
            raise serializers.ValidationError(
                _("Incorrect input. access_token or code is required."))

        social_token = social_token = adapter.parse_token({
            'access_token': access_token,
            'id_token': attrs.get('id_token') # For apple login
        })
        social_token.app = app

        try:
            login = self.get_social_login(adapter, app, social_token, access_token)
            complete_social_login(request, login)
        except HTTPError:
            raise serializers.ValidationError(_("Incorrect value"))

        if not login.is_existing:
            # We have an account already signed up in a different flow
            # with the same email address: raise an exception.
            # This needs to be handled in the frontend. We can not just
            # link up the accounts due to security constraints
            if allauth_settings.UNIQUE_EMAIL:
                # Do we have an account already with this email address?
                account_exists = get_user_model().objects.filter(
                    email=login.user.email,
                ).exists()
                if account_exists:
                    raise serializers.ValidationError(
                        _("User is already registered with this e-mail address.")
                    )

            login.lookup()
            login.save(request, connect=True)

        attrs['user'] = login.account.user

        return attrs


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password')
        extra_kwargs = {
            'password': {
                'write_only': True,
                'style': {
                    'input_type': 'password'
                }
            },
            'email': {
                'required': True,
                'allow_blank': False,
            }
        }

    def _get_request(self):
        request = self.context.get('request')
        if request and not isinstance(request, HttpRequest) and hasattr(request, '_request'):
            request = request._request
        return request

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def create(self, validated_data):
        user = User(
            email=validated_data.get('email'),
            name=validated_data.get('name'),
            username=generate_unique_username([
                validated_data.get('name'),
                validated_data.get('email'),
                'user'
            ])

        )
        user.set_password(validated_data.get('password'))
        user.save()
        request = self._get_request()
        setup_user_email(request, user, [])
        return user

    def save(self, request=None):
        """rest_auth passes request so we must override to accept it"""
        return super().save()


class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = '__all__'


class BlockedUserSerializer(serializers.ModelSerializer):
    request_user_name = serializers.CharField(source='requested_user.username', read_only=True)
    block_user_name = serializers.CharField(source='blocked_user.username', read_only=True)

    class Meta:
        model = BlockUser
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    settings = SettingsSerializer(read_only=True)
    request_user = BlockedUserSerializer(read_only=True, many=True)
    block_user = BlockedUserSerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', "profile_url", "profile_picture",
                  "background_picture", "description",

                  "gender", 'dob', "height", "weight", "unit",
                  "exercise_level", "activity_level",
                  "understanding_level", "number_of_meal", "number_of_training_days",
                  "fitness_goal", "settings", 'stripe_customer_id', "is_survey", "is_superuser", 'request_user',
                  'block_user'
                  ]

    def _get_request(self):
        request = self.context.get('request')
        if request and not isinstance(request, HttpRequest) and hasattr(request, '_request'):
            request = request._request
        return request



class CustomTokenSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source="user", read_only=True)
    token = serializers.CharField(source="key", read_only=True)

    class Meta:
        model = TokenModel
        fields = ('key', "user_detail", 'token')


class PasswordSerializer(PasswordResetSerializer):
    """Custom serializer for rest_auth to solve reset password error"""
    password_reset_form_class = ResetPasswordForm


class ProductUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductUnit
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    units = ProductUnitSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class FoodItemSerializer(serializers.ModelSerializer):
    food = ProductSerializer(read_only=True)
    carbohydrate = serializers.ReadOnlyField()
    protein = serializers.ReadOnlyField()
    fat = serializers.ReadOnlyField()
    calories = serializers.ReadOnlyField()
    unit = ProductUnitSerializer()

    class Meta:
        model = FoodItem
        fields = '__all__'


class FoodItemPostSerializer(serializers.Serializer):
    food_name = serializers.CharField(required=True)
    item_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    portion = serializers.FloatField(required=True)
    unit = serializers.CharField(required=False)


class MealSerializer(serializers.ModelSerializer):
    food_items = FoodItemSerializer(many=True, read_only=True)

    class Meta:
        model = Meal
        fields = '__all__'


class MealPostSerializer(serializers.ModelSerializer):
    nix_food_items = FoodItemPostSerializer(many=True, write_only=True, allow_null=True, required=False)
    query = serializers.CharField(allow_null=True, required=False)

    class Meta:
        model = Meal
        exclude = ['user',]

    def create(self, validated_data):
        food_items_data = []
        if validated_data.get('nix_food_items'):
            food_items_data = validated_data.pop('nix_food_items')
        else:
            query = validated_data.pop('query')
        meal = Meal.objects.create(**validated_data)
        if food_items_data:
            for food_item in food_items_data:
                food = Product.get_or_add_product(food_item)
                unit = ProductUnit.objects.filter(id=food_item.get('unit')).first()
                FoodItem.objects.create(meal=meal, food=food, portion=food_item['portion'], unit=unit)
        else:
            message = Product.get_or_add_food_from_sentence(meal, query)
        return meal


class RecipeItemSerializer(serializers.ModelSerializer):
    food = ProductSerializer(read_only=True)
    carbohydrate = serializers.ReadOnlyField()
    protein = serializers.ReadOnlyField()
    fat = serializers.ReadOnlyField()
    calories = serializers.ReadOnlyField()

    class Meta:
        model = RecipeItem
        fields = '__all__'


class RecipeSerializer(serializers.ModelSerializer):
    recipe_items = RecipeItemSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    carbohydrate = serializers.ReadOnlyField()
    protein = serializers.ReadOnlyField()
    fat = serializers.ReadOnlyField()
    calories = serializers.ReadOnlyField()

    class Meta:
        model = Recipe
        fields = '__all__'


class ExerciseTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExerciseType
        fields = '__all__'


class ExerciseImagesSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExerciseImages
        fields = '__all__'


class ExerciseSerializer(serializers.ModelSerializer):
    exercise_type = ExerciseTypeSerializer()
    pictures = ExerciseImagesSerializer(many=True)

    class Meta:
        model = Exercise
        fields = '__all__'


class SetSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many=True)

    class Meta:
        model = Set
        fields = '__all__'


class WorkoutSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer()
    sets = SetSerializer(many=True)

    class Meta:
        model = Workout
        fields = '__all__'


class SessionSerializer(serializers.ModelSerializer):
    workouts = WorkoutSerializer(many=True)

    class Meta:
        model = Session
        fields = '__all__'


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'


class CommentLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostCommentLike
        fields = "__all__"


class CommentReplySerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField(read_only=True)
    liked = serializers.SerializerMethodField(read_only=True)
    user_detail = UserSerializer(source="user", read_only=True)

    class Meta:
        model = PostCommentReply
        fields = "__all__"

    def get_likes(self, comment):
        return comment.likes_count

    def get_liked(self, comment):
        request = self.context.get("request")
        user = self.context['request'].user
        return comment.get_like(user)


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    sub_comment = CommentReplySerializer(source='post_comment_reply', many=True, read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    liked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

    def get_likes(self, comment):
        return comment.likes_count

    def get_liked(self, comment):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        return comment.get_like(user)


class PostImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostImage
        fields = "__all__"


class PostVideoSerializer(serializers.ModelSerializer):

    class Meta:
        model = PostVideo
        fields = "__all__"


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    post_image = PostImageSerializer(source="post_image_video", many=True, read_only=True)
    post_video = PostVideoSerializer(many=True, read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    liked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Post
        fields = '__all__'

    def get_likes(self, post):
        return post.likes_count

    def get_liked(self, post):
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        return post.get_like(user)


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = '__all__'


class QuestionTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionType
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    type = QuestionTypeSerializer()
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = '__all__'


class FormSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Form
        fields = '__all__'




class CaloriesRequiredSerializer(serializers.ModelSerializer):

    class Meta:
        model = CaloriesRequired
        fields = '__all__'


class ConsumeCaloriesSerializer(serializers.ModelSerializer):
    goals_values = CaloriesRequiredSerializer(read_only=True)

    class Meta:
        model = ConsumeCalories
        fields = '__all__'


class ReportAPostSerializer(serializers.ModelSerializer):

    class Meta:
        model = ReportAPost
        fields = "__all__"


class ReportAUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = ReportAUser
        fields = "__all__"


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = "__all__"


