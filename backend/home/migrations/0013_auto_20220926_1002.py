# Generated by Django 2.2.28 on 2022-09-26 10:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0012_auto_20220920_0658'),
    ]

    operations = [
        migrations.AlterField(
            model_name='postvideo',
            name='video_thumbnail',
            field=models.ImageField(blank=True, null=True, upload_to='post_video/thumbnail'),
        ),
    ]