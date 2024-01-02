from notification.models import Notification


def send_notification(sender, receiver, title, message, post_id=None):
    data = {
        "sender": sender,
        "receiver": receiver,
        "title": title,
        "message": message,
        "post": post_id
    }
    Notification.objects.create(**data)
    return True
