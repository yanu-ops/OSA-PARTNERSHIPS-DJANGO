from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q, Count
from .models import Partnership, AuditLog
from .serializers import PartnershipSerializer, PartnershipLimitedSerializer
from .permissions import IsAdminOrDepartment, IsAdminOrOwnDepartment
import json


# ============= PUBLIC PARTNERSHIPS (NO AUTH REQUIRED) =============
@api_view(['GET'])
@permission_classes([AllowAny])  # No authentication required
def get_public_partnerships(request):
    """Get all partnerships with limited info (public access)"""
    partnerships = Partnership.objects.all()
    
    # Apply filters
    department = request.query_params.get('department')
    school_year = request.query_params.get('school_year')
    search = request.query_params.get('search')
    
    if department:
        partnerships = partnerships.filter(department=department)
    
    if school_year:
        partnerships = partnerships.filter(school_year=school_year)
    
    if search:
        partnerships = partnerships.filter(
            Q(business_name__icontains=search) |
            Q(department__icontains=search)
        )
    
    # Always return limited serializer for public access
    serializer = PartnershipLimitedSerializer(
        partnerships,
        many=True,
        context={'request': request}
    )
    
    return Response({
        'success': True,
        'count': partnerships.count(),
        'data': serializer.data
    })


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def manage_partnerships(request):
    """
    GET: Get all partnerships with filters
    POST: Create new partnership (admin/department only)
    """
    if request.method == 'GET':
        partnerships = Partnership.objects.all()
        
        department = request.query_params.get('department')
        status_filter = request.query_params.get('status')
        school_year = request.query_params.get('school_year')
        search = request.query_params.get('search')
        
        if department:
            partnerships = partnerships.filter(department=department)
        
        if status_filter:
            partnerships = partnerships.filter(status=status_filter)
        
        if school_year:
            partnerships = partnerships.filter(school_year=school_year)
        
        if search:
            partnerships = partnerships.filter(
                Q(business_name__icontains=search) |
                Q(contact_person__icontains=search)
            )
        
        user = request.user

        serialized_data = []
        for partnership in partnerships:
            if user.role == 'viewer':
                serializer = PartnershipLimitedSerializer(
                    partnership,
                    context={'request': request}
                )
            elif user.role == 'department':
                if partnership.department == user.department:
                    serializer = PartnershipSerializer(
                        partnership,
                        context={'request': request}
                    )
                else:
                    serializer = PartnershipLimitedSerializer(
                        partnership,
                        context={'request': request}
                    )

            else:
                serializer = PartnershipSerializer(
                    partnership,
                    context={'request': request}
                )
            
            serialized_data.append(serializer.data)
        
        return Response({
            'success': True,
            'count': len(serialized_data),
            'data': serialized_data
        })
    
    elif request.method == 'POST':
        if request.user.role not in ['admin', 'department']:
            return Response({
                'success': False,
                'message': 'You do not have permission to create partnerships'
            }, status=status.HTTP_403_FORBIDDEN)
        
        print("Received data:", request.data)
        print("Content-Type:", request.content_type)
        
        serializer = PartnershipSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            partnership = serializer.save(created_by=request.user)
            
            AuditLog.objects.create(
                user=request.user,
                action='CREATE',
                table_name='partnerships',
                record_id=partnership.id,
                new_values=PartnershipSerializer(partnership, context={'request': request}).data
            )
            
            return Response({
                'success': True,
                'message': 'Partnership created successfully',
                'data': PartnershipSerializer(partnership, context={'request': request}).data
            }, status=status.HTTP_201_CREATED)
        
        print("Validation errors:", serializer.errors)
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def manage_partnership_detail(request, pk):
    """
    GET: Get single partnership
    PUT: Update partnership (admin/own department only)
    DELETE: Delete partnership (admin/own department only)
    """
    try:
        partnership = Partnership.objects.get(pk=pk)
    except Partnership.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Partnership not found'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        user = request.user
        
        if user.role == 'viewer':
            serializer = PartnershipLimitedSerializer(
                partnership,
                context={'request': request}
            )
        elif user.role == 'department':
            if partnership.department == user.department:
                serializer = PartnershipSerializer(
                    partnership,
                    context={'request': request}
                )
            else:
                serializer = PartnershipLimitedSerializer(
                    partnership,
                    context={'request': request}
                )
        else:
            serializer = PartnershipSerializer(
                partnership,
                context={'request': request}
            )
        
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    elif request.method == 'PUT':
        if request.user.role not in ['admin', 'department']:
            return Response({
                'success': False,
                'message': 'You do not have permission to update partnerships'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if request.user.role == 'department':
            if partnership.department != request.user.department:
                return Response({
                    'success': False,
                    'message': 'You can only update partnerships in your department'
                }, status=status.HTTP_403_FORBIDDEN)
        
        old_values = PartnershipSerializer(partnership, context={'request': request}).data
        
        serializer = PartnershipSerializer(
            partnership,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        
        if serializer.is_valid():
            partnership = serializer.save()
            
            AuditLog.objects.create(
                user=request.user,
                action='UPDATE',
                table_name='partnerships',
                record_id=partnership.id,
                old_values=old_values,
                new_values=PartnershipSerializer(partnership, context={'request': request}).data
            )
            
            return Response({
                'success': True,
                'message': 'Partnership updated successfully',
                'data': PartnershipSerializer(partnership, context={'request': request}).data
            })
        
        return Response({
            'success': False,
            'message': 'Validation failed',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':

        if request.user.role not in ['admin', 'department']:
            return Response({
                'success': False,
                'message': 'You do not have permission to delete partnerships'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if request.user.role == 'department':
            if partnership.department != request.user.department:
                return Response({
                    'success': False,
                    'message': 'You can only delete partnerships in your department'
                }, status=status.HTTP_403_FORBIDDEN)
        
        old_values = PartnershipSerializer(partnership, context={'request': request}).data
        
        AuditLog.objects.create(
            user=request.user,
            action='DELETE',
            table_name='partnerships',
            record_id=partnership.id,
            old_values=old_values
        )
        
        partnership.delete()
        
        return Response({
            'success': True,
            'message': 'Partnership deleted successfully'
        })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_statistics(request):
    """Get partnership statistics"""
    user = request.user
    partnerships = Partnership.objects.all()
    
    if user.role == 'department':
        partnerships = partnerships.filter(department=user.department)

    stats = {
        'total': partnerships.count(),
        'active': partnerships.filter(status='active').count(),
        'terminated': partnerships.filter(status='terminated').count(),
        'for_renewal': partnerships.filter(status='for_renewal').count(),
        'non_renewal': partnerships.filter(status='non_renewal').count(),
        'by_department': {}
    }

    dept_counts = partnerships.values('department').annotate(count=Count('id'))
    for item in dept_counts:
        stats['by_department'][item['department']] = item['count']
    
    return Response({
        'success': True,
        'data': stats
    })