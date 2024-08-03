from dj_rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers

from .models import User

class CustomRegisterSerializer(RegisterSerializer):
    name = serializers.CharField(max_length=255)

    class Meta:
        model = User
        fields = ('email', 'name', 'password1', 'password2')
    
    def save(self, request):
        user = super().save(request)
        user.name = self.data.get('name')
        user.save()
        return user

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'name', 'profile_img_url'
        )