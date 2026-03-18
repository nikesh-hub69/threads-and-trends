# orders/urls.py
from django.urls import path # type: ignore
from .views import (
    CreateOrderView,
    MyOrdersView,
    OrderDetailView,
    CancelOrderView,
    AdminOrdersListView,
    AdminOrderDetailView,
    UpdateOrderStatusView,
    # Return Request Views
    CreateReturnRequestView,
    MyReturnRequestsView,
    ReturnRequestDetailView,
    AdminReturnRequestsView,
    AdminReturnRequestDetailView,  # ✅ ADD THIS
    AdminUpdateReturnStatusView,
)

urlpatterns = [
    # ========================================
    # CUSTOMER ENDPOINTS
    # ========================================
    
    # Orders
    path("create/", CreateOrderView.as_view(), name="order-create"),
    path("mine/", MyOrdersView.as_view(), name="my-orders"),
    path("<int:order_id>/", OrderDetailView.as_view(), name="order-detail"),
    path("<int:order_id>/cancel/", CancelOrderView.as_view(), name="order-cancel"),

    # Return Requests
    path("return-request/", CreateReturnRequestView.as_view(), name="return-request-create"),
    path("return-requests/", MyReturnRequestsView.as_view(), name="my-return-requests"),
    path("return-requests/<int:return_id>/", ReturnRequestDetailView.as_view(), name="return-request-detail"),

    # ========================================
    # ADMIN ENDPOINTS
    # ========================================
    
    # Orders Management
    path("admin/orders/", AdminOrdersListView.as_view(), name="admin-orders-list"),
    path("admin/orders/<int:order_id>/", AdminOrderDetailView.as_view(), name="admin-order-detail"),
    path("admin/orders/<int:order_id>/status/", UpdateOrderStatusView.as_view(), name="admin-order-status-update"),
    
    # Return Requests Management
    path("admin/return-requests/", AdminReturnRequestsView.as_view(), name="admin-return-requests"),
    path("admin/return-requests/<int:return_id>/", AdminReturnRequestDetailView.as_view(), name="admin-return-detail"),  # ✅ ADD THIS LINE
    path("admin/return-requests/<int:return_id>/status/", AdminUpdateReturnStatusView.as_view(), name="admin-return-status-update"),
]