from insect_framework.urls import v1_router
from gallery.viewsets import GalleryViewSet, GalleryPostViewSet, CommentViewSet, SimpleGalleryPostViewSet

v1_router.register(r'gallery', GalleryViewSet, base_name='gallery')
v1_router.register(r'gallery-post', GalleryPostViewSet, base_name='gallery-post')
v1_router.register(r'gallery-comment', CommentViewSet, base_name='gallery-comment')
v1_router.register(r'simple-gallery-post', SimpleGalleryPostViewSet, base_name='simple-gallery')
urlpatterns = []
