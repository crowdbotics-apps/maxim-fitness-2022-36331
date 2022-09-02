from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from users.models import User
from notification.models import Notification


def send_weight_update_notification():
    user = User.objects.all()
    current_date = date.today()
    for u in user:
        last_update = u.last_update
        day = relativedelta(current_date, last_update).days
        month = relativedelta(current_date, last_update).months
        year = relativedelta(current_date, last_update).years
        if day > 7 or month > 0 or year > 0:
            n = Notification.objects.filter(sender=u, receiver=u,
                                            title="update your weight", message="Update your weight").first()

            if n and n.created.date() == current_date:
                pass
            else:
                Notification.objects.create(sender=u, receiver=u, title="update your weight",
                                            message="Update your weight")
