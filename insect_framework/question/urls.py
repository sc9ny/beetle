from insect_framework.urls import v1_router
from .viewsets import QuestionViewSet, AnswerViewSet

v1_router.register(r'question', QuestionViewSet)
v1_router.register(r'answer', AnswerViewSet)

urlpatterns = []
