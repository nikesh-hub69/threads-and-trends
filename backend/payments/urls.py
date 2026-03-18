# payments/urls.py
from django.urls import path
from .views import EsewaInitView, EsewaSuccessView, EsewaFailureView

urlpatterns = [
    path("esewa/init/", EsewaInitView.as_view(), name="esewa-init"),
    path("esewa/success/", EsewaSuccessView.as_view(), name="esewa-success"),
    path("esewa/failure/", EsewaFailureView.as_view(), name="esewa-failure"),
]