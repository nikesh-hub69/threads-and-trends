from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model

from .utils import send_verification_email

User = get_user_model()


class RegisterView(APIView):
    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        password = (request.data.get("password") or "").strip()
        username = (request.data.get("username") or "").strip()

        if not email or not password:
            return Response({"detail": "email and password required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"detail": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ auto-generate username if not provided
        if not username:
            base = email.split("@")[0]
            username = base
            i = 1
            while User.objects.filter(username=username).exists():
                i += 1
                username = f"{base}{i}"

        user = User.objects.create_user(username=username, email=email, password=password)
        user.is_email_verified = False

        # ✅ IMPORTANT: generate token BEFORE sending email
        user.generate_email_token()
        user.save()

        send_verification_email(user)

        return Response(
            {"detail": "Signup success. Verification email sent."},
            status=status.HTTP_201_CREATED,
        )


class VerifyEmailView(APIView):
    def get(self, request):
        token = request.query_params.get("token")

        if not token:
            return Response({"detail": "token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email_verification_token=token)
        except User.DoesNotExist:
            return Response({"detail": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

        if user.is_email_verified:
            return Response({"detail": "Email already verified ✅"}, status=status.HTTP_200_OK)

        user.is_email_verified = True
        user.email_verification_token = None
        user.save(update_fields=["is_email_verified", "email_verification_token"])

        return Response({"detail": "Email verified successfully ✅"}, status=status.HTTP_200_OK)


def _get_photo_url(user, request):
    """Helper to get the full photo URL for a user."""
    if not user.photo:
        return ""
    url = user.photo.url
    # Cloudinary URLs are already absolute
    if url.startswith("http://") or url.startswith("https://"):
        return url
    # Local files need the full domain
    return request.build_absolute_uri(url)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        u = request.user
        return Response(
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "is_email_verified": getattr(u, "is_email_verified", False),

                # ✅ profile fields (needed by ProfilePage)
                "full_name": (getattr(u, "full_name", "") or "").strip()
                             or f"{(u.first_name or '').strip()} {(u.last_name or '').strip()}".strip(),
                "phone": getattr(u, "phone", "") or "",
                "address": getattr(u, "address", "") or "",

                # ✅ FIXED: Return photo URL
                "photo": _get_photo_url(u, request),

                # ✅ Loyalty points
                "points_balance": int(getattr(u, "points_balance", 0) or 0),

                # ✅ IMPORTANT: admin flags for frontend admin login
                "is_staff": bool(getattr(u, "is_staff", False)),
                "is_superuser": bool(getattr(u, "is_superuser", False)),
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request):
        """
        Supports ProfilePage save:
        PATCH /api/auth/me/
        body: full_name, phone, address, photo (multipart)
        """
        u = request.user

        full_name = (request.data.get("full_name") or "").strip()
        phone = (request.data.get("phone") or "").strip()
        address = (request.data.get("address") or "").strip()

        # ✅ Save full_name safely
        if hasattr(u, "full_name"):
            if full_name:
                u.full_name = full_name
        else:
            if full_name:
                parts = full_name.split()
                u.first_name = parts[0]
                u.last_name = " ".join(parts[1:]) if len(parts) > 1 else ""

        if hasattr(u, "phone"):
            u.phone = phone

        if hasattr(u, "address"):
            u.address = address

        # ✅ FIXED: Handle photo upload
        photo_file = request.FILES.get("photo")
        if photo_file:
            # Delete old photo if it exists (Cloudinary will handle cleanup)
            if u.photo:
                try:
                    u.photo.delete(save=False)
                except Exception:
                    pass
            u.photo = photo_file

        u.save()

        return Response(
            {
                "detail": "Profile updated successfully ✅",
                # ✅ FIXED: Return updated photo URL so frontend can display it
                "photo": _get_photo_url(u, request),
                "full_name": u.full_name if hasattr(u, "full_name") else f"{u.first_name} {u.last_name}".strip(),
                "phone": getattr(u, "phone", ""),
                "address": getattr(u, "address", ""),
                "points_balance": int(getattr(u, "points_balance", 0) or 0),
            },
            status=status.HTTP_200_OK,
        )


class ResendVerificationView(APIView):
    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()

        if not email:
            return Response({"detail": "email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "No account with this email"}, status=status.HTTP_404_NOT_FOUND)

        if user.is_email_verified:
            return Response({"detail": "Email already verified"}, status=status.HTTP_400_BAD_REQUEST)

        user.generate_email_token()
        user.save(update_fields=["email_verification_token"])
        send_verification_email(user)

        return Response({"detail": "Verification email resent ✅"}, status=status.HTTP_200_OK)