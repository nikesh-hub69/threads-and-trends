import firebase_admin # type: ignore
from firebase_admin import auth as fb_auth, credentials # type: ignore
from django.conf import settings # type: ignore
from django.contrib.auth import get_user_model # type: ignore
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore

User = get_user_model()

# ✅ init firebase admin once — supports both local file and Render env variable
import json
import os

if not firebase_admin._apps:
    firebase_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    if firebase_json:
        # Production (Render): load from environment variable
        service_account_info = json.loads(firebase_json)
        cred = credentials.Certificate(service_account_info)
    else:
        # Local development: load from JSON file
        cred = credentials.Certificate(str(settings.FIREBASE_SERVICE_ACCOUNT))
    firebase_admin.initialize_app(cred)


class GoogleLoginExchangeView(APIView):
    """
    Frontend sends Firebase idToken -> backend verifies -> backend returns JWT (access/refresh)
    """

    def post(self, request):
        # ✅ FIXED: Accept both 'credential' (from frontend) and 'id_token'
        id_token = request.data.get("credential") or request.data.get("id_token")
        if not id_token:
            return Response({"detail": "id_token required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded = fb_auth.verify_id_token(id_token)
        except Exception:
            return Response({"detail": "Invalid Firebase token"}, status=status.HTTP_400_BAD_REQUEST)

        email = (decoded.get("email") or "").lower().strip()
        if not email:
            return Response({"detail": "Google account has no email"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ create username if needed
        base = email.split("@")[0]
        username = base
        i = 1
        while User.objects.filter(username=username).exclude(email=email).exists():
            i += 1
            username = f"{base}{i}"

        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": username},
        )

        # ✅ mark verified (Google email is already verified)
        if hasattr(user, "is_email_verified") and not user.is_email_verified:
            user.is_email_verified = True
            user.save(update_fields=["is_email_verified"])

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "email": user.email,
                "username": user.username,
            },
            status=status.HTTP_200_OK,
        )