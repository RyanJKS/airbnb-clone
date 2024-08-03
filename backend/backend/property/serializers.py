from rest_framework import serializers

# Takes the data from models.py to turn it into JSON readable data for frontend
from .models import Property, PropertyImage, Reservation
from useraccount.serializers import UserDetailSerializer

# List property for home page with 1 image
class PropertyListSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = ['id', 'title', 'price_per_night', 'image_url']

    def get_image_url(self, obj):
        return obj.image_urls()[0] if obj.image_urls() else None
        
# Create a new property
class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['image_url']
        
    def get_image_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

class PropertySerializer(serializers.ModelSerializer):
    host = UserDetailSerializer(read_only=True,many=False)
    images = PropertyImageSerializer(read_only=True, many=True)
    image_files = serializers.ListField(
        child=serializers.ImageField(write_only=True), write_only=True
    )

    class Meta:
        model = Property
        fields = ['id', 'title', 'description', 'price_per_night', 'bedrooms', 'bathrooms', 'guests', 'country', 'country_code', 'category', 'created_at', 'host', 'images', 'image_files']

    def create(self, validated_data):
        image_files = validated_data.pop('image_files')
        property_instance = Property.objects.create(**validated_data)
        for image_file in image_files:
            try:
                PropertyImage.objects.create(property=property_instance, image=image_file)
            except Exception as e:
                print(f"Error saving image: {e}")
                raise serializers.ValidationError(f"Error saving image: {e}")
        return property_instance
    
# List details about specific property
class PropertiesDetailSerializer(serializers.ModelSerializer):
    host = UserDetailSerializer(read_only=True, many=False)
    images = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = (
            'id',
            'title',
            'description',
            'price_per_night',
            'bedrooms',
            'bathrooms',
            'guests',
            'host',
            'images'
        )
    
    def get_images(self, obj):
        request = self.context.get('request')
        images = obj.images.all()
        return [request.build_absolute_uri(image.image.url) for image in images] if request else [image.image.url for image in images]

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['start_date', 'end_date', 'number_of_nights', 'total_price', 'guests']

    def validate(self, data):
        # Add custom validation if necessary
        return data
    

class ReservationListSerializer(serializers.ModelSerializer):
    property = PropertyListSerializer(read_only=True, many=False)
    class Meta:
        model = Reservation
        fields = ['id', 'start_date', 'end_date', 'number_of_nights', 'total_price', 'property']