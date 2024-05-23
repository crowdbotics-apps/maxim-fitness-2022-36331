import wget
import os

from django.contrib.postgres.fields import JSONField
from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.files import File

from datetime import datetime, timedelta

from django.utils import timezone
from thumbnail import generate_thumbnail

User = get_user_model()


class Report(models.Model):
    user = models.ForeignKey(User, related_name='reports', on_delete=models.CASCADE)
    session = models.ForeignKey('Session', related_name='reports', on_delete=models.CASCADE)
    date_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username


class Session(models.Model):
    user = models.ForeignKey(User, related_name='sessions', on_delete=models.CASCADE)
    date_time = models.DateField()
    name = models.CharField(max_length=500, null=True)
    program = models.ForeignKey("Program", related_name='sessions', on_delete=models.CASCADE, null=True)

    cardio = models.BooleanField(default=False)
    strength = models.BooleanField(default=False)
    cardio_length = models.PositiveIntegerField(null=True, blank=True)
    cardio_frequency = models.PositiveIntegerField(null=True, blank=True)
    heart_rate = models.PositiveIntegerField(null=True, blank=True)
    location = models.CharField(max_length=250, null=True, blank=True)
    protein = models.FloatField(null=True, blank=True)
    carb = models.FloatField(null=True, blank=True)
    carb_casual = models.FloatField(null=True, blank=True)
    done = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    week_number = models.PositiveIntegerField(null=True, blank=True)
    day_number = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.user}_{self.date_time}{self.id}"

    def reset(self):
        Report.objects.create(
            user=self.user,
            session=self
        )
        for workout in self.workouts.all():
            workout.reset()

    def get_sets(self):
        sets = []
        for workout in self.workouts.all():
            sets.extend(workout.sets.all())
        return sets

    def mark_done_completely(self):
        self.done = True
        self.save()


class ExerciseImages(models.Model):
    exercise = models.ForeignKey('Exercise', related_name='pictures', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='exercise_images')

    def __str__(self):
        return self.exercise.name


class ExerciseType(models.Model):
    name = models.CharField(max_length=250)
    image = models.ImageField(upload_to='exercise_type_images', null=True, blank=True)

    def __str__(self):
        return self.name


class Exercise(models.Model):
    name = models.CharField(max_length=150)
    exercise_id = models.CharField(max_length=150)
    exercise_type = models.ForeignKey('ExerciseType', related_name='exercises', on_delete=models.CASCADE, null=True)
    description = models.TextField(null=True, blank=True, default="")
    video = models.FileField(upload_to='videos/', null=True, blank=True)
    video_thumbnail = models.FileField(upload_to='exercise_video/thumbnail', null=True, blank=True)

    def __str__(self):
        return f"name: {self.name} ex_type: {self.exercise_type.name}"


@receiver(post_save, sender=Exercise)
def save_video_thumbnail(sender, instance, created, **kwargs):
    if instance.video and not instance.video_thumbnail:
        filename_sp = instance.video.name.split("/")[-1].split(".")[0]
        destination_file_name = f"{filename_sp}.{instance.video.name.split('.')[-1]}"
        thumbnail_file_name = f"{filename_sp}.png"
        try:
            wget.download(instance.video.url, destination_file_name)
            options = {
                'trim': False,
                'height': 300,
                'width': 300,
                'quality': 85,
                'type': 'thumbnail'
            }
            generate_thumbnail(destination_file_name, thumbnail_file_name, options)
            # TODO: upload thumbnail_file_name to post_video.thumbnail
            instance.video_thumbnail.save(thumbnail_file_name, File(open(thumbnail_file_name, 'rb')), save=True)
        except Exception as e:
            print(e)
        finally:
            os.remove(destination_file_name)
            os.remove(thumbnail_file_name)


