from rest_framework import serializers # type: ignore
from .models import Feedback
from django.contrib.auth import get_user_model # type: ignore
from rest_framework import serializers # type: ignore

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id','username', 'email', 'password', 'role','is_active']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all(), default=serializers.CurrentUserDefault())

    class Meta:
        model = Feedback
        fields = '__all__'