from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter

from authentication.views import LoginView, LogoutView
from .views import IndexView, notFoundView
from django.views.generic.base import RedirectView

v1_router = DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user-activity/', include('user_activity.urls')),
    path('gallery/', include('gallery.urls')),
    path('question/', include('question.urls')),
    path('sale/', include('sale.urls')),
    path('authentication/', include('authentication.urls')),
    path('api/v1/login/', LoginView.as_view(), name='login'),
    path('api/v1/logout/', LogoutView.as_view(), name='logout'),
    path('api/v1/', include(v1_router.urls)),
    path('notFound/', notFoundView.as_view(), name='404'),

    path('ckeditor/', include('ckeditor_uploader.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + [re_path('^.*', IndexView.as_view(), name='index')]
