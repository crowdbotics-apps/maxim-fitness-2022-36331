# Generated by Django 2.2.28 on 2022-09-22 13:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('program', '0003_remove_exercise_done'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='date_time',
            field=models.DateField(),
        ),
    ]
