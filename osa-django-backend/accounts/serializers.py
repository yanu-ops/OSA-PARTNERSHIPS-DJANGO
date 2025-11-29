from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'role', 'department', 'is_active', 'is_approved', 'rejection_reason', 'created_at']
        read_only_fields = ['id', 'created_at', 'is_approved', 'rejection_reason']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'role', 'department']
    
    def validate(self, attrs):
        # Validate department is required for department role
        if attrs.get('role') == 'department' and not attrs.get('department'):
            raise serializers.ValidationError({
                'department': 'Department is required for department role'
            })
        
        # Clear department for non-department roles
        if attrs.get('role') != 'department':
            attrs['department'] = None
        
        return attrs
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

class ChangePasswordSerializer(serializers.Serializer):
    currentPassword = serializers.CharField(required=True, write_only=True)
    newPassword = serializers.CharField(
        required=True,
        write_only=True,
        validators=[validate_password]
    )