import os
import django

# ✅ Tell Django which settings file to use
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.core.mail import send_mail
from django.conf import settings

send_mail(
    subject="Test Email from Threads & Trends",
    message="If you got this email, SMTP is working 🎉",
    from_email=settings.DEFAULT_FROM_EMAIL,
    recipient_list=["nikeshsubedi56@gmail.com"],  # change this to your email
    fail_silently=False,
)

print("✅ EMAIL SENT SUCCESSFULLY")