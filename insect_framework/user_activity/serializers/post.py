from rest_framework import serializers

from .comment import CommentSerializer
from ..models import Post, Comment


class PostSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(read_only=True, slug_field='username')
    comments = CommentSerializer(many=True)

    class Meta:
        model = Post
        fields = ('id','title', 'content', 'created', 'updated','author','comments')
        read_only_fields = ('created','updated','author')

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super(PostSerializer, self).create(validated_data)