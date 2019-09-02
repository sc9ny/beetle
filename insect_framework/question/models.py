from authentication.models import Account
from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from django.db.models.signals import post_save
from django.dispatch import receiver
from utils import get_involved_users_from_post, get_involved_users_from_comments
from notifications.signals import notify


class Question(models.Model):
    title = models.CharField(max_length=50)
    content = RichTextUploadingField()
    author = models.ForeignKey(Account, null=True, blank=True, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)


class Answer(models.Model):
    content = models.TextField()
    author = models.ForeignKey(Account, blank=True, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    associated_question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answer')


@receiver(post_save, sender=Question)
def question_post_save_handler(sender, instance, created, **kwargs):
    if not created:
        involved_users = get_involved_users_from_post(instance)
        for user in involved_users:
            notify.send(instance, recipient=user, verb='has modified.')


@receiver(post_save, sender=Answer)
def answer_post_save_handler(sender, instance, created, **kwargs):
    involved_users = get_involved_users_from_comments(instance)
    if created:
        for user in involved_users:
            notify.send(instance.associated_question, recipient=user,
                        verb='{} has a new comment.'.format(instance.associated_question.title))
