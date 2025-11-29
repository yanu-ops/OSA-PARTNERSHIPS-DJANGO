from django.db import models
from django.conf import settings
from django.core.validators import EmailValidator
import os

def partnership_image_path(instance, filename):
    """Generate upload path for partnership images"""
    ext = filename.split('.')[-1]
    filename = f"{instance.business_name.replace(' ', '_')}_{instance.id}.{ext}"
    return os.path.join('partnership_images', filename)

class Partnership(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('terminated', 'Terminated'),
        ('for_renewal', 'For Renewal'),
        ('non_renewal', 'Non-Renewal'),
    ]
    
    DEPARTMENT_CHOICES = [
        ('STE', 'School of Teacher Education'),
        ('CET', 'College of Engineering and Technology'),
        ('CCJE', 'College of Criminal Justice Education'),
        ('HuSoCom', 'Humanities, Social Sciences and Communication'),
        ('BSMT', 'Bachelor of Science in Marine Transportation'),
        ('SBME', 'School of Business and Management Education'),
        ('CHATME', 'College of Hospitality and Tourism Management Education'),
    ]

    business_name = models.CharField(max_length=255)
    department = models.CharField(max_length=50, choices=DEPARTMENT_CHOICES)
    address = models.TextField()

    contact_person = models.CharField(max_length=255)
    manager_supervisor_1 = models.CharField(max_length=255)
    manager_supervisor_2 = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(validators=[EmailValidator()])
    contact_number = models.CharField(max_length=50)

    date_established = models.DateField()
    expiration_date = models.DateField()
    school_year = models.CharField(max_length=20)  
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')

    remarks = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to=partnership_image_path, blank=True, null=True)

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_partnerships'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'partnerships'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['department']),
            models.Index(fields=['status']),
            models.Index(fields=['school_year']),
        ]
    
    def __str__(self):
        return f"{self.business_name} - {self.department}"
    
    def save(self, *args, **kwargs):
        if not self.school_year:
            year = self.date_established.year
            month = self.date_established.month
            if month >= 8:  
                self.school_year = f"{year}-{year + 1}"
            else:
                self.school_year = f"{year - 1}-{year}"
        super().save(*args, **kwargs)
    
    @property
    def image_url(self):
        """Return full URL for the image"""
        if self.image:
            return self.image.url
        return None


class AuditLog(models.Model):
    ACTION_CHOICES = [
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='audit_logs'
    )
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    table_name = models.CharField(max_length=100)
    record_id = models.IntegerField()
    old_values = models.JSONField(null=True, blank=True)
    new_values = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'audit_logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email if self.user else 'Unknown'} - {self.action} - {self.table_name}"