# Generated by Django 5.1.2 on 2024-10-29 06:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_rename_user_userapp_delete_token'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='UserApp',
            new_name='User',
        ),
    ]
