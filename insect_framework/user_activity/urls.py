from insect_framework.urls import v1_router
from .api.comment import MyCommentViewSet, CommentViewSet
from .api.post import MyPostViewSet, PostViewSet

v1_router.register(r'post', PostViewSet)
v1_router.register(r'mypost', MyPostViewSet)
v1_router.register(r'comment', CommentViewSet)
v1_router.register(r'mycomment', MyCommentViewSet)

urlpatterns = []