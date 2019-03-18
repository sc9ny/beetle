from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter

from authentication.views import LoginView, LogoutView
from .views import IndexView, notFoundView

v1_router = DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user-activity/', include('user_activity.urls')),
    path('authentication/', include('authentication.urls')),
    path('api/v1/login/', LoginView.as_view(), name='login'),
    path('api/v1/logout/', LogoutView.as_view(), name='logout'),
    path('api/v1/', include(v1_router.urls)),
    path('notFound/', notFoundView.as_view(), name='404'),
    re_path('^.*', IndexView.as_view(), name='index'),
]
