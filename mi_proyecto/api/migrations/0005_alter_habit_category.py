# Generated by Django 5.1.2 on 2024-10-29 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_habit_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='habit',
            name='category',
            field=models.TextField(default='default_category', max_length=255),
        ),
    ]