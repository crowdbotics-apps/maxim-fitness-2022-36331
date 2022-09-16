from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from push_notifications.api.rest_framework import APNSDeviceAuthorizedViewSet, GCMDeviceAuthorizedViewSet
from home.api.v1.viewsets import (
    SignupViewSet,
    LoginViewSet,
    ProductViewSet,
    FacebookLogin,
    GoogleLogin,
    AppleLogin,
    ProfileViewSet,
    FoodViewSet,
    MealViewSet,
    RecipeViewSet,
    CategoryViewSet,
    ExerciseViewSet,
    SessionViewSet,
    ReportViewSet,
    PostViewSet,
    FollowViewSet,
    FormViewSet,
    SettingsViewSet,
    PaymentViewSet,
    SetViewSet,
    CaloriesRequiredViewSet,
    ConsumeCaloriesViewSet,
    CommentViewSet,
    ProductUnitViewSet,
    CheckUserViewSet,
    ReportAPostViewSet,
    BlockedUserViewSet, ChatViewSet, PostImageVideoViewSet, CommentReplyViewSet, CommentLikeViewSet, UpdateProfile,
    ReportAUserViewSet
)

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi


schema_view = get_schema_view(
   openapi.Info(
      title="Maxim API",
      default_version='v1',
      description="Maxim api docs",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)


router = DefaultRouter()
router.register('signup', SignupViewSet, basename='signup')
router.register('login', LoginViewSet, basename='login')
router.register('profile', ProfileViewSet, basename='profile')
router.register('update-profile', UpdateProfile, basename='update_profile')
router.register('products', ProductViewSet, basename='products')
router.register('food', FoodViewSet, basename='food')
router.register('meal', MealViewSet, basename='meal')
router.register('recipe', RecipeViewSet, basename='recipe')
router.register('category', CategoryViewSet, basename='category')
router.register('post', PostViewSet, basename='post')
router.register('post-image', PostImageVideoViewSet, basename='post_image')
router.register('form', FormViewSet, basename='form')
router.register('comment-reply', CommentReplyViewSet, basename='comment-reply')
router.register('comment-like', CommentLikeViewSet, basename='comment-like')


router.register('exercise', ExerciseViewSet, basename='exercise')
router.register('session', SessionViewSet, basename='session')
router.register('report', ReportViewSet, basename='report')
router.register('follow', FollowViewSet, basename='report')
router.register('settings', SettingsViewSet, basename='settings')
router.register('payment', PaymentViewSet, basename='payment')
router.register('set', SetViewSet, basename='set')
router.register('calories-required', CaloriesRequiredViewSet, basename='calories_required')
router.register('consume-calories', ConsumeCaloriesViewSet, basename='consume_calories')
router.register('comment', CommentViewSet, basename='comment')
router.register('product-unit', ProductUnitViewSet, basename='product_unit')
router.register(r'device/apns', APNSDeviceAuthorizedViewSet)
router.register(r'device/fcm', GCMDeviceAuthorizedViewSet)

router.register('check-user', CheckUserViewSet, basename='check_user')
router.register('report-post', ReportAPostViewSet, basename='report_post')
router.register('report-user', ReportAUserViewSet, basename='report_user')
router.register('block-user', BlockedUserViewSet, basename='block_user')
router.register("chat", ChatViewSet, basename="chat")


urlpatterns = [
    path("", include(router.urls)),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^docs/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    re_path(r'^login/facebook/$', FacebookLogin.as_view(), name='fb_login'),
    re_path(r'^login/google/$', GoogleLogin.as_view(), name='google_login'),
    re_path(r'^login/apple/$', AppleLogin.as_view(), name='apple_login'),

    path('forgot-password/', include('django_rest_passwordreset.urls', namespace='password_reset'))
]
