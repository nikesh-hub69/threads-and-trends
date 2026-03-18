from rest_framework import serializers
from .models import Product, ProductVariant, ProductImage, Brand, Category


class AdminProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ("id", "size", "color", "sku", "price", "stock", "is_active")


class AdminProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id", "image", "alt_text", "is_main")


class AdminProductSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source="brand.name", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    variants = AdminProductVariantSerializer(many=True, read_only=True)
    images = AdminProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "gender",
            "base_price",
            "is_active",
            "is_best_seller",
            "brand",
            "category",
            "brand_name",
            "category_name",
            "variants",
            "images",
            "created_at",
            "updated_at",
        )


class AdminProductUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = (
            "name",
            "slug",
            "gender",
            "base_price",
            "description",
            "is_active",
            "is_best_seller",
            "brand",
            "category",
            "care_cleaning",
            "care_storage",
            "care_maintenance",
        )


class AdminVariantUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ("size", "color", "sku", "price", "stock", "is_active")