from insect_framework.urls import v1_router
from .api.post import PostViewSet

v1_router.register(r'post', PostViewSet)

urlpatterns = []