from django.db import models
from django.contrib.auth import get_user_model
from django.conf import settings
# Create your models here.

from datetime import datetime, timedelta
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

    cardio = models.BooleanField(default=False, null=True, blank=True)
    cardio_length = models.PositiveIntegerField(null=True, blank=True)
    cardio_frequency = models.PositiveIntegerField(null=True, blank=True)
    heart_rate = models.PositiveIntegerField(null=True, blank=True)
    location = models.CharField(max_length=250, null=True, blank=True)
    protein = models.FloatField(null=True, blank=True)
    carb = models.FloatField(null=True, blank=True)
    carb_casual = models.FloatField(null=True, blank=True)
    done = models.BooleanField(default=False)

    def __str__(self):
        return str(self.user)

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
    description = models.TextField()
    video = models.FileField(upload_to='videos/', null=True)

    def __str__(self):
        return self.name


class Program(models.Model):
    name = models.CharField(max_length=250)
    description = models.TextField()

    def __str__(self):
        return self.name

    def get_date_time(self, days_gap):
        date_time = datetime.today().date() + timedelta(days=days_gap)
        return date_time

    def create_session(self, user):
        session = Session.objects.filter(user=user)
        if session:
            session.delete()
        weeks = self.weeks.all()
        print('weeks', weeks)
        days_gap = 0
        for week in weeks:
            days = week.days.all()
            print('total_days', days)
            # days_gap = 0
            for day in days:
                date_time = self.get_date_time(days_gap)
                session = Session.objects.create(
                    user=user,
                    date_time=date_time,
                    program=self,
                    cardio=day.cardio,
                    cardio_length=day.cardio_length,
                    cardio_frequency=day.cardio_frequency,
                    heart_rate=day.heart_rate,
                    location=day.location,
                    protein=day.protein,
                    carb=day.carb,
                    carb_casual=day.carb_casual,
                    name=day.name,
                )
                order = 1
                for exercise in day.day_exercises.all():
                    workout = Workout.objects.create(
                        session=session,
                        exercise=exercise.exercise,
                        order=order
                    )
                    order += 1
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
                        s_.exercises.set(set.exercises.all())
                        print(s_, 'created', s_.set_type)
                days_gap += 1
                print(*[s.set_type for s in session.get_sets()])


class Week(models.Model):
    program = models.ForeignKey("Program", on_delete=models.CASCADE, related_name="weeks")
    week = models.PositiveIntegerField()


class Day(models.Model):
    week = models.ForeignKey("Week", on_delete=models.CASCADE, related_name="days")
    day = models.PositiveIntegerField()

    cardio = models.BooleanField(default=False)
    cardio_length = models.PositiveIntegerField()
    cardio_frequency = models.PositiveIntegerField()
    heart_rate = models.PositiveIntegerField()
    location = models.CharField(max_length=250)
    protein = models.FloatField()
    carb = models.FloatField()
    carb_casual = models.FloatField()
    name = models.CharField(max_length=500, null=True, blank=True)


class ProgramExercise(models.Model):
    day = models.ForeignKey("Day", on_delete=models.CASCADE, null=True, related_name="day_exercises")
    exercise = models.ForeignKey("Exercise", on_delete=models.CASCADE)

    def __str__(self):
        return str(self.exercise)


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
    exercise = models.ForeignKey('Exercise', on_delete=models.CASCADE)
    name = models.CharField(max_length=500, null=True)
    order = models.PositiveIntegerField(default=1)
    timer = models.FloatField(default=90.0)
    done = models.BooleanField(default=False)

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

    exercises = models.ManyToManyField('Exercise', blank=True)

    done = models.BooleanField(default=False)

    def mark_done(self):
        self.done = True
        self.save()

    def reset(self):
        self.done = False
        self.save()
