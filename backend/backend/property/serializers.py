from rest_framework import serializers

# Takes the data from models.py to turn it into JSON readable data for frontend
from .models import Property, PropertyImage

class PropertyListSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = ['id', 'title', 'price_per_night', 'image_url']

    def get_image_url(self, obj):
        return obj.image_urls()[0] if obj.image_urls() else None
        
class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['image']

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    image_files = serializers.ListField(
        child=serializers.ImageField(write_only=True), write_only=True
    )

    class Meta:
        model = Property
        fields = ['id', 'title', 'description', 'price_per_night', 'bedrooms', 'bathrooms', 'guests', 'country', 'country_code', 'category', 'created_at', 'images', 'image_files']

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