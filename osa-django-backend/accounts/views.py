from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from .models import User
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer, ChangePasswordSerializer
)
from .authentication import JWTAuthentication

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user (pending approval)"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.is_approved = False 
        user.save()
        
        return Response({
            'success': True,
            'message': 'Registration submitted successfully. Please wait for admin approval.',
            'data': {
                'user': UserSerializer(user).data,
                'status': 'pending'
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'message': 'Registration failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login user (only if approved)"""
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Invalid credentials'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    
    try:
        user = User.objects.get(email=email, is_active=True)
        

        if not user.check_password(password):
            raise User.DoesNotExist
        
        if not user.is_approved:
            return Response({
                'success': False,
                'message': 'Your account is pending approval. Please wait for admin to approve your registration.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        token = JWTAuthentication.generate_token(user)
        
        return Response({
            'success': True,
            'message': 'Login successful',
            'data': {
                'user': UserSerializer(user).data,
                'token': token
            }
        })
    
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Invalid email or password'
        }, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    """Get user profile"""
    serializer = UserSerializer(request.user)
    return Response({
        'success': True,
        'data': serializer.data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change user password"""
    serializer = ChangePasswordSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = request.user
    
    if not user.check_password(serializer.validated_data['currentPassword']):
        return Response({
            'success': False,
            'message': 'Current password is incorrect'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(serializer.validated_data['newPassword'])
    user.save()
    
    return Response({
        'success': True,
        'message': 'Password changed successfully'
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def check_email(request):
    """Check if email exists"""
    email = request.data.get('email')
    if not email:
        return Response({
            'success': False,
            'message': 'Email is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    exists = User.objects.filter(email=email).exists()
    
    return Response({
        'success': True,
        'exists': exists
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def check_email_status(request):
    """Check email approval status for login page"""
    email = request.data.get('email')
    if not email:
        return Response({
            'success': False,
            'message': 'Email is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(email=email)
        
        if user.is_approved:
            user_status = 'approved'
        elif user.rejection_reason:
            user_status = 'rejected'
        else:
            user_status = 'pending'
        
        return Response({
            'success': True,
            'status': user_status,
            'message': f'Account is {user_status}'
        })
    
    except User.DoesNotExist:
        return Response({
            'success': True,
            'status': 'not_found',
            'message': 'Email not registered'
        })