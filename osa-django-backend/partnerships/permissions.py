from rest_framework import permissions

class IsAdminOrDepartment(permissions.BasePermission):
    """
    Permission for admin and department users
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and \
               request.user.role in ['admin', 'department']

class IsAdminOrOwnDepartment(permissions.BasePermission):
    """
    Permission for admin or own department
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and \
               request.user.role in ['admin', 'department']
    
    def has_object_permission(self, request, view, obj):
        # Admin has full access
        if request.user.role == 'admin':
            return True
        
        # Department users can only access their own department
        if request.user.role == 'department':
            return obj.department == request.user.department
        
        return False