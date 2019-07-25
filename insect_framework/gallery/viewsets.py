from rest_framework import viewsets
from gallery.serializer import GallerySerializer
from gallery.models import Gallery


class GalleryViewSet(viewsets.ModelViewSet):
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer
