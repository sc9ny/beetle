from authentication.models import Account
from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
import uuid


def unique_id_generator(instance, filename):
    extension = filename.split('.')[-1]
    return '{}.{}'.format(uuid.uuid4(), extension)


class GalleryPost(models.Model):
    title = models.CharField(max_length=50, default='', blank=False)
    author = models.ForeignKey(Account, null=True, blank=True, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)


class Gallery(models.Model):
    image = models.ImageField('Uploaded image', upload_to=unique_id_generator)
    description = models.CharField(max_length=100, blank=True)
    gallery_post = models.ForeignKey(GalleryPost, on_delete=models.CASCADE, related_name='photos', null=False,
                                     default=1)
    author = models.ForeignKey(Account, null=True, blank=True, on_delete=models.CASCADE)


class GalleryComment(models.Model):
    comment = models.TextField(default='', blank=False, null=False)
    gallery_post = models.ForeignKey(GalleryPost, on_delete=models.CASCADE, related_name='comments', null=False,
                                     default=1)
    author = models.ForeignKey(Account, null=True, blank=True, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)


@receiver(post_delete, sender=Gallery)
def gallery_post_delete_handler(sender, instance, **kwargs):
    instance.image.delete(False)