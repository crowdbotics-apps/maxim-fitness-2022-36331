from rest_framework import serializers
from notification.models import Notification
from fcm_django.models import FCMDevice
from home.api.v1.serializers import UserSerializer, PostSerializer


class FCMDeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = FCMDevice
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    sender_detail = UserSerializer(source="sender", read_only=True)
    image = serializers.ImageField(source='sender.profile_picture', read_only=True)
    # name = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = Notification
        fields = "__all__"
