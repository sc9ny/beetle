from rest_framework import viewsets
from ..models import Post
from ..serializers.post import PostSerializer

from rest_framework.response import Response
from rest_framework import pagination

# TODO: This needs more work.
# class SomePagination(pagination.PageNumberPagination):
#
#     def get_paginated_response(self, data):
#         return Response({
#             'links': {
#                'next': self.get_next_link(),
#                'previous': self.get_previous_link()
#             },
#             'count': self.page.paginator.count,
#             'total_pages': self.page.paginator.num_pages,
#             'results': data
#         })

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    paginator = None
    #pagination_class = SomePagination