# Generated by Django 2.2.28 on 2024-06-11 12:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('program', '0022_auto_20240606_1047'),
    ]

    operations = [
        migrations.AddField(
            model_name='programexercise',
            name='exercise_ids_for_validation',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
