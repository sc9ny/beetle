from rest_framework import viewsets
from rest_framework import permissions

from utils import HeaderPagination, IsStaffOrAccountOwner

from ..models import Post
from ..serializers.post import PostSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = HeaderPagination

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            self.permission_classes = [permissions.AllowAny,]
        elif self.request.method == 'POST':
            self.permission_classes = [permissions.IsAuthenticated,]
        else:
            self.permission_classes = [IsStaffOrAccountOwner,]
        return super(PostViewSet, self).get_permissions()


class MyPostViewSet(PostViewSet):

    def get_queryset(self):
        qs = super(PostViewSet, self).get_queryset()
        qs = qs.filter(author=self.request.user)
        # TODO: do some prefetch stuff here
        return qs
