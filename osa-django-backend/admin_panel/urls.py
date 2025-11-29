from django.urls import path
from . import views

app_name = 'admin_panel'

urlpatterns = [
    # Pending users endpoints - MUST come before 'users/<int:pk>'
    path('users/pending', views.get_pending_users, name='pending-users'),
    
    # Approve/Reject endpoints - MUST come before 'users/<int:pk>'
    path('users/<int:pk>/approve', views.approve_user, name='approve-user'),
    path('users/<int:pk>/reject', views.reject_user, name='reject-user'),
    
    # User CRUD endpoints
    path('users', views.manage_users, name='users'),  # Handles GET and POST
    path('users/<int:pk>', views.manage_user_detail, name='user-detail'),  # Handles PUT and DELETE
    
    # Other endpoints
    path('audit-logs', views.get_audit_logs, name='audit-logs'),
    path('dashboard-stats', views.get_dashboard_stats, name='dashboard-stats'),
]