from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    path('register', views.register, name='register'),
    path('login', views.login, name='login'),
    path('profile', views.get_profile, name='profile'),
    path('change-password', views.change_password, name='change-password'),
    path('check-email', views.check_email, name='check-email'),
    path('check-email-status', views.check_email_status, name='check-email-status'),
]