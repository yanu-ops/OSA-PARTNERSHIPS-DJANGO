from rest_framework.views import exception_handler
from rest_framework.response import Response

def custom_exception_handler(exc, context):
    """
    Custom exception handler to return consistent error responses
    """
    response = exception_handler(exc, context)
    
    if response is not None:
        custom_response = {
            'success': False,
            'message': str(exc),
        }
        
        if isinstance(response.data, dict):
            custom_response['errors'] = response.data
        
        response.data = custom_response
    
    return response