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
        url = obj.image.url
        if url.startswith('http'):
            return url
        return request.build_absolute_uri(url) if request else url


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ("id", "size", "sku", "price", "stock", "is_active")


def build_model_3d_url(obj, request):
    """
    model_3d uses local FileSystemStorage, so .url returns /media/models/3d/file.glb
    We need to build the full absolute URL: http://localhost:8000/media/models/3d/file.glb
    """
    if not obj.model_3d:
        return None
    try:
        url = obj.model_3d.url  # returns /media/models/3d/filename.glb
        if url.startswith('http'):
            return url
        # Build absolute URL using request
        if request:
            return request.build_absolute_uri(url)
        # Fallback: prepend backend base URL
        return f"http://localhost:8000{url}"
    except Exception:
        return None


class ProductListSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    main_image = serializers.SerializerMethodField()
    variants = ProductVariantSerializer(many=True, read_only=True)
    model_3d = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id", "name", "slug", "brand", "category", "gender",
            "base_price", "main_image", "variants",
            "is_best_seller", "is_shop_now", "model_3d",
        )

    def get_main_image(self, obj):
        image = obj.images.filter(is_main=True).first() or obj.images.first()
        if image:
            request = self.context.get("request")
            url = image.image.url
            if url.startswith('http'):
                return url
            return request.build_absolute_uri(url) if request else url
        return None

    def get_model_3d(self, obj):
        return build_model_3d_url(obj, self.context.get("request"))


class ProductDetailSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    model_3d = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id", "name", "slug", "description", "brand", "category",
            "gender", "base_price", "images", "variants",
            "care_cleaning", "care_storage", "care_maintenance",
            "is_best_seller", "is_shop_now", "created_at", "model_3d",
        )

    def get_model_3d(self, obj):
        return build_model_3d_url(obj, self.context.get("request"))