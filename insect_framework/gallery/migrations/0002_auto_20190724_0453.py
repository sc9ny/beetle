# Generated by Django 2.1.5 on 2019-07-24 04:53

from django.db import migrations, models
import gallery.models


class Migration(migrations.Migration):

    dependencies = [
        ('gallery', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gallery',
            name='image',
            field=models.ImageField(upload_to=gallery.models.unique_id_generator, verbose_name='Uploaded image'),
        ),
    ]
