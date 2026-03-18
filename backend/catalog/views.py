from rest_framework import generics # type: ignore
from .models import Product, Brand, Category
from .serializers import (
    ProductListSerializer,
    ProductDetailSerializer,
    BrandSerializer,
    CategorySerializer,
)


class BrandListView(generics.ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        qs = (
            Product.objects
            .filter(is_active=True)
            .exclude(is_shop_now=True)
            .select_related("brand", "category")
            .prefetch_related("images", "variants")
            .order_by("-created_at")
        )

        brand_slug = self.request.query_params.get("brand")
        category_slug = self.request.query_params.get("category")
        gender = self.request.query_params.get("gender")

        if brand_slug:
            qs = qs.filter(brand__slug=brand_slug)
        if category_slug:
            qs = qs.filter(category__slug=category_slug)
        if gender:
            qs = qs.filter(gender=gender)

        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class BestSellerProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        return (
            Product.objects.filter(is_active=True, is_best_seller=True)
            .select_related("brand", "category")
            .prefetch_related("images", "variants")
            .order_by("-updated_at", "-created_at")
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class ProductDetailView(generics.RetrieveAPIView):
    queryset = (
        Product.objects.filter(is_active=True)
        .select_related("brand", "category")
        .prefetch_related("images", "variants")
    )
    serializer_class = ProductDetailSerializer
    lookup_field = "slug"

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class ShopNowProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer

    def get_queryset(self):
        return (
            Product.objects.filter(is_active=True, is_shop_now=True)
            .select_related("brand", "category")
            .prefetch_related("images", "variants")
            .order_by("-updated_at", "-created_at")
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context