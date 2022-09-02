from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import *
from rest_framework.views import APIView
from rest_framework import authentication, permissions, status
from fcm_django.models import FCMDevice

from notification.models import Notification
from notification.api.v1.serializers import NotificationSerializer, FCMDeviceSerializer
from home.models import Post


class UserFCMDeviceAdd(CreateAPIView):
    authentication_classes = [authentication.TokenAuthentication, authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    queryset = FCMDevice.objects.all()
    serializer_class = FCMDeviceSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, active=True)

    def create(self, request, *args, **kwargs):
        registration_id = request.data.get('registration_id')
        user_device = FCMDevice.objects.filter(user=request.user, registration_id=registration_id)
        if user_device:
            return Response({
                'success': True,
                'message': 'Device Already Exist'
            }, status=200)
        else:
            return super(UserFCMDeviceAdd, self).create(request, *args, **kwargs)


class NotificationViewSet(ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(receiver=self.request.user).order_by("-id")

    def create(self, request, *args, **kwargs):
        if request.data['post']:
            post = Post.objects.filter(id=request.data['post']).first()
            if post and post.user.id == request.data['sender']:
                return Response('ok')
            else:
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                # headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            # headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

