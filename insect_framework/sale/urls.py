from insect_framework.urls import v1_router
from .viewsets import SaleCommentViewSet, SaleViewSet

v1_router.register(r'sale', SaleViewSet)
v1_router.register(r'sale-comment', SaleCommentViewSet)

urlpatterns = []
