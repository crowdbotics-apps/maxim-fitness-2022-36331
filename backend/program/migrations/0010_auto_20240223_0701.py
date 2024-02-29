# Generated by Django 2.2.28 on 2024-02-23 07:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('program', '0009_auto_20240211_1207'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='workout',
            options={},
        ),
        migrations.AddField(
            model_name='workout',
            name='exercises',
            field=models.ManyToManyField(blank=True, related_name='multiple_exercises', to='program.Exercise'),
        ),
    ]
