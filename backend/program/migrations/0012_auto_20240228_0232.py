# Generated by Django 2.2.28 on 2024-02-28 02:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('program', '0011_auto_20240223_0807'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workout',
            name='exercise',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='program.Exercise'),
        ),
    ]
