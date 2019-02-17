from rest_framework import permissions, viewsets, status
from rest_framework.response import Response

from utils import HeaderPagination, IsStaffOrAccountOwner

from .serializer import AccountSerializer
from .models import Account

class AccountViewSet(viewsets.ModelViewSet):
    lookup_field = 'username'
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    pagination_class = HeaderPagination

    def get_permissions(self):
        if (self.request.method in permissions.SAFE_METHODS or
            self.request.method == 'POST'):
            self.permission_classes = [permissions.AllowAny,]
        self.permission_classes = [IsStaffOrAccountOwner,]

        return super(AccountViewSet, self).get_permissions()

    def create(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            Account.objects.create_user(**serializer.validated_data)

            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return super(AccountViewSet, self).create(request)

        # return Response({
        #     'status': 'Bad request',
        #     'message': 'Account could not be created with received data.'
        # }, status=status.HTTP_400_BAD_REQUEST)