from rest_framework import serializers
from ..models import Post


class PostSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(read_only=True, slug_field='username')
    class Meta:
        model = Post
        fields = ('id','title', 'content', 'created', 'updated','author')
        read_only_fields = ('created','updated','author')