# accounts/utils.py
from django.conf import settings
from django.core.mail import send_mail

def send_verification_email(user):
    # generate a token if missing
    if not user.email_verification_token:
        user.generate_email_token()

    verify_link = f"{settings.FRONTEND_URL}/verify-email?token={user.email_verification_token}"

    subject = "Verify your email — Threads & Trends"
    message = (
        f"Hi {user.username},\n\n"
        f"Please verify your email by clicking the link below:\n"
        f"{verify_link}\n\n"
        f"If you did not create an account, ignore this email.\n\n"
        f"— Threads & Trends"
    )

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )