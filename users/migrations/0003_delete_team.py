# Generated by Django 5.0.7 on 2024-08-27 11:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_remove_user_team_token_alter_team_members_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Team',
        ),
    ]
