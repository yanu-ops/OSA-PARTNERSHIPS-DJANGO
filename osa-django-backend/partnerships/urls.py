from django.urls import path
from . import views

app_name = 'partnerships'

urlpatterns = [
    # Statistics endpoint - MUST come before <int:pk>
    path('statistics', views.get_statistics, name='statistics'),
    
    # List and Create - same URL, different methods
    path('', views.manage_partnerships, name='partnerships'),  # GET and POST
    
    # Detail, Update, Delete - same URL, different methods
    path('<int:pk>/', views.manage_partnership_detail, name='partnership-detail'),  # GET, PUT, DELETE
]   