import jwt
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed
from .models import User

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return None
        
        try:
            # Extract token from "Bearer <token>"
            prefix, token = auth_header.split(' ')
            if prefix.lower() != 'bearer':
                return None
            
            # Decode token
            payload = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM]
            )
            
            # Get user - must be active AND approved
            user = User.objects.get(
                id=payload['userId'], 
                is_active=True,
                is_approved=True  # Must be approved
            )
            
            return (user, token)
            
        except (ValueError, jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            raise AuthenticationFailed('Invalid or expired token')
    
    @staticmethod
    def generate_token(user):
        """Generate JWT token for user"""
        payload = {
            'userId': user.id,
            'email': user.email,
            'exp': datetime.utcnow() + timedelta(days=settings.JWT_EXPIRATION_DAYS),
            'iat': datetime.utcnow()
        }
        
        token = jwt.encode(
            payload,
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM
        )
        
        return token