import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.EmailField(unique=True)

    is_email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=64, blank=True, null=True)

    # ✅ Profile fields (for ProfilePage)
    full_name = models.CharField(max_length=150, blank=True, default="")
    phone = models.CharField(max_length=30, blank=True, default="")
    address = models.TextField(blank=True, default="")

    # ✅ Optional profile photo (enable now or remove if you don't want)
    # Requires MEDIA_URL + MEDIA_ROOT setup in settings.py
    photo = models.ImageField(upload_to="profiles/", blank=True, null=True)

    # ✅ Loyalty points
    points_balance = models.IntegerField(default=0)

    def generate_email_token(self):
        self.email_verification_token = uuid.uuid4().hex
        self.save(update_fields=["email_verification_token"])

    def __str__(self):
        return f"{self.email} ({self.points_balance} pts)"