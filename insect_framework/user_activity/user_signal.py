from django.db.models import signals
from .models import Post,Comment
from django.dispatch import receiver

@receiver(signals.pre_save, sender=Post)
def post_pre_save_handler(sender, instance, **kwargs):
    if 'created' in kwargs:
        pass
        #instance.author =

@receiver(signals.pre_save, sender=Comment)
def comment_pre_save_handler(sender, instance, **kwargs):
    pass