class Program(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField()

    def __str__(self):
        return self.name

    def get_date_time(self, days_gap):
        date_time = datetime.today().date() + timedelta(days=days_gap)
        return date_time

    def create_session(self, user):
        existing_session = Session.objects.filter(user=user)
        if existing_session:
            existing_session.update(is_active=False)
        weeks = self.weeks.all().order_by("week")
        print('weeks', weeks)
        days_gap = 0
        for week in weeks:
            day_no = 1
            days = week.days.all().order_by("id")
            print('total_days', days)
            # days_gap = 0
            for day in days:
                date_time = self.get_date_time(days_gap)
                session = Session.objects.create(
                    user=user,
                    strength=day.strength if user.is_premium_user else False,
                    date_time=date_time,
                    program=self,
                    cardio=day.cardio if user.is_premium_user else False,
                    cardio_length=day.cardio_length,
                    cardio_frequency=day.cardio_frequency,
                    heart_rate=day.heart_rate,
                    location=day.location,
                    protein=day.protein,
                    carb=day.carb,
                    carb_casual=day.carb_casual,
                    name=day.name,
                    week_number=week.week,
                    day_number=day_no,
                )
                order = 1
                days_gap += 1
                day_no += 1
                if user.is_premium_user:
                    for exercise in day.day_exercises.all():
                        if not exercise.name:
                            workout = Workout.objects.create(
                                session=session,
                                exercise=exercise.exercise,
                                order=order,
                                name=exercise.exercise.name
                            )
                        else:
                            workout = Workout.objects.create(
                                session=session,
                                exercise=exercise.exercises.first(),
                                order=order,
                                name=exercise.name
                            )
                        workout.exercises.set(exercise.exercises.all())
                        order += 1
                        for ex in exercise.exercises.all():
                            for set in exercise.program_exercie_sets.all():
                                print('set', set.set_type)
                                s_ = Set.objects.create(
                                    workout=workout,
                                    set_no=set.set_no,
                                    reps=set.reps,
                                    weight=set.weight,
                                    timer=set.timer,
                                    set_type=set.set_type,
                                )
                                s_.exercises.add(ex)

                                # workout.exercises.set(set.exercises.all())
                                print(s_, 'created', s_.set_type)
                    print(*[s.set_type for s in session.get_sets()])


class Week(models.Model):
    program = models.ForeignKey("Program", on_delete=models.CASCADE, related_name="weeks")
    week = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.program}  week:{self.week}"


class Day(models.Model):
    week = models.ForeignKey("Week", on_delete=models.CASCADE, related_name="days")
    day = models.PositiveIntegerField()
    strength = models.BooleanField(default=False)
    cardio = models.BooleanField(default=False)
    cardio_length = models.PositiveIntegerField()
    cardio_frequency = models.PositiveIntegerField()
    heart_rate = models.PositiveIntegerField()
    location = models.CharField(max_length=250)
    protein = models.FloatField()
    carb = models.FloatField()
    carb_casual = models.FloatField()
    name = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self):
        return f"{self.id} week: {self.week}  name: {self.name}"


class ProgramExercise(models.Model):
    day = models.ForeignKey("Day", on_delete=models.CASCADE, null=True, related_name="day_exercises")
    exercise = models.ForeignKey("Exercise", on_delete=models.CASCADE, null=True, blank=True)
    exercises = models.ManyToManyField("Exercise", related_name="program_exercises", null=True, blank=True)
    name = models.CharField(max_length=25, null=True, blank=True)

    def __str__(self):
        return f"{self.exercise} >> day: {self.day} >> {self.name}"


class ProgramExerciseReplacement(models.Model):
    exercise = models.ForeignKey("ProgramExercise", on_delete=models.CASCADE, related_name="replacements")
    replacement = models.ForeignKey("Exercise", on_delete=models.CASCADE)


class ProgramSet(models.Model):
    REGULAR = 'r'
    SUPERSET = 'ss'
    GIANTSET = 'gs'
    DROPSET = 'ds'
    TRIPLE_DROPSET = 'td'
    CIRCUIT_TRAINING = 'ct'
    CARDIO = 'cr'
    TYPE = [
        (SUPERSET, 'Superset'),
        (GIANTSET, 'Giantset'),
        (DROPSET, 'Dropset'),
        (TRIPLE_DROPSET, 'Triple Dropset'),
        (CIRCUIT_TRAINING, 'Circuit Training'),
        (REGULAR, 'Regular'),
        (CARDIO, 'Cardio'),
    ]
    exercise = models.ForeignKey("ProgramExercise", on_delete=models.CASCADE, related_name='program_exercie_sets')
    set_no = models.PositiveIntegerField(default=1)
    reps = models.CharField(default="1", max_length=150)
    weight = models.CharField(max_length=250, default="1")
    timer = models.FloatField(default=90.0)
    set_type = models.CharField(
        max_length=10,
        choices=TYPE,
        default=REGULAR
    )
    exercises = models.ManyToManyField('Exercise', blank=True)

    def __str__(self):
        return str(self.exercise)


