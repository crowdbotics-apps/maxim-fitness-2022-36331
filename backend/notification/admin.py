from django.contrib import admin
from notification.models import Notification
# # Register your models here.


class NotificationAdmin(admin.ModelAdmin):
    list_display = ['sender', 'receiver', 'title', 'message', 'created']


admin.site.register(Notification, NotificationAdmin)
