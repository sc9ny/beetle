from rest_framework import serializers

from .models import Sale, SaleComment


class SaleCommentSerializer(serializers.ModelSerializer):
    associated_sale = serializers.PrimaryKeyRelatedField(read_only=True)
    author = serializers.SlugRelatedField(read_only=True, slug_field='username')

    class Meta:
        model = SaleComment
        fields = ('id', 'content', 'created', 'updated', 'author', 'associated_sale')
        read_only_fields = ('created', 'updated', 'author', 'associated_sale')


class CreateSaleCommentSerializer(SaleCommentSerializer):
    associated_sale = serializers.PrimaryKeyRelatedField(queryset=Sale.objects.all())

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super(SaleCommentSerializer, self).create(validated_data)


class SaleSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(read_only=True, slug_field='username')
    comments = SaleCommentSerializer(many=True, read_only=True)

    class Meta:
        model = Sale
        fields = ('id','title', 'content', 'created', 'updated','author','comments')
        read_only_fields = ('created','updated','author','comments',)

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super(SaleSerializer, self).create(validated_data)