class Workout(models.Model):
    session = models.ForeignKey('Session', related_name='workouts', on_delete=models.CASCADE)
    exercise = models.ForeignKey('Exercise', on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=500, null=True)
    order = models.PositiveIntegerField(default=1)
    timer = models.FloatField(default=90.0)
    done = models.BooleanField(default=False)
    exercises = models.ManyToManyField('Exercise', blank=True, related_name="multiple_exercises")

    def mark_done(self):
        sets = self.sets.filter(done=False)
        if not sets:
            self.done = True
            self.save()

    def mark_done_completely(self):
        self.done = True
        self.save()

    def reset(self):
        self.done = False
        self.save()
        for set in self.sets.all():
            set.reset()

# class WorkoutAssignedExercise(models.Model):
#     """
#     use for assigned program exercises according to set types
#     for superset two exercises will be used, for giantset three exercises will be added and for others one exercise will be added
#     """
#     exercises = models.ManyToManyField('Exercise', blank=True, related_name='assigned_workout_exercises')
#     workout = models.ForeignKey('Workout', related_name='assigned_workout_exercises',
#                                        on_delete=models.CASCADE, null=True, blank=True)
#     name = models.CharField(max_length=500, null=True, blank=True)


class CustomWorkout(models.Model):
    session = models.ForeignKey('Session', related_name='custom_workouts', on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, related_name='custom_workouts_users', on_delete=models.CASCADE)
    name = models.CharField(max_length=500, null=True)
    done = models.BooleanField(default=False)
    created_date = models.DateTimeField(null=True, blank=True, default=timezone.now)

    def mark_done_completely(self):
        self.done = True
        self.save()



class CustomExercise(models.Model):
    exercises = models.ManyToManyField('Exercise', blank=True, related_name='custom_workout_exercises')
    custom_workout = models.ForeignKey('CustomWorkout', related_name='custom_exercises_workouts',
                                       on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=500, null=True, blank=True)
    exercises_order = JSONField(null=True, blank=True)


class CustomSet(models.Model):
    REGULAR = 'r'
    SUPERSET = 'ss'
    GIANTSET = 'gs'
    DROPSET = 'ds'
    TRIPLE_DROPSET = 'td'
    CIRCUIT_TRAINING = 'ct'
    CARDIO = 'cr'
    TYPE = [
        (SUPERSET, 'Superset'),
        (GIANTSET, 'Giantset'),
        (DROPSET, 'Dropset'),
        (TRIPLE_DROPSET, 'Triple Dropset'),
        (CIRCUIT_TRAINING, 'Circuit Training'),
        (REGULAR, 'Regular'),
        (CARDIO, 'Cardio'),
    ]
    custom_exercise = models.ForeignKey('CustomExercise', related_name='custom_set_exercises', on_delete=models.CASCADE)
    set_no = models.PositiveIntegerField(default=1)

    reps = models.CharField(default="1", max_length=150)
    rest = models.CharField(default="1", max_length=150)
    weight = models.CharField(max_length=250, default="1")
    timer = models.FloatField(default=90.0)

    set_type = models.CharField(
        max_length=10,
        choices=TYPE,
        default=REGULAR
    )

    exercises = models.ManyToManyField('Exercise', blank=True, related_name='custom_sets_exercises')

    done = models.BooleanField(default=False)

    def mark_done(self):
        self.done = True
        self.save()


class Set(models.Model):
    REGULAR = 'r'
    SUPERSET = 'ss'
    GIANTSET = 'gs'
    DROPSET = 'ds'
    TRIPLE_DROPSET = 'td'
    CIRCUIT_TRAINING = 'ct'
    CARDIO = 'cr'
    TYPE = [
        (SUPERSET, 'Superset'),
        (GIANTSET, 'Giantset'),
        (DROPSET, 'Dropset'),
        (TRIPLE_DROPSET, 'Triple Dropset'),
        (CIRCUIT_TRAINING, 'Circuit Training'),
        (REGULAR, 'Regular'),
        (CARDIO, 'Cardio'),
    ]
    workout = models.ForeignKey('Workout', related_name='sets', on_delete=models.CASCADE)
    set_no = models.PositiveIntegerField(default=1)

    reps = models.CharField(default="1", max_length=150)
    weight = models.CharField(max_length=250, default="1")
    timer = models.FloatField(default=90.0)

    set_type = models.CharField(
        max_length=10,
        choices=TYPE,
        default=REGULAR
    )

    exercises = models.ManyToManyField('Exercise', blank=True, related_name='sets_exercises')

    done = models.BooleanField(default=False)

    def mark_done(self):
        self.done = True
        self.save()

    def reset(self):
        self.done = False
        self.save()


