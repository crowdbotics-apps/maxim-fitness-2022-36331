from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from notification.api.v1.viewsets import NotificationViewSet, UserFCMDeviceAdd

router = DefaultRouter()
router.register('notification', NotificationViewSet, basename='notification')

urlpatterns = [
    path("", include(router.urls)),
    path('user_fcm_device_add/', UserFCMDeviceAdd.as_view(), name='user_fcm_device_add'),

]