from insect_framework.urls import v1_router
from gallery.viewsets import GalleryViewSet

v1_router.register(r'gallery', GalleryViewSet, base_name='gallery')

urlpatterns = []
