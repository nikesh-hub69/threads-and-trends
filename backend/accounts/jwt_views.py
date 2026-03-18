# accounts/jwt_views.py
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()

class VerifiedEmailTokenSerializer(TokenObtainPairSerializer):
    """
    Accepts either:
      - email + password
      - username + password
    while still using Django's default authentication.
    """

    def validate(self, attrs):
        identifier = attrs.get("email") or attrs.get("username")

        if not identifier:
            raise AuthenticationFailed("Email is required.")

        # If email provided, map it to the user's username before calling super()
        if "@" in identifier:
            try:
                user = User.objects.get(email__iexact=identifier)
                attrs["username"] = user.get_username()
            except User.DoesNotExist:
                raise AuthenticationFailed("No active account found with the given credentials.")
        else:
            attrs["username"] = identifier

        data = super().validate(attrs)

        # self.user is set by super().validate
        user = self.user
        if not getattr(user, "is_email_verified", False):
            raise AuthenticationFailed("Please verify your email before logging in.")

        return data


class VerifiedEmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = VerifiedEmailTokenSerializer