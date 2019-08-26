from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Chat(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    involved_users = models.ManyToManyField(User)


class Message(models.Model):
    author = models.ForeignKey(User, related_name='author_messages', on_delete=models.CASCADE)
    chat = models.ForeignKey(Chat, related_name='message', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp', ]

    def __str__(self):
        return self.author.username

    def last_10_messages():
        return Message.objects.order_by('-timestamp').all()[:10]

    # @staticmethod
    # def last_message(users):
    #     return Message.objects.filter(
    #         models.Q(chat__involved_users__username__contains=users[0] and users[1])).last()
