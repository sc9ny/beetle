from rest_framework import serializers
from .models import Chat, Message
from authentication.models import Account


class MessageSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(read_only=True, slug_field='username')

    class Meta:
        model = Message
        fields = ['id', 'author', 'content', 'timestamp']
        read_only_fields = ['id', 'author', 'content', 'timestamp']


class ChatSerializer(serializers.ModelSerializer):
    involved_users = serializers.SlugRelatedField(many=True, read_only=True, slug_field='username')
    message = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'created', 'updated', 'message', 'involved_users']
        read_only_fields = ['involved_users']


class CreateChatSerializer(ChatSerializer):
    involved_users = serializers.SlugRelatedField(many=True, queryset= Account.objects.all(), slug_field='username')
    class Meta:
        model = Chat
        fields = ['id', 'created', 'updated', 'message', 'involved_users']
        read_only_fields = []


class SimpleChatSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    involved_users = serializers.SlugRelatedField(many=True, read_only=True, slug_field='username')

    class Meta:
        model = Chat
        fields = ['id', 'last_message', 'involved_users',]

    def get_last_message(self, obj):
        return MessageSerializer(obj.message.last()).data
