# Uses the serializer to make the data available to front end
from rest_framework.decorators import api_view, authentication_classes, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import Property
from .serializers import PropertyListSerializer
from django.http import JsonResponse

from .serializers import PropertySerializer, PropertyListSerializer
from .models import PropertyImage

import os

@api_view(['GET'])
@authentication_classes([]) # Ability added in settings.py for rest_framework section
@permission_classes([]) # Ability added in settings.py for rest_Framework section
def properties_list(request):
    properties = Property.objects.all() # get all property models from db
    serializer = PropertyListSerializer(properties, many=True)
    
    return JsonResponse({'data': serializer.data})


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def create_property(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
    
    serializer = PropertySerializer(data=request.data)
    if serializer.is_valid():
        property_instance = serializer.save(host=request.user)

        # Handle multiple images
        files = request.FILES.getlist('image_files')
        for file in files:
            try:
                PropertyImage.objects.create(property=property_instance, image=file)
            except Exception as e:
                print(f"Error saving image file {file.name}: {e}")
                # Check if the file exists
                try:
                    temp_path = file.temporary_file_path()
                except AttributeError:
                    temp_path = None
                if temp_path and not os.path.exists(temp_path):
                    print(f"File {file.name} does not exist at {temp_path}")
                return JsonResponse({"detail": f"Error saving image file {file.name}: {e}"}, status=status.HTTP_400_BAD_REQUEST)

        return JsonResponse({'success': True}, status=status.HTTP_201_CREATED)
    else:
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)