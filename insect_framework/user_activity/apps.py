from django.apps import AppConfig


class UserActivityConfig(AppConfig):
    name = 'user_activity'

    def ready(self):
        import user_activity.user_signal