# Generated by Django 5.0.2 on 2024-07-28 01:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='property',
            old_name='no_of_guests',
            new_name='guests',
        ),
    ]