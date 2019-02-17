from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter

from .views import IndexView

v1_router = DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user-activity/', include('user_activity.urls')),
    path('authentication/', include('authentication.urls')),
    path('api/v1/', include(v1_router.urls)),
    re_path('', IndexView.as_view(), name='index'),
]
