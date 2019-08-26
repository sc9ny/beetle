from utils import HeaderPagination, isParticipant
from rest_framework import viewsets
from django_filters import rest_framework as filters
from rest_framework import filters as rest_filters
import django_filters
from .models import Chat
from .serializers import ChatSerializer, CreateChatSerializer, SimpleChatSerializer
from authentication.models import Account


class ChatFilter (django_filters.FilterSet):
    involved_users__username = django_filters.ModelMultipleChoiceFilter(queryset=Account.objects.all(), to_field_name='username', conjoined=True)

    class Meta:
        model = Chat
        fields = ['involved_users__username', ]


class ChatViewSet (viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    pagination_class = HeaderPagination
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = ChatFilter
    permission_classes = [isParticipant,]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateChatSerializer
        else:
            return ChatSerializer

class SimpeChatViewSet (viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    pagination_class = HeaderPagination
    filter_backends = (filters.DjangoFilterBackend, rest_filters.SearchFilter)
    filter_class = ChatFilter
    search_fields = ['involved_users__username', ]
    permission_classes = [isParticipant, ]
    serializer_class = SimpleChatSerializer



