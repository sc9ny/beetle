from authentication.models import Account
from django.db import models
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from notifications.signals import notify
from utils import get_involved_users_from_post, get_involved_users_from_comments
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


@receiver(post_save, sender=Gallery)
def gallery_post_save_handler(sender, instance, created, **kwargs):
    if not created:
        involved_users = get_involved_users_from_post(instance)
        for user in involved_users:
            notify.send(instance, recipient=user, verb='has modified.')


@receiver(post_save, sender=GalleryComment)
def gallery_comment_post_save_handler(sender, instance, created, **kwargs):
    involved_users = get_involved_users_from_comments(instance)
    if created:
        for user in involved_users:
            notify.send(instance.gallery_post, recipient=user,
                        verb='{} has a new comment.'.format(instance.gallery_post.title))

