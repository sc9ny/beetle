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
        print('hello')
        if 'password' in attrs and 'confirm_password' not in attrs:
            raise serializers.ValidationError('Please re-confirm Password')

        elif 'password' in attrs and 'confirm_password' in attrs:
            if attrs['password'] != attrs['confirm_password']:
                print('yo')
                raise serializers.ValidationError('Password not matched')

        return attrs

    def create(self, validated_data):
        return Account.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.set_password(validated_data.get('password', None))
        instance.save()
        update_session_auth_hash(self.context.get('request'), instance)
        return instance
