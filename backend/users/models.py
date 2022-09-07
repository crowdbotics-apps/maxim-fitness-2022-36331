from django.contrib.auth.models import AbstractUser
from django.core.mail import EmailMultiAlternatives
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _
from django_rest_passwordreset.signals import reset_password_token_created


class User(AbstractUser):
    # WARNING!
    """
    Some officially supported features of Crowdbotics Dashboard depend on the initial
    state of this User model (Such as the creation of superusers using the CLI
    or password reset in the dashboard). Changing, extending, or modifying this model
    may lead to unexpected bugs and or behaviors in the automated flows provided
    by Crowdbotics. Change it at your own risk.


    This model represents the User instance of the system, login system and
    everything that relates with an `User` is represented by this model.
    """

    # First Name and Last Name do not cover name patterns
    # around the globe.
    name = models.CharField(_("Name of User"), blank=True, null=True, max_length=255)
    dob = models.DateField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    unit = models.CharField(max_length=50, null=True, blank=True)
    gender = models.CharField(max_length=50, null=True, blank=True)
    exercise_level = models.PositiveIntegerField(null=True, blank=True)
    activity_level = models.PositiveIntegerField(null=True, blank=True)
    understanding_level = models.PositiveIntegerField(null=True, blank=True)
    number_of_meal = models.PositiveIntegerField(null=True, blank=True)
    number_of_training_days = models.PositiveIntegerField(null=True, blank=True)
    fitness_goal = models.PositiveIntegerField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_picture', null=True, blank=True)
    background_picture = models.ImageField(upload_to='background_picture', null=True, blank=True)

    stripe_customer_id = models.CharField(max_length=50, null=True, blank=True)
    valid_till = models.DateField(null=True, blank=True)
    trial = models.BooleanField(default=False)
    last_update = models.DateField(null=True, blank=True)
    is_survey = models.BooleanField(default=False)
    consultations = models.BooleanField(default=False)

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})

    def profile_url(self):
        if self.socialaccount_set.all():
            return self.socialaccount_set.all()[0].get_avatar_url()
        return ""

    def set_profile_picture(self, picture, file_name):
        self.profile_picture.save(file_name, picture)

    def set_background_picture(self, picture, file_name):
        self.background_picture.save(file_name, picture)

    def update_settings(self, plan, product):
        self.settings.reset()
        kwargs = {}
        for key in product['metadata']['permissions'].split(","):
            kwargs[key.strip()] = True

        self.settings.update_values(kwargs)


class AnswerProgram(models.Model):
    program = models.ForeignKey("program.Program", on_delete=models.CASCADE)
    age_min = models.PositiveIntegerField()
    age_max = models.PositiveIntegerField()
    exercise_level = models.PositiveIntegerField(null=True, blank=True)
    activity_level = models.PositiveIntegerField(null=True, blank=True)
    understanding_level = models.PositiveIntegerField(null=True, blank=True)
    number_of_meal = models.PositiveIntegerField(null=True, blank=True)
    number_of_training_days = models.PositiveIntegerField(null=True, blank=True)
    fitness_goal = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return str(self.program)


def create_settings(sender, instance, created, **kwargs):
    if created:
        Settings.objects.create(
            user=instance,
            diet_tracking_voice=True,
            diet_dynamic_feed=True,
            diet_tracking_text=True,
            diet_analytics=True,
            diet_tracking_barcode=True,
            program_custom=True,
            program_analytics=True,
            program_dynamic_feed=True
        )


post_save.connect(create_settings, sender=User)


class Settings(models.Model):
    user = models.OneToOneField(User, related_name='settings', on_delete=models.CASCADE)

    # free subscription
    profile = models.BooleanField(default=True)
    social_feed = models.BooleanField(default=True)
    recipe = models.BooleanField(default=True)

    # Diet subscription
    diet_tracking_voice = models.BooleanField(default=False)
    diet_tracking_text = models.BooleanField(default=False)
    diet_tracking_barcode = models.BooleanField(default=False)
    diet_analytics = models.BooleanField(default=False)
    diet_dynamic_feed = models.BooleanField(default=False)

    # Program subscription
    program_custom = models.BooleanField(default=False)
    program_analytics = models.BooleanField(default=False)
    program_dynamic_feed = models.BooleanField(default=False)

    # last_update = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.user.email

    def reset(self, fields=[], exclude=['user']):
        exclude = ['id', 'user']
        fields = [x for x in self._meta.fields if x.name not in exclude]
        for f in fields:
            setattr(self, f.name, f.get_default())
        self.save()

    def update_values(self, kwargs):
        Settings.objects.filter(id=self.id).update(**kwargs)


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    # send an e-mail to the user
    context = {
        'username': reset_password_token.user.get_full_name,
        'reset_password_token': reset_password_token.key
    }
    # render email text
    email_html_message = render_to_string('email/user_reset_password.html', context)
    email_plaintext_message = render_to_string('email/user_reset_password.txt', context)
    msg = EmailMultiAlternatives(
        # title:
        "Password Reset for {title}".format(title="maxim fitness app"),
        # message:
        email_plaintext_message,
        # from:
        "noreply@maxim-fitness.com",
        # to:
        [reset_password_token.user.email]
    )
    msg.attach_alternative(email_html_message, "text/html")
    msg.send()