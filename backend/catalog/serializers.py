from rest_framework import serializers # type: ignore
from .models import Brand, Category, Product, ProductImage, ProductVariant

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ("id", "name", "slug", "country")

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name", "slug")

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ("id", "image", "alt_text", "is_main")

    def get_image(self, obj):
        request = self.context.get('request')
        url = str(obj.image)
        if url.startswith('http://') or url.startswith('https://'):
            return url
        return request.build_absolute_uri(url) if request else url

class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ("id", "size", "sku", "price", "stock", "is_active")

def build_model_3d_url(obj, request):
    if not obj.model_3d:
        return None
    try:
        url = obj.model_3d.url
        if url.startswith('http://') or url.startswith('https://'):
            return url
        if request:
            return request.build_absolute_uri(url)
        return f"http://localhost:8000{url}"
    except Exception:
        return None

def build_ar_image_url(obj, request):
    if not obj.ar_image:
        return None
    try:
        url = str(obj.ar_image)
        if url.startswith('http://') or url.startswith('https://'):
            # Strip the domain and return just the path so proxy handles it
            from urllib.parse import urlparse
            parsed = urlparse(url)
            return parsed.path
        return obj.ar_image.url
    except Exception:
        return None

class ProductListSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    main_image = serializers.SerializerMethodField()
    variants = ProductVariantSerializer(many=True, read_only=True)
    model_3d = serializers.SerializerMethodField()
    ar_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id", "name", "slug", "brand", "category", "gender",
            "base_price", "main_image", "variants",
            "is_best_seller", "is_shop_now", "model_3d", "ar_image",
        )

    def get_main_image(self, obj):
        image = obj.images.filter(is_main=True).first() or obj.images.first()
        if image:
            url = str(image.image)
            if url.startswith('http://') or url.startswith('https://'):
                return url
            request = self.context.get("request")
            return request.build_absolute_uri(url) if request else url
        return None

    def get_model_3d(self, obj):
        return build_model_3d_url(obj, self.context.get("request"))

    def get_ar_image(self, obj):
        return build_ar_image_url(obj, self.context.get("request"))

class ProductDetailSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    model_3d = serializers.SerializerMethodField()
    ar_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id", "name", "slug", "description", "brand", "category",
            "gender", "base_price", "images", "variants",
            "care_cleaning", "care_storage", "care_maintenance",
            "is_best_seller", "is_shop_now", "created_at", "model_3d", "ar_image",
        )

    def get_model_3d(self, obj):
        return build_model_3d_url(obj, self.context.get("request"))

    def get_ar_image(self, obj):
        return build_ar_image_url(obj, self.context.get("request"))