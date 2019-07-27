from rest_framework import serializers

from .comment import CommentSerializer
from ..models import Post, Comment


class PostSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(read_only=True, slug_field='username')
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ('id','title', 'content', 'created', 'updated','author','comments')
        read_only_fields = ('created','updated','author','comments',)

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super(PostSerializer, self).create(validated_data)

    def validate_content(self, value):
        if (len(value.encode('utf-8'))) < 512000:
            return value
        raise serializers.ValidationError('Please limit your content to 500KB')
