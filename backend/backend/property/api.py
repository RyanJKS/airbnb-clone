# Uses the serializer to make the data available to front end
from rest_framework.decorators import api_view, authentication_classes, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import Property
from .serializers import PropertyListSerializer
from django.http import JsonResponse
from django.db import transaction
from django.shortcuts import get_object_or_404

from .serializers import PropertySerializer, PropertyListSerializer, PropertiesDetailSerializer, ReservationSerializer, ReservationListSerializer
from .models import PropertyImage, Reservation
from .authentication import get_authenticated_user
from .filters import filter_properties, get_user_favourites

import os


# Get all properties depending on filters and user authentication
@api_view(['GET'])
@authentication_classes([])  # Global settings for authentication
@permission_classes([])  # Global settings for permissions
def properties_list(request):
    properties = Property.objects.all()
    user = get_authenticated_user(request) # Get authentication even if the endpoint if open
    favourites = get_user_favourites(user, properties) if user else []

    properties = filter_properties(properties, request)
    if request.GET.get('is_favourites') and user:
        properties = properties.filter(favourited__in=[user])

    serializer = PropertyListSerializer(properties, many=True)
    return JsonResponse({'data': serializer.data, 'favourites': favourites}, status=status.HTTP_200_OK)


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

# Tag property as favorite
@api_view(['POST'])
def toggle_favourite(request, pk):    
    property_obj = get_object_or_404(Property, pk=pk)
    
    if request.user in property_obj.favourited.all():
        property_obj.favourited.remove(request.user)
        return JsonResponse({'is_favourite': False}, status=status.HTTP_200_OK)
    else:
        property_obj.favourited.add(request.user)
        return JsonResponse({'is_favourite': True}, status=status.HTTP_200_OK)
    