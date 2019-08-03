from rest_framework import serializers

from .models import Question, Answer


class AnswerSerializer(serializers.ModelSerializer):
    associated_question = serializers.PrimaryKeyRelatedField(read_only=True)
    author = serializers.SlugRelatedField(read_only=True, slug_field='username')

    class Meta:
        model = Answer
        fields = ('id', 'content', 'created', 'updated', 'author', 'associated_question')
        read_only_fields = ('created', 'updated', 'author', 'associated_question')


class CreateAnswerSerializer(AnswerSerializer):
    associated_question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all())

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super(AnswerSerializer, self).create(validated_data)


class QuestionSerializer(serializers.ModelSerializer):
    author = serializers.SlugRelatedField(read_only=True, slug_field='username')
    comments = AnswerSerializer(many=True, read_only=True, source='answer')

    class Meta:
        model = Question
        fields = ('id','title', 'content', 'created', 'updated','author','comments')
        read_only_fields = ('created','updated','author','comments',)

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super(QuestionSerializer, self).create(validated_data)


