from django.contrib.postgres.fields import JSONField
from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from fcm_django.models import FCMDevice
User = get_user_model()
# Create your models here.


class Notification(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender_notification",)
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiver_notification", null=True, blank=True)
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    extra_data = JSONField(null=True, blank=True)
    # for handling delete post's notifications on resolved and resolved report_a_post object
    post = models.ForeignKey(
        "home.Post", on_delete=models.CASCADE,
        related_name="notify_report",
        null=True, blank=True
    )
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.sender)


@receiver(post_save, sender=Notification)
def send_notification(sender, instance, created, **kwargs):
    if created:
        if instance.receiver:
            devices = FCMDevice.objects.filter(user=instance.receiver, active=True)

        else:
            devices = FCMDevice.objects.filter(active=True)

        if devices:
            devices.send_message(title=instance.title, body=instance.message, data=instance.extra_data if instance.extra_data else None)