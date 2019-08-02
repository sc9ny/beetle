from rest_framework import permissions, viewsets, filters

from utils import HeaderPagination, IsStaffOrAccountOwner

from .models import Question, Answer
from .serializer import QuestionSerializer, AnswerSerializer, CreateAnswerSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by('-id')
    serializer_class = QuestionSerializer
    pagination_class = HeaderPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'content', 'author__username']

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            self.permission_classes = [permissions.AllowAny,]
        elif self.request.method == 'POST':
            self.permission_classes = [permissions.IsAuthenticated,]
        else:
            self.permission_classes = [IsStaffOrAccountOwner,]
        return super(QuestionViewSet, self).get_permissions()


class AnswerViewSet(viewsets.ModelViewSet):
    serializer_class = AnswerSerializer
    queryset = Answer.objects.all()
    pagination_class = HeaderPagination

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            self.permission_classes = [permissions.AllowAny,]
        elif self.request.method == 'POST':
            self.permission_classes = [permissions.IsAuthenticated,]
        else:
            self.permission_classes = [IsStaffOrAccountOwner,]
        return super(AnswerViewSet, self).get_permissions()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateAnswerSerializer
        else:
            return AnswerSerializer

