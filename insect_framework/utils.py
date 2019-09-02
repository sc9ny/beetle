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
        if request.user and hasattr(obj, 'author'):
            return request.user.is_staff or str(obj.author) == str(request.user)
        return False


class isParticipant(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user and hasattr(obj, 'involved_users'):
            return request.user.is_staff or str(request.user.username) in [user.username for user in obj.involved_users.all()]
        return False


def get_permissions(self, cls):
    if self.request.method in permissions.SAFE_METHODS:
        self.permission_classes = [permissions.AllowAny,]
    elif self.request.method == 'POST':
        self.permission_classes = [permissions.IsAuthenticated,]
    else:
        self.permission_classes = [IsStaffOrAccountOwner,]
    return super(cls, self).get_permissions()


def get_involved_users_from_post(instance):
    users = [instance.author]
    duplicate = {}
    if hasattr(instance, 'comments'):
        for comment in instance.comments.all():
            if comment.author.username in duplicate:
                continue
            else:
                users.append(comment.author)
                duplicate[comment.author.username] = True
    else:
        for answer in instance.answers.all():
            if answer.author.username in duplicate:
                continue
            else:
                users.append(answer.author)
                duplicate[answer.author.username] = True
    return users


def get_involved_users_from_comments(instance):
    users = []
    duplicate = {}
    if hasattr(instance, 'gallery_post'):
        users.append(instance.gallery_post.author)
        duplicate[instance.gallery_post.author.username] = True
        for comment in instance.gallery_post.comments.all():
            if comment.author.username in duplicate:
                continue
            else:
                users.append(comment.author)
                duplicate[comment.author.username] = True

    if hasattr(instance, 'associated_post'):
        users.append(instance.associated_post.author)
        duplicate[instance.associated_post.author.username] = True
        for comment in instance.associated_post.comments.all():
            if comment.author.username in duplicate:
                continue
            else:
                users.append(comment.author)
                duplicate[comment.author.username] = True

    if hasattr(instance, 'associated_sale'):
        users.append(instance.associated_sale.author)
        duplicate[instance.associated_sale.author.username] = True
        for comment in instance.associated_sale.comments.all():
            if comment.author.username in duplicate:
                continue
            else:
                users.append(comment.author)
                duplicate[comment.author.username] = True

    if hasattr(instance, 'associated_question'):
        users.append(instance.associated_question.author)
        duplicate[instance.associated_question.author.username] = True
        for answer in instance.associated_question.answers.all():
            if answer.author.username in duplicate:
                continue
            else:
                users.append(answer.author)
                duplicate[answer.author.username] = True
    return users
