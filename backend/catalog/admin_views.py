from rest_framework import generics, permissions
from .models import Product, ProductVariant
from .admin_serializers import (
    AdminProductSerializer,
    AdminProductUpdateSerializer,
    AdminVariantUpdateSerializer,
)

class IsAdmin(permissions.IsAdminUser):
    pass


class AdminProductListView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminProductSerializer

    def get_queryset(self):
        qs = (
            Product.objects.all()
            .select_related("brand", "category")
            .prefetch_related("images", "variants")
            .order_by("-updated_at", "-created_at")
        )

        q = self.request.query_params.get("q")
        if q:
            qs = qs.filter(name__icontains=q)

        return qs


class AdminProductDetailView(generics.RetrieveAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminProductSerializer
    lookup_field = "id"
    queryset = (
        Product.objects.all()
        .select_related("brand", "category")
        .prefetch_related("images", "variants")
    )


class AdminProductUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminProductUpdateSerializer
    lookup_field = "id"
    queryset = Product.objects.all()


class AdminVariantUpdateView(generics.UpdateAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminVariantUpdateSerializer
    lookup_field = "id"
    queryset = ProductVariant.objects.all()