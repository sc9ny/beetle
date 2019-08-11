from rest_framework import permissions, viewsets, filters

from utils import HeaderPagination, IsStaffOrAccountOwner

from ..models import Post
from ..serializers.post import PostSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-id')
    serializer_class = PostSerializer
    pagination_class = HeaderPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content', 'author__username']

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            self.permission_classes = [permissions.AllowAny,]
        elif self.request.method == 'POST':
            self.permission_classes = [permissions.IsAuthenticated,]
        else:
            self.permission_classes = [IsStaffOrAccountOwner,]
        return super(PostViewSet, self).get_permissions()

    def get_queryset(self):
        username = self.request.query_params.get('profile', None)
        if username is not None:
            queryset = Post.objects.filter(author__username=username)
            return queryset
        queryset = super(PostViewSet, self).get_queryset()
        return queryset


class MyPostViewSet(PostViewSet):

    def get_queryset(self):
        qs = super(PostViewSet, self).get_queryset()
        qs = qs.filter(author=self.request.user)
        # TODO: do some prefetch stuff here
        return qs
