from rest_framework import serializers

# Takes the data from models.py to turn it into JSON readable data for frontend
from .models import Property

class PropertyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = (
            'id',
            'title',
            'price_per_night',
            'image_url'
        )