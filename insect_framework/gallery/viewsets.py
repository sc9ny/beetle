from rest_framework import permissions, viewsets, filters
from gallery.serializer import (CreateCommentSerializer, CommentSerializer, GallerySerializer,
                                GalleryPostSerializer, SimpleGalleryPostSerializer)
from gallery.models import Gallery, GalleryComment, GalleryPost

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
    queryset = GalleryPost.objects.all().order_by('-id')
    serializer_class = GalleryPostSerializer
    pagination_class = HeaderPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'author__username']

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            self.permission_classes = [permissions.AllowAny, ]
        elif self.request.method == 'POST':
            self.permission_classes = [permissions.IsAuthenticated, ]
        else:
            self.permission_classes = [IsStaffOrAccountOwner, ]
        return super(GalleryPostViewSet, self).get_permissions()

    def get_queryset(self):
        username = self.request.query_params.get('profile', None)
        if username is not None:
            queryset = GalleryPost.objects.filter(author__username=username)
            return queryset
        queryset = super(GalleryPostViewSet, self).get_queryset()
        return queryset


class SimpleGalleryPostViewSet(viewsets.ModelViewSet):
    queryset = GalleryPost.objects.all().order_by('-id')
    serializer_class = SimpleGalleryPostSerializer
    pagination_class = HeaderPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'author__username']

    def get_queryset(self):
        username = self.request.query_params.get('profile', None)
        if username is not None:
            queryset = GalleryPost.objects.filter(author__username=username)
            return queryset
        queryset = super(GalleryPostViewSet, self).get_queryset()
        return queryset


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = GalleryComment.objects.all()
    pagination_class = HeaderPagination

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            self.permission_classes = [permissions.AllowAny, ]
        elif self.request.method == 'POST':
            self.permission_classes = [permissions.IsAuthenticated, ]
        else:
            self.permission_classes = [IsStaffOrAccountOwner, ]
        return super(CommentViewSet, self).get_permissions()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateCommentSerializer
        else:
            return CommentSerializer
