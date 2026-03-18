# products/serializers.py
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            # ... your existing fields
            "care_cleaning",
            "care_storage",
            "care_maintenance",
        ]