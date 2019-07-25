from django.db import models
import uuid


def unique_id_generator(instance, filename):
    extension = filename.split('.')[-1]
    return '{}.{}'.format(uuid.uuid4(), extension)


class Gallery(models.Model):
    image = models.ImageField('Uploaded image', upload_to=unique_id_generator)
