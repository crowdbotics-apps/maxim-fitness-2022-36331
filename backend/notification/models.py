from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from push_notifications.models import APNSDevice, GCMDevice
from home.models import Post
User = get_user_model()
# Create your models here.


class Notification(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender_notification",)
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiver_notification",)
    title = models.CharField(max_length=200)
    message = models.TextField()
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="notification_post", null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.sender)


@receiver(post_save, sender=Notification)
def send_notification(sender, instance, created, **kwargs):
    # from users.tasks import send_user_custom_notification
    if created:
        if instance.receiver:
            # devices = FCMDevice.objects.filter(user_id=instance.receiver)
            devices = GCMDevice.objects.filter(user=instance.receiver)
            apns_devices = APNSDevice.objects.filter(user=instance.receiver)
        else:
            # devices = FCMDevice.objects.all()
            devices = GCMDevice.objects.all()
            apns_devices = APNSDevice.objects.all()

        if devices:
            # devices.send_message(title=instance.title, body=instance.message)
            devices.send_message(title=instance.title, message=instance.message)
        if apns_devices:
            apns_devices.send_message(message={"body": instance.message})
