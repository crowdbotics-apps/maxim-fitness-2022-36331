# Generated by Django 2.2.28 on 2023-04-18 11:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_auto_20230418_0544'),
    ]

    operations = [
        migrations.AddField(
            model_name='uservideo',
            name='thumbnail',
            field=models.FileField(blank=True, null=True, upload_to='user/videos/thumbnails'),
        ),
    ]
