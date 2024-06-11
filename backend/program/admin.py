from django.contrib import admin
from django.urls import path
from django.shortcuts import redirect, render
from django import forms
from import_export import resources
from import_export.admin import ImportExportModelAdmin

from .models import *

import csv
import nested_admin
from io import TextIOWrapper


class CsvImportForm(forms.Form):
    csv_file = forms.FileField()




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
            previous_row = [None] * 15  # Adjust the size according to the number of columns
            header_skipped = False

            try:
                for row in reader:
                    if not header_skipped and row[0] == 'program_name':  # Skip the header row
                        header_skipped = True
                        continue

                    # Fill in missing values with previous row's values
                    for i in range(len(row)):
                        if row[i].strip() == '':
                            row[i] = previous_row[i]
                        else:
                            previous_row[i] = row[i]

                    try:
                        # Extract data from the row
                        program_name = row[0].lower()
                        week_number = int(row[1])
                        day_number = int(row[2])
                        strength = row[3] == 'TRUE'
                        cardio = row[4] == 'TRUE'
                        cardio_length = int(row[5]) if row[5] else 0
                        cardio_frequency = int(row[6]) if row[6] else 1
                        location = row[7]
                        day_name = row[8]
                        exercise_ids = row[9]
                        set_no = int(row[10])
                        reps = row[11]
                        weight = int(row[12]) if row[12] else 1
                        timer = float(row[13]) if row[13] else 0
                        set_type = row[14]
                    except ValueError as e:
                        self.message_user(request, f"Data conversion error in row {reader.line_num}: {e}",
                                          level='error')
                        continue

                    try:
                        # Create or get program, week, and day
                        program, _ = Program.objects.get_or_create(name=program_name, description="program_description")
                        week, _ = Week.objects.get_or_create(program=program, week=week_number)
                        day, _ = Day.objects.get_or_create(
                            week=week,
                            day=day_number,
                            cardio_length=cardio_length,
                            cardio_frequency=cardio_frequency,
                            cardio=cardio,
                            strength=strength,
                            location=location,
                            name=day_name,
                            carb=0, protein=0, carb_casual=0, heart_rate=0
                        )
                    except Exception as e:
                        self.message_user(request,
                                          f"Error creating program, week, or day in row {reader.line_num}: {e}",
                                          level='error')
                        continue

                    try:
                        # Get exercises
                        exercises = []
                        if exercise_ids:
                            for exercise_id in exercise_ids.split('/'):
                                try:
                                    exercises.append(Exercise.objects.get(exercise_id__iexact=exercise_id))
                                except Exercise.DoesNotExist:
                                    self.message_user(request, f"Exercise ID not found: {exercise_id}", level='error')
                    except Exception as e:
                        self.message_user(request, f"Error retrieving exercises in row {reader.line_num}: {e}",
                                          level='error')
                        continue

                    try:
                        # Determine program exercise name
                        program_exercise_name = 'Rest' if day_name.lower() == 'rest' else (
                            exercises[0].name if len(exercises) == 1 else (
                                'SuperSet' if len(exercises) == 2 else 'GiantSet'))

                        # Create or get program exercise and set
                        if day_name.lower() != 'rest':
                            if program_exercise_name in ['GiantSet', 'SuperSet']:
                                print('hwe')

                            program_exercise = ProgramExercise.objects.filter(
                                day=day,name=program_exercise_name, exercise_ids_for_validation__exact=exercise_ids
                            )
                            if program_exercise.exists():
                                program_exercise = program_exercise.first()
                                program_exercise.exercises.set(exercises)
                            else:
                                program_exercise = ProgramExercise.objects.create(
                                    day=day, name=program_exercise_name,
                                    exercise_ids_for_validation=exercise_ids
                                )
                                program_exercise.exercises.set(exercises)
                            prog_set, created = ProgramSet.objects.get_or_create(
                                exercise=program_exercise,
                                set_no=set_no,
                                reps=reps,
                                weight=weight,
                                timer=timer,
                                set_type=set_type
                            )
                            print(prog_set.id, created)
                    except Exception as e:
                        self.message_user(request, f"Error creating exercise or set in row {reader.line_num}: {e}",
                                          level='error')
                        continue

                self.message_user(request, "Your CSV file has been imported successfully")
            except Exception as e:
                self.message_user(request, f"Unexpected error: {e}", level='error')
            return redirect("..")
        elif request.method == "GET":
            form = CsvImportForm()
            payload = {"form": form}
            return render(request, "admin/csv_form.html", payload)


admin.site.register(Program, ProgramAdmin)


class ExerciseImagesInline(admin.TabularInline):
    model = ExerciseImages


class WorkoutAdmin(admin.ModelAdmin):
    list_display = ["id", "session", "exercise"]


class ExerciseSource(resources.ModelResource):
    class Meta:
        model = Exercise


class ExerciseAdmin(ImportExportModelAdmin):
    '''
    Admin View for Exercise
    '''
    inlines = [ExerciseImagesInline]
    list_display = ['name', 'exercise_id']
    search_fields = ['name', 'exercise_id']
    list_filter = ['exercise_type']
    resource_class = ExerciseSource


admin.site.register(Exercise, ExerciseAdmin)


class SetInline(nested_admin.NestedTabularInline):
    model = Set


class WorkoutInline(nested_admin.NestedStackedInline):
    model = Workout
    inlines = [SetInline]


class SessionAdmin(nested_admin.NestedModelAdmin):
    list_display = ['name', 'date_time', 'user', 'program', 'cardio', 'strength']
    inlines = [WorkoutInline]


class ProgramExerciseReplacementAdmin(admin.ModelAdmin):
    list_display = ["exercise", "replacement"]


class DayAdmin(admin.ModelAdmin):
    list_display = ["id", "week", 'name', 'cardio', 'strength', 'cardio_length', 'cardio_frequency', 'heart_rate', 'location']


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


class ExerciseTypeSource(resources.ModelResource):
    class Meta:
        model = ExerciseType


@admin.register(ExerciseType)
class ExerciseTypeAdmin(ImportExportModelAdmin):
    resource_class = ExerciseTypeSource
