from django.contrib import admin # type: ignore
from .models import Brand, Category, Product, ProductImage, ProductVariant


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug", "country")
    search_fields = ("name", "slug")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug", "is_active")
    search_fields = ("name", "slug")
    list_filter = ("is_active",)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "brand", "category", "gender", "base_price", "is_best_seller", "is_shop_now", "is_active")
    list_filter = ("brand", "category", "gender", "is_best_seller", "is_shop_now", "is_active")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline, ProductVariantInline]

    fieldsets = (
        ("Basic Info", {
            "fields": ("brand", "category", "name", "slug", "description", "gender", "base_price", "is_active")
        }),
        ("Homepage", {
            "fields": ("is_best_seller", "is_shop_now")
        }),
        ("Shoe Care Tips", {
            "fields": ("care_cleaning", "care_storage", "care_maintenance")
        }),
        ("3D Model", {                        # ← NEW SECTION
            "fields": ("model_3d",),
            "description": "Upload a .glb file for the 3D viewer feature."
        }),

        ("AR Try-On Image", {
        "fields": ("ar_image",),
        "description": "Upload a side-profile transparent PNG for AR try-on. Search Google Images for '[shoe name] side view PNG transparent'."
    }),
    )