from django.db import models
import uuid


def unique_id_generator(instance, filename):
    extension = filename.split('.')[-1]
    return '{}.{}'.format(uuid.uuid4(), extension)


class GalleryPost(models.Model):
    title = models.CharField(max_length=50, default='', blank=False)


class Gallery(models.Model):
    image = models.ImageField('Uploaded image', upload_to=unique_id_generator)
    description = models.CharField(max_length=100, blank=True)
    gallery_post = models.ForeignKey(GalleryPost, on_delete=models.CASCADE, related_name='photos', null=False,
                                     default=1)
