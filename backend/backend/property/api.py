# Uses the serializer to make the data available to front end
from rest_framework.decorators import api_view, authentication_classes, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import Property
from .serializers import PropertyListSerializer
from django.http import JsonResponse
from django.db import transaction

from .serializers import PropertySerializer, PropertyListSerializer, PropertiesDetailSerializer, ReservationSerializer, ReservationListSerializer
from .models import PropertyImage, Reservation

import os


# Get all property for home page
@api_view(['GET'])
@authentication_classes([]) # Ability added in settings.py for rest_framework section
@permission_classes([]) # Ability added in settings.py for rest_Framework section
def properties_list(request):
    properties = Property.objects.all() # get all property models from db
    serializer = PropertyListSerializer(properties, many=True)
    
    return JsonResponse({'data': serializer.data})

# Create new property
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
                # Save the image to the PropertyImage model
                PropertyImage.objects.create(property=property_instance, image=file)
            except Exception as e:
                print(f"Error saving image file {file.name}: {e}")
                
                # Check for temporary file path and log if file doesn't exist
                try:
                    temp_path = file.temporary_file_path()
                    if not os.path.exists(temp_path):
                        print(f"File {file.name} does not exist at {temp_path}")
                except AttributeError:
                    # Handle in-memory files
                    print(f"InMemoryUploadedFile detected for {file.name}")
                
                return JsonResponse({"detail": f"Error saving image file {file.name}: {e}"}, status=status.HTTP_400_BAD_REQUEST)

        return JsonResponse({'success': True}, status=status.HTTP_201_CREATED)
    else:
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# Get detail for a property
@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def property_detail(request, pk):
    try:
        property_instance = Property.objects.get(pk=pk) # pk received from url params (id for property)
    except Property.DoesNotExist:
        return JsonResponse({'error': 'Property not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PropertiesDetailSerializer(property_instance, context={'request': request})
    return JsonResponse(serializer.data, status=status.HTTP_200_OK)


# Create reservation for a property
@api_view(['POST'])
def create_reservation(request, pk):
    try:
        property = Property.objects.get(pk=pk)
    except Property.DoesNotExist:
        return JsonResponse({'error': 'Property not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ReservationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            with transaction.atomic():
                Reservation.objects.create(
                    property=property,
                    start_date=serializer.validated_data['start_date'],
                    end_date=serializer.validated_data['end_date'],
                    number_of_nights=serializer.validated_data['number_of_nights'],
                    total_price=serializer.validated_data['total_price'],
                    guests=serializer.validated_data['guests'],
                    created_by=request.user
                )
            return JsonResponse({'success': True}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
# Get reservations for a property
@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def property_reservations(request, pk):
    try:
        property = Property.objects.get(pk=pk)
        reservations = property.reservations.all()
    except Property.DoesNotExist:
        return JsonResponse({'error': 'Property not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ReservationListSerializer(reservations, many=True)
    return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)