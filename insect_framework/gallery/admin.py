from django.contrib import admin

from gallery.models import Gallery, GalleryPost

# Register your models here.
admin.site.register(Gallery)
admin.site.register(GalleryPost)
