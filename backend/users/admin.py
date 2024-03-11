from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model
from .models import AnswerProgram, Settings
from users.forms import UserChangeForm, UserCreationForm

User = get_user_model()


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):

    form = UserChangeForm
    add_form = UserCreationForm
    fieldsets = (("User", {"fields": ("name", "profile_picture", "stripe_customer_id")}),
                 ("Program", {"fields": ("dob", "last_update", "height", "weight", "unit", "gender", "exercise_level", "activity_level",
                                         "understanding_level", "number_of_meal", "number_of_training_days",
                                         "fitness_goal", "is_survey", "consultations", "is_premium_user", "trial")})
                 ) + auth_admin.UserAdmin.fieldsets
    list_display = ["username", "name", "is_superuser", "is_survey", "dob","is_premium_user", "trial"]
    search_fields = ["name"]


class AnswerProgramAdmin(admin.ModelAdmin):
    list_display = ["program", "age_min", "age_max", "exercise_level", "activity_level", "understanding_level",
                    "number_of_meal", "number_of_training_days", "fitness_goal"]


admin.site.register(AnswerProgram, AnswerProgramAdmin)
admin.site.register(Settings)
