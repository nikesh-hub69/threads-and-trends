# products/models.py
from django.db import models

class Product(models.Model):
    # ... your existing fields (name, slug, price, etc.)

    # ✅ Shoe Care Tips (unique feature)
    care_cleaning = models.TextField(blank=True, default="")
    care_storage = models.TextField(blank=True, default="")
    care_maintenance = models.TextField(blank=True, default="")

    def __str__(self):
        return getattr(self, "name", "Product")