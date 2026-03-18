from django.urls import path
from .views import (
    BrandListView, CategoryListView,
    ProductListView, ProductDetailView,
    BestSellerProductListView, ShopNowProductListView
)
from .admin_views import (
    AdminProductListView,
    AdminProductDetailView,
    AdminProductUpdateView,
    AdminVariantUpdateView,
)

urlpatterns = [
    # public
    path("brands/", BrandListView.as_view(), name="brand-list"),
    path("categories/", CategoryListView.as_view(), name="category-list"),

    # ✅ specific first
    path("products/best-sellers/", BestSellerProductListView.as_view(), name="best-seller-products"),
    path("products/shop-now/", ShopNowProductListView.as_view(), name="shop-now-products"),

    # ✅ then general list
    path("products/", ProductListView.as_view(), name="product-list"),

    # ✅ detail last
    path("products/<slug:slug>/", ProductDetailView.as_view(), name="product-detail"),

    # admin
    path("admin/products/", AdminProductListView.as_view(), name="admin-products"),
    path("admin/products/<int:id>/", AdminProductDetailView.as_view(), name="admin-product-detail"),
    path("admin/products/<int:id>/update/", AdminProductUpdateView.as_view(), name="admin-product-update"),
    path("admin/variants/<int:id>/update/", AdminVariantUpdateView.as_view(), name="admin-variant-update"),
]