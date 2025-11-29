from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from datetime import datetime, timedelta
from accounts.models import User
from accounts.serializers import UserSerializer, RegisterSerializer
from partnerships.models import Partnership, AuditLog
from partnerships.serializers import AuditLogSerializer
from .permissions import IsAdmin

# ============= USER MANAGEMENT (GET ALL & CREATE) =============
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def manage_users(request):
    """
    GET: Get all approved users
    POST: Create new user
    """
    if request.method == 'GET':
        users = User.objects.filter(is_approved=True).order_by('-created_at')
        serializer = UserSerializer(users, many=True)
        return Response({
            'success': True,
            'count': users.count(),
            'data': serializer.data
        })
    
    elif request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            # Admin-created users are auto-approved
            user.is_approved = True
            user.save()
            
            return Response({
                'success': True,
                'message': 'User created successfully',
                'data': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

# ============= USER DETAIL (UPDATE & DELETE) =============
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated, IsAdmin])
def manage_user_detail(request, pk):
    """
    PUT: Update user
    DELETE: Delete user
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        # Prevent updating password through this endpoint
        data = request.data.copy()
        data.pop('password', None)
        
        serializer = UserSerializer(user, data=data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            return Response({
                'success': True,
                'message': 'User updated successfully',
                'data': serializer.data
            })
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        # Prevent deleting own account
        if user.id == request.user.id:
            return Response({
                'success': False,
                'message': 'Cannot delete your own account'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        user.delete()
        
        return Response({
            'success': True,
            'message': 'User deleted successfully'
        })

# ============= CHANGE USER PASSWORD (ADMIN) =============
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def change_user_password(request, pk):
    """Admin changes user password"""
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    new_password = request.data.get('newPassword')
    
    if not new_password:
        return Response({
            'success': False,
            'message': 'New password is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate password strength
    if len(new_password) < 8:
        return Response({
            'success': False,
            'message': 'Password must be at least 8 characters'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Set new password
    user.set_password(new_password)
    user.save()
    
    return Response({
        'success': True,
        'message': 'Password changed successfully'
    })

# ============= PENDING USERS =============
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def get_pending_users(request):
    """Get all pending users (waiting for approval)"""
    pending_users = User.objects.filter(is_approved=False, is_active=True).order_by('-created_at')
    serializer = UserSerializer(pending_users, many=True)
    
    return Response({
        'success': True,
        'count': pending_users.count(),
        'data': serializer.data
    })

# ============= APPROVE USER =============
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def approve_user(request, pk):
    """Approve a pending user"""
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if user.is_approved:
        return Response({
            'success': False,
            'message': 'User is already approved'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user.is_approved = True
    user.rejection_reason = None
    user.save()
    
    return Response({
        'success': True,
        'message': 'User approved successfully',
        'data': UserSerializer(user).data
    })

# ============= REJECT USER =============
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def reject_user(request, pk):
    """Reject a pending user"""
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if user.is_approved:
        return Response({
            'success': False,
            'message': 'Cannot reject an approved user'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    rejection_reason = request.data.get('reason', '')
    user.rejection_reason = rejection_reason
    user.is_active = False  # Deactivate rejected users
    user.save()
    
    return Response({
        'success': True,
        'message': 'User rejected successfully'
    })

# ============= AUDIT LOGS =============
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def get_audit_logs(request):
    """Get audit logs"""
    logs = AuditLog.objects.all().select_related('user')[:100]
    serializer = AuditLogSerializer(logs, many=True)
    
    return Response({
        'success': True,
        'count': logs.count(),
        'data': serializer.data
    })

# ============= DASHBOARD STATS =============
@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def get_dashboard_stats(request):
    """Get dashboard statistics"""
    # Partnership stats
    partnerships = Partnership.objects.all()
    now = datetime.now()
    expiring_soon = partnerships.filter(
        expiration_date__lte=now + timedelta(days=30),
        expiration_date__gte=now
    ).count()
    
    partnership_stats = {
        'total': partnerships.count(),
        'active': partnerships.filter(status='active').count(),
        'for_renewal': partnerships.filter(status='for_renewal').count(),
        'terminated': partnerships.filter(status='terminated').count(),
        'expiring_soon': expiring_soon
    }
    
    # User stats (only approved users)
    users = User.objects.filter(is_approved=True)
    user_stats = {
        'total': users.count(),
        'active': users.filter(is_active=True).count(),
        'admin': users.filter(role='admin').count(),
        'department': users.filter(role='department').count(),
        'viewer': users.filter(role='viewer').count()
    }
    
    # Department breakdown
    dept_counts = partnerships.values('department').annotate(count=Count('id'))
    by_department = {item['department']: item['count'] for item in dept_counts}
    
    return Response({
        'success': True,
        'data': {
            'partnerships': partnership_stats,
            'users': user_stats,
            'by_department': by_department
        }
    })