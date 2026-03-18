# accounts/urls.py
from django.urls import path
from .views import RegisterView, VerifyEmailView, MeView, ResendVerificationView
from .jwt_views import VerifiedEmailTokenObtainPairView
from .google_auth import GoogleLoginExchangeView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path("resend-verification/", ResendVerificationView.as_view(), name="resend-verification"),
    path("login/", VerifiedEmailTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("google/", GoogleLoginExchangeView.as_view(), name="google-login"),
    path("me/", MeView.as_view(), name="me"),
]