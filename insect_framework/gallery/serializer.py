from rest_framework import serializers
from gallery.models import Gallery, GalleryPost


class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = ['id', 'image', 'description', 'gallery_post']


class GalleryPostSerializer(serializers.ModelSerializer):
    photos = GallerySerializer(many=True, required=False)

    class Meta:
        model = GalleryPost
        fields = ['id', 'title', 'photos']