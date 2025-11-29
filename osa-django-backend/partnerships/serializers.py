from rest_framework import serializers
from .models import Partnership, AuditLog

class PartnershipSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    # Make image field not required and allow null
    image = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = Partnership
        fields = [
            'id', 'business_name', 'department', 'address',
            'contact_person', 'manager_supervisor_1', 'manager_supervisor_2',
            'email', 'contact_number', 'date_established', 'expiration_date',
            'school_year', 'status', 'remarks', 'image', 'image_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'image_url']
        
        # Make some fields optional
        extra_kwargs = {
            'manager_supervisor_2': {'required': False, 'allow_blank': True, 'allow_null': True},
            'remarks': {'required': False, 'allow_blank': True, 'allow_null': True},
            'school_year': {'required': False, 'allow_blank': True},
        }
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None
    
    def validate(self, attrs):
        # Validate expiration date is after establishment date
        date_established = attrs.get('date_established')
        expiration_date = attrs.get('expiration_date')
        
        # For updates, get existing values if not provided
        if self.instance:
            if not date_established:
                date_established = self.instance.date_established
            if not expiration_date:
                expiration_date = self.instance.expiration_date
        
        if date_established and expiration_date:
            if expiration_date <= date_established:
                raise serializers.ValidationError({
                    'expiration_date': 'Expiration date must be after establishment date'
                })
        
        return attrs

class PartnershipLimitedSerializer(serializers.ModelSerializer):
    """Limited serializer for viewers and other departments"""
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Partnership
        fields = [
            'id', 'business_name', 'department', 'date_established',
            'expiration_date', 'school_year', 'status', 'image_url'
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return None

class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = AuditLog
        fields = [
            'id', 'user', 'user_email', 'user_name', 'action',
            'table_name', 'record_id', 'old_values', 'new_values', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']