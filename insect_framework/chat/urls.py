from django.urls import path, re_path
from .views import index, room
from .viewsets import ChatViewSet, SimpeChatViewSet, NotificationViewSet
from insect_framework.urls import v1_router


v1_router.register(r'chat', ChatViewSet, base_name='chat')
v1_router.register(r'simple-chat', SimpeChatViewSet, base_name='simple-chat')
v1_router.register(r'notification', NotificationViewSet, base_name='notification')
urlpatterns = [
    #path('', index, name='index'),
    # re_path(r'^(?P<room_name>[^/]+)/$', room, name='room'),
]
