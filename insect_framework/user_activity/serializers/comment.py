from rest_framework import serializers

from ..models import Comment, Post

class CommentSerializer(serializers.ModelSerializer):
    associated_post = serializers.PrimaryKeyRelatedField(read_only=True)
    author = serializers.SlugRelatedField(read_only=True, slug_field='username')

    class Meta:
        model = Comment
        fields = ('id','content', 'created', 'updated', 'author', 'associated_post')
        read_only_fields = ('created', 'updated','author', 'associated_post')


class CreateCommentSerializer(CommentSerializer):
    associated_post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super(CommentSerializer, self).create(validated_data)