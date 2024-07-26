# Uses the serializer to make the data available to front end
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from .models import Property
from .serializers import PropertyListSerializer
from django.http import JsonResponse

@api_view(['GET'])
@authentication_classes([]) # Ability added in settings.py for rest_framework section
@permission_classes([]) # Ability added in settings.py for rest_Framework section
def properties_list(request):
    properties = Property.objects.all() # get all property models from db
    serializer = PropertyListSerializer(properties, many=True)
    
    return JsonResponse({'data': serializer.data})