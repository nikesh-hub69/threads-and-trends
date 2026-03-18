from django.db import models
from django.core.files.storage import FileSystemStorage
import os

# Local storage specifically for 3D model files
# This bypasses Cloudinary (which blocks .glb files)
local_storage = FileSystemStorage(
    location=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'media'),
    base_url='/media/'
)


class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    country = models.CharField(max_length=60, blank=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    GENDER_CHOICES = (
        ("M", "Men"),
        ("W", "Women"),
        ("U", "Unisex"),
    )

    brand = models.ForeignKey(Brand, on_delete=models.PROTECT, related_name="products")
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")

    # ✅ Uses local storage instead of Cloudinary — .glb files not supported by Cloudinary
    model_3d = models.FileField(
        upload_to='models/3d/',
        storage=local_storage,
        null=True,
        blank=True,
        help_text="Upload a .glb 3D model file for this product"
    )

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField(blank=True)

    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default="U")

    is_best_seller = models.BooleanField(default=False)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)

    is_shop_now = models.BooleanField(default=False)

    care_cleaning = models.TextField(blank=True, default="")
    care_storage = models.TextField(blank=True, default="")
    care_maintenance = models.TextField(blank=True, default="")

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.brand.name} {self.name}"


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/")
    alt_text = models.CharField(max_length=255, blank=True)
    is_main = models.BooleanField(default=False)

    class Meta:
        ordering = ["-is_main", "id"]

    def __str__(self):
        return f"Image for {self.product.name}"


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")

    size = models.CharField(max_length=10)
    color = models.CharField(max_length=50, blank=True)
    sku = models.CharField(max_length=50, blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("product", "size", "color")
        ordering = ["product", "size"]

    def __str__(self):
        return f"{self.product.name} - {self.size} ({self.color})"