
from insect_framework.urls import v1_router
from .views import AccountViewSet, LoginView

v1_router.register(r'accounts', AccountViewSet)
urlpatterns = [

]