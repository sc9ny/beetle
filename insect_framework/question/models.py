from authentication.models import Account
from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField


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
