from rest_framework import serializers
from gallery.models import Gallery, GalleryPost, GalleryComment


class CommentSerializer(serializers.ModelSerializer):
    gallery_post = serializers.PrimaryKeyRelatedField(read_only=True)
    author = serializers.SlugRelatedField(read_only=True, slug_field='username')

    class Meta:
        model = GalleryComment
        fields = ('id', 'comment', 'created', 'updated', 'author', 'gallery_post')
        read_only_fields = ('created', 'updated', 'author', 'gallery_post')


class CreateCommentSerializer(CommentSerializer):
    gallery_post = serializers.PrimaryKeyRelatedField(queryset=GalleryPost.objects.all())

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super(CreateCommentSerializer, self).create(validated_data)


class GallerySerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(read_only=True, slug_field='username')

    class Meta:
        model = Gallery
        fields = ['id', 'image', 'description', 'gallery_post', 'author']

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super(GallerySerializer, self).create(validated_data)


class GalleryPostSerializer(serializers.ModelSerializer):
    photos = GallerySerializer(many=True, required=False)
    comments = CommentSerializer(many=True, required=False)
    author = serializers.SlugRelatedField(read_only=True, slug_field='username')

    class Meta:
        model = GalleryPost
        fields = ['id', 'title', 'photos', 'author', 'created', 'comments', ]

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super(GalleryPostSerializer, self).create(validated_data)


class SimpleGalleryPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryPost
        fields = ['id', 'title', 'author', 'created']
        read_only_fields = ('id', 'title', 'author', 'created')
