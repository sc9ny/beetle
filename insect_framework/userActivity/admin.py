from django.contrib import admin
from .models import Comment, Post
# Register your models here.


class TimeAdmin(admin.ModelAdmin):
    readonly_fields = ('created', 'updated',)


admin.site.register(Comment, TimeAdmin)
admin.site.register(Post, TimeAdmin)
