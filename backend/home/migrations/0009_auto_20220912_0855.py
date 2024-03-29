# Generated by Django 2.2.28 on 2022-09-12 08:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0008_auto_20220907_1251'),
    ]

    operations = [
        migrations.CreateModel(
            name='PostImage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.FileField(blank=True, null=True, upload_to='post_image/image')),
                ('video_thumbnail', models.FileField(blank=True, null=True, upload_to='post_video/thumbnail')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='post_image_video', to='home.Post')),
            ],
        ),
        migrations.CreateModel(
            name='PostVideo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('video', models.FileField(upload_to='post_video/video')),
                ('created', models.DateField()),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='post_video', to='home.Post')),
            ],
        ),
        migrations.DeleteModel(
            name='PostImageVideo',
        ),
    ]
