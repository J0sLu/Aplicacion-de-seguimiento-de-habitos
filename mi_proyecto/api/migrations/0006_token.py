# Generated by Django 5.1.2 on 2024-10-29 06:43

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_rename_userapp_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='Token',
            fields=[
                ('key', models.CharField(max_length=40, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='api.user')),
            ],
        ),
    ]