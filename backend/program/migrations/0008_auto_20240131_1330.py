# Generated by Django 2.2.28 on 2024-01-31 13:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('program', '0007_auto_20240123_1118'),
    ]

    operations = [
        migrations.AddField(
            model_name='day',
            name='strength',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='session',
            name='strength',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='exercise',
            name='description',
            field=models.TextField(blank=True, default='', null=True),
        ),
        migrations.AlterField(
            model_name='session',
            name='cardio',
            field=models.BooleanField(default=False),
        ),
    ]
