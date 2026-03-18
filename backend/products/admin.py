# products/admin.py
from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # add your existing settings if you have
    list_display = ("id", "name", "slug")
    search_fields = ("name", "slug")

    fieldsets = (
        ("Basic Info", {
            "fields": ("name", "slug")
        }),
        ("Shoe Care Tips", {
            "fields": ("care_cleaning", "care_storage", "care_maintenance")
        }),
    )