from django.urls import path
from . import views

app_name = 'admin_panel'

urlpatterns = [
    path('users/pending/', views.get_pending_users, name='pending-users'),
    
    path('users/<int:pk>/approve/', views.approve_user, name='approve-user'),
    path('users/<int:pk>/reject/', views.reject_user, name='reject-user'),
    path('users/<int:pk>/change-password/', views.change_user_password, name='change-user-password'),

    path('users/', views.manage_users, name='users'),  
    path('users/<int:pk>/', views.manage_user_detail, name='user-detail'),  
    
    path('audit-logs/', views.get_audit_logs, name='audit-logs'),
    path('dashboard-stats/', views.get_dashboard_stats, name='dashboard-stats'),
]