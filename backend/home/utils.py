from notification.models import Notification


def send_notification(sender, receiver, title, message):
    data = {
        "sender": sender,
        "receiver": receiver,
        "title": title,
        "message": message
    }
    Notification.objects.create(**data)
    return True