from django.urls import path
from . import views

app_name = 'partnerships'

urlpatterns = [
    path('public', views.get_public_partnerships, name='public'),

    path('statistics', views.get_statistics, name='statistics'),
    
    path('', views.manage_partnerships, name='partnerships'), 
    
    path('<int:pk>/', views.manage_partnership_detail, name='partnership-detail'), 
]   