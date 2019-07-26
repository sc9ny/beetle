from rest_framework import permissions, viewsets, filters
from gallery.serializer import GallerySerializer, GalleryPostSerializer
from gallery.models import Gallery, GalleryPost

from utils import HeaderPagination, IsStaffOrAccountOwner


class GalleryViewSet(viewsets.ModelViewSet):
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer
    pagination_class = HeaderPagination

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            self.permission_classes = [permissions.AllowAny,]
        elif self.request.method == 'POST':
            self.permission_classes = [permissions.IsAuthenticated,]
        else:
            self.permission_classes = [IsStaffOrAccountOwner,]
        return super(GalleryViewSet, self).get_permissions()


class GalleryPostViewSet(viewsets.ModelViewSet):
    queryset = GalleryPost.objects.all()
    serializer_class = GalleryPostSerializer
    pagination_class = HeaderPagination

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            self.permission_classes = [permissions.AllowAny,]
        elif self.request.method == 'POST':
            self.permission_classes = [permissions.IsAuthenticated,]
        else:
            self.permission_classes = [IsStaffOrAccountOwner,]
        return super(GalleryPostViewSet, self).get_permissions()
