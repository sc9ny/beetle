from authentication.models import Account
from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField


class Post(models.Model):
    title = models.CharField(max_length=50)
    content = RichTextUploadingField()
    author = models.ForeignKey(Account, null=True, blank=True, on_delete=models.SET_NULL)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return 'author-{}-id-{}'.format(self.author, self.id)


class Comment(models.Model):
    content = models.TextField()
    author = models.ForeignKey(Account, blank=True, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    associated_post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')

    def __str__(self):
        return '{}'.format(self.author)
