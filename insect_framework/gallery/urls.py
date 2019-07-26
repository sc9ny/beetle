from insect_framework.urls import v1_router
from gallery.viewsets import GalleryViewSet, GalleryPostViewSet

v1_router.register(r'gallery', GalleryViewSet, base_name='gallery')
v1_router.register(r'gallery-post', GalleryPostViewSet, base_name='gallery-post')
urlpatterns = []
