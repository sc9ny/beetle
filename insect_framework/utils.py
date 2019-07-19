from rest_framework.pagination import PageNumberPagination
from rest_framework import permissions
from rest_framework.response import Response

class BasicPageNumberPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = 'limit'
    max_page_size = 25


class HeaderPagination(BasicPageNumberPagination):
    def get_paginated_response(self, data):
        next_url=self.get_next_link()
        previous_url = self.get_previous_link()
        count = self.page.paginator.count

        links = []
        if next_url:
            links.append('<{}>; rel="next"'.format(next_url))
        if previous_url:
            links.append('<{}>; rel="prev'.format(previous_url))

        headers = {
            'X-count': count,
            'X-limit': self.page.paginator.per_page
        }
        if links:
            headers['Link'] = ', '.join(links)
        return Response(data, headers=headers)

class IsStaffOrAccountOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user:
            return request.user.is_staff or str(obj.author) == str(request.user)
        return False

def get_permissions(self, cls):
    if self.request.method in permissions.SAFE_METHODS:
        self.permission_classes = [permissions.AllowAny,]
    elif self.request.method == 'POST':
        self.permission_classes = [permissions.IsAuthenticated,]
    else:
        self.permission_classes = [IsStaffOrAccountOwner,]
    return super(cls, self).get_permissions()
