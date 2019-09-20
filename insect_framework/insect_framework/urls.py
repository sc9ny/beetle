from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter

from authentication.views import LoginView, LogoutView
from .views import IndexView, notFoundView
import notifications.urls
v1_router = DefaultRouter()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user-activity/', include('user_activity.urls')),
    path('gallery/', include('gallery.urls')),
    path('question/', include('question.urls')),
    path('sale/', include('sale.urls')),
    path('chat/', include('chat.urls')),
    path('inbox/notifications/', include(notifications.urls, namespace='notifications')),
    path('authentication/', include('authentication.urls')),
    path('api/v1/login/', LoginView.as_view(), name='login'),
    path('api/v1/logout/', LogoutView.as_view(), name='logout'),
    path('api/v1/', include(v1_router.urls)),
    path('password-reset/', auth_views.PasswordResetView.as_view(template_name='password_reset.html'),
         name='password_reset'),
    path('password-reset/done/', auth_views.PasswordResetDoneView.as_view(template_name='password_reset_done.html'),
         name='password_reset_done'),
    path('password-reset-confirm/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='password_reset_confirm.html'),
         name='password_reset_confirm'),
    path('password-reset-complete/', auth_views.PasswordResetCompleteView.as_view(template_name='password_reset_complete.html'),
         name='password_reset_complete'),


    path('ckeditor/', include('ckeditor_uploader.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + [re_path('^.*', IndexView.as_view(), name='index')]
