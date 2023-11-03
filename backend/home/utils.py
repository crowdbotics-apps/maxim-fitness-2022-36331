from modules.fcm.serializers import FCMNotificationSerializer


def send_notification(sender, receiver, title, message):
    data = {
        "sender": sender,
        "receiver": receiver,
        "title": title,
        "message": message
    }
    serializer = FCMNotificationSerializer(data=data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return True