# Generated by Django 2.2.28 on 2023-11-06 12:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notification', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='post',
        ),
    ]
