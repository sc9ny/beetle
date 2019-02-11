from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from .serializer import AccountSerializer
from .permission import IsAccountOwner
from .models import Account

class AccountViewSet(viewsets.ModelViewSet):
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_permissions(self):
        if (self.request.method in permissions.SAFE_METHODS or
            self.request.method == 'POST'):
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAccountOwner())

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            Account.objects.create_user(**serializer.validated_data)

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response({
            'status': 'Bad request',
            'message': 'Account could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)