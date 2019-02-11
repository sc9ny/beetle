from insect_framework.urls import v1_router
from .views import AccountViewSet

v1_router.register(r'account', AccountViewSet)

urlpatterns = []