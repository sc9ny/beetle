import json

from rest_framework import permissions, status, viewsets, views
from rest_framework.response import Response

from django.contrib.auth import authenticate, login
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


class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny,]
    def post(self, request, format=None):
        if (request.user.id is None):
            data = json.loads(request.body)
            email = data.get('email', None)
            password = data.get('password', None)

            user = authenticate(email=email, password=password)

            if user is not None:
                login(request, user)

                serializer = AccountSerializer(user)

                return Response(serializer.data)

            else:
                return Response({
                    'message': 'Invalid email or password.'
                }, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'message': 'Already Authenticated'},
                        status =status.HTTP_400_BAD_REQUEST)