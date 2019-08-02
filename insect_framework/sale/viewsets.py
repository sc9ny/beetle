from rest_framework import permissions, viewsets, filters

from utils import HeaderPagination, IsStaffOrAccountOwner

from .models import Sale, SaleComment
from .serializer import SaleSerializer, SaleCommentSerializer, CreateSaleCommentSerializer


class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all().order_by('-id')
    serializer_class = SaleSerializer
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
        return super(SaleViewSet, self).get_permissions()


class SaleCommentViewSet(viewsets.ModelViewSet):
    serializer_class = SaleCommentSerializer
    queryset = SaleComment.objects.all()
    pagination_class = HeaderPagination

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            self.permission_classes = [permissions.AllowAny,]
        elif self.request.method == 'POST':
            self.permission_classes = [permissions.IsAuthenticated,]
        else:
            self.permission_classes = [IsStaffOrAccountOwner,]
        return super(SaleCommentViewSet, self).get_permissions()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateSaleCommentSerializer
        else:
            return SaleCommentSerializer

