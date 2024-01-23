from django.contrib import admin
from django.urls import path
from django.shortcuts import redirect, render
from django import forms

from .models import *

import csv
import nested_admin
from io import TextIOWrapper


class CsvImportForm(forms.Form):
    csv_file = forms.FileField()


admin.site.register(ExerciseType)


class ProgramSetInline(nested_admin.NestedTabularInline):
    model = ProgramSet
    extra = 0


class ProgramExerciseReplacementInline(nested_admin.NestedTabularInline):
    model = ProgramExerciseReplacement
    extra = 0


class ProgramExerciseInline(nested_admin.NestedTabularInline):
    model = ProgramExercise
    extra = 0
    inlines = [ProgramSetInline, ProgramExerciseReplacementInline]


class DayInline(nested_admin.NestedTabularInline):
    model = Day
    inlines = [ProgramExerciseInline]
    extra = 0


class WeekInline(nested_admin.NestedTabularInline):
    model = Week
    extra = 0
    inlines = [DayInline]


class ProgramAdmin(nested_admin.NestedModelAdmin):
    change_list_template = "admin/program_changelist.html"
    inlines = [WeekInline]

    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('import-csv/', self.import_csv),
        ]
        return my_urls + urls

    @staticmethod
    def add_program(detail):
        program = Program.objects.create(
            name=detail[0],
            description=detail[1],
        )
        return program

    @staticmethod
    def add_week(detail, program):
        week, created = Week.objects.get_or_create(
            program=program,
            week=int(detail[0].strip())
        )
        return week

    @staticmethod
    def add_day(detail, program):
        if detail[0] == "":
            return

        week = ProgramAdmin.add_week(detail, program)
        day = Day.objects.create(
            week=week,
            day=int(detail[1]),
            cardio=True if detail[2].lower() == 'yes' else False,
            cardio_length=int(detail[3]),
            cardio_frequency=int(detail[4]),
            heart_rate=int(detail[5]),
            location=detail[6],
            protein=float(detail[7]),
            carb=float(detail[8]),
            carb_casual=float(detail[9]),
            name=detail[11],
        )
        return day

    @staticmethod
    def add_exercise(day, detail, blank):
        if detail[0] == "":
            return None, blank + 1
        print('detail[0]===========', detail[0])
        try:
            exer = Exercise.objects.get(exercise_id__iexact=detail[0])
            exercise = ProgramExercise.objects.create(
                day=day,
                exercise=exer
            )
        except Exercise.DoesNotExist:
            print('Exercise Not found with ID {}'.format(detail[0]))

        col = 1
        while detail[col] != "":
            print('detail[col]=========', detail[col])
            try:
                replacement = Exercise.objects.get(exercise_id__iexact=detail[col])
                ProgramExerciseReplacement.objects.create(
                    exercise=exercise,
                    replacement=replacement
                )
            except Exercise.DoesNotExist:
                print('Replacement Exercise Not found with ID {}'.format(detail[col]))
            col = col + 1
        return exercise, blank

    @staticmethod
    def get_exercises(query):
        exercises = []
        if query:
            id_list = query.split('/')
            for id in id_list:
                exercises.append(Exercise.objects.get(exercise_id__iexact=id.lower()))
        return exercises

    def add_set(self, exercise, detail):
        working_set = ProgramSet.objects.create(
            exercise=exercise,
            set_no=int(detail[0]),
            reps=detail[1],
            weight=int(detail[3]),
            timer=int(detail[2]),
            set_type=detail[4] if detail[4] else 'r',
        )
        working_set.exercises.add(*self.get_exercises(detail[5]))

    def import_csv(self, request):
        if request.method == "POST":
            csv_file = TextIOWrapper(request.FILES["csv_file"], encoding='utf-8-sig')
            reader = csv.reader(csv_file, delimiter=",")
            program = ProgramAdmin.add_program(next(reader))
            blank = 0
            day = None
            for row in reader:
                if row[0] == "":
                    blank = blank + 1

                    if blank == 3:
                        break
                    exercise, blank = ProgramAdmin.add_exercise(day, next(reader), blank)
                else:
                    if blank == 2:
                        day = ProgramAdmin.add_day(row, program)
                        blank = 0
                        continue
                    blank = 0
                    self.add_set(exercise, row)
                    print('SET', row)

            print("reched here bro")
            self.message_user(request, "Your csv file has been imported")
            return redirect("..")
        if request.method == "GET":
            form = CsvImportForm()
            payload = {"form": form}
            return render(request, "admin/csv_form.html", payload)


admin.site.register(Program, ProgramAdmin)


class ExerciseImagesInline(admin.TabularInline):
    model = ExerciseImages


class WorkoutAdmin(admin.ModelAdmin):
    list_display = ["id", "session", "exercise"]


class ExerciseAdmin(admin.ModelAdmin):
    '''
        Admin View for
    '''
    inlines = [ExerciseImagesInline]
    list_display = ['name', 'exercise_id']
    search_fields = ['name', 'exercise_id']
    list_filter = ['exercise_type']


admin.site.register(Exercise, ExerciseAdmin)


class SetInline(nested_admin.NestedTabularInline):
    model = Set


class WorkoutInline(nested_admin.NestedStackedInline):
    model = Workout
    inlines = [SetInline]


class SessionAdmin(nested_admin.NestedModelAdmin):
    list_display = ['name', 'date_time', 'user', 'program']
    inlines = [WorkoutInline]


class ProgramExerciseReplacementAdmin(admin.ModelAdmin):
    list_display = ["exercise", "replacement"]


class DayAdmin(admin.ModelAdmin):
    list_display = ["id", "week", 'name', 'cardio', 'cardio_length', 'cardio_frequency', 'heart_rate', 'location']


class WeekAdmin(admin.ModelAdmin):
    list_display = ["id", "program", 'week']


admin.site.register(Session, SessionAdmin)
admin.site.register(Workout, WorkoutAdmin)
admin.site.register(Day, DayAdmin)
admin.site.register(Week, WeekAdmin)

admin.site.register(Report)
admin.site.register(ProgramExercise)
admin.site.register(ProgramSet)
# admin.site.register(Workout)
admin.site.register(Set)
admin.site.register(ProgramExerciseReplacement, ProgramExerciseReplacementAdmin)
