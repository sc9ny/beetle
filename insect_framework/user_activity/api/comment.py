from rest_framework import permissions
from rest_framework import viewsets

from utils import HeaderPagination, IsStaffOrAccountOwner

from ..models import Comment
from ..serializers.comment import CreateCommentSerializer, CommentSerializer


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    pagination_class = HeaderPagination

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            self.permission_classes = [permissions.AllowAny,]
        elif self.request.method == 'POST':
            self.permission_classes = [permissions.IsAuthenticated,]
        else:
            self.permission_classes = [IsStaffOrAccountOwner,]
        return super(CommentViewSet, self).get_permissions()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateCommentSerializer
        else:
            return CommentSerializer


class MyCommentViewSet(CommentViewSet):
    def get_queryset(self):
        qs = super(MyCommentViewSet, self).get_queryset()
        qs = qs.filter(author=self.request.user)
        return qs