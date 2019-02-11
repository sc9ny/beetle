from rest_framework import serializers

from django.contrib.auth import update_session_auth_hash
from .models import Account

class AccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required=False, write_only=True)
    confirm_password = serializers.CharField(required=False, write_only=True)


    class Meta:
        model = Account
        fields = ('id', 'email', 'username', 'password', 'confirm_password', 'first_name',
                  'last_name', 'tagline' , 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

    def validate(self, attrs):
        if 'password' in attrs and 'confirm_password' not in attrs:
            raise serializers.ValidationError('Please re-confirm Password')

        elif 'password' in attrs and 'confirm_password' in attrs:
            if attrs['password'] != attrs['confirm_password']:
                raise serializers.ValidationError('Password not matched')

        return attrs

    def create(self, validated_data):
        return Account.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.set_password(validated_data.get('password', None))
        instance.save()
        update_session_auth_hash(self.context.get('request'), instance)
        return instance


# class UserSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True, required=False)
#     confirm_password = serializers.CharField(write_only=True, required=False)
#     email = serializers.EmailField(required=False)
#     class Meta:
#         model = User
#         fields = ('username','password','confirm_password','email','id',
#                   'date_joined', 'last_login')
#         read_only_fields = ('date_joined', 'last_login', 'username')
#
#     def validate_password(self, value):
#         #this is creation so password is required
#         if self.instance is None and value is None:
#             raise serializers.ValidationError('Password is required')
#         return value
#
#
# class UserCreationSerializer(UserSerializer):
#     username = serializers.CharField(required=True)
#     password = serializers.CharField(write_only=True, required=True)
#     confirm_password = serializers.CharField(write_only=True, required=True)
#     email = serializers.EmailField(required=True)
#     class Meta:
#         model = User
#         fields = UserSerializer.Meta.fields
#         read_only_fields = ('date_joined', 'last_login')