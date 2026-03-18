# orders/views.py
import json
from decimal import Decimal, ROUND_DOWN
from datetime import timedelta
from django.db import transaction # type: ignore
from django.utils import timezone # type: ignore
from django.core.mail import send_mail # type: ignore
from django.conf import settings # type: ignore
from django.shortcuts import get_object_or_404 # type: ignore
from rest_framework.views import APIView # type: ignore
from rest_framework.permissions import IsAuthenticated, IsAdminUser # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import status # type: ignore

from .models import Order, OrderItem, OrderTimelineEvent, ReturnRequest, ReturnRequestPhoto
from .serializers import (
    OrderCreateSerializer,
    OrderSerializer,
    ReturnRequestSerializer,
    ReturnRequestCreateSerializer,
)


def calc_points_earned(total_amount: Decimal) -> int:
    """
    Rule: Earn 1 point per Rs 100 spent (after discount).
    Example: Rs 999 -> 9 points
    """
    if total_amount <= 0:
        return 0
    return int((total_amount / Decimal("100")).quantize(Decimal("1"), rounding=ROUND_DOWN))


# helper: create timeline event safely
def add_timeline(order: Order, status_value: str, note: str = ""):
    OrderTimelineEvent.objects.create(order=order, status=status_value, note=note or "")


class CreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        ser = OrderCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        items = data.get("items", [])
        if not items:
            return Response({"detail": "Cart items required"}, status=status.HTTP_400_BAD_REQUEST)

        # compute subtotal
        subtotal = Decimal("0.00")
        for it in items:
            subtotal += (it["price"] * it["qty"])

        payment_method = (data.get("payment_method") or "cod").lower()

        # points redeem
        user = request.user
        user_points = int(getattr(user, "points_balance", 0) or 0)

        points_to_redeem = int(data.get("points_to_redeem") or 0)
        points_to_redeem = max(points_to_redeem, 0)

        max_by_subtotal = int(subtotal.quantize(Decimal("1"), rounding=ROUND_DOWN))
        redeemable = min(points_to_redeem, user_points, max_by_subtotal)

        points_discount = Decimal(redeemable)
        total = subtotal - points_discount
        if total < 0:
            total = Decimal("0.00")

        # points earned (COD can award now; eSewa awards on payment success)
        points_earned = calc_points_earned(total)

        # create order
        order = Order.objects.create(
            user=user,
            full_name=data["full_name"],
            phone=data["phone"],
            address=data["address"],
            subtotal=subtotal,
            points_discount=points_discount,
            total=total,
            payment_method=payment_method,
            points_redeemed=redeemable,
            points_earned=points_earned if payment_method == "cod" else 0,
            status="placed",
        )

        # create order items
        OrderItem.objects.bulk_create(
            [
                OrderItem(
                    order=order,
                    product_id=it["product_id"],
                    name=it["name"],
                    price=it["price"],
                    qty=it["qty"],
                    size=it.get("size", "") or "",
                )
                for it in items
            ]
        )

        # first timeline event
        add_timeline(order, "placed", "Order placed")

        # update user points balance (COD only here)
        if payment_method == "cod" and hasattr(user, "points_balance"):
            user.points_balance = max(0, user_points - redeemable) + int(order.points_earned or 0)
            user.save(update_fields=["points_balance"])

        return Response(
            {
                "id": order.id,
                "detail": "Order created ✅",
                "points_redeemed": redeemable,
                "points_earned": int(order.points_earned or 0),
                "points_balance": getattr(user, "points_balance", None),
            },
            status=status.HTTP_201_CREATED,
        )


class MyOrdersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Order.objects.filter(user=request.user)
            .prefetch_related("items", "timeline")
            .order_by("-created_at")
        )
        return Response(OrderSerializer(qs, many=True).data, status=status.HTTP_200_OK)


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        try:
            order = (
                Order.objects.filter(id=order_id, user=request.user)
                .prefetch_related("items", "timeline")
                .get()
            )
        except Order.DoesNotExist:
            return Response({"detail": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)


class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, order_id):
        try:
            order = (
                Order.objects.select_for_update()
                .filter(id=order_id, user=request.user)
                .get()
            )
        except Order.DoesNotExist:
            return Response({"detail": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        if order.status in ["cancelled", "delivered"]:
            return Response({"detail": "This order cannot be cancelled."}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        if hasattr(user, "points_balance"):
            current = int(getattr(user, "points_balance", 0) or 0)
            refund = int(order.points_redeemed or 0)
            remove_earned = int(order.points_earned or 0)
            user.points_balance = max(0, current + refund - remove_earned)
            user.save(update_fields=["points_balance"])

        order.status = "cancelled"
        order.save(update_fields=["status"])

        add_timeline(order, "cancelled", "Cancelled by customer")

        return Response(
            {
                "detail": "Order cancelled ✅",
                "order_id": order.id,
                "status": order.status,
                "points_balance": getattr(user, "points_balance", None),
            },
            status=status.HTTP_200_OK,
        )


# ==========================================================
# RETURN REQUEST ENDPOINTS
# ==========================================================

class CreateReturnRequestView(APIView):
    """Customer endpoint to create a return request"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Get data from request
            order_id = request.data.get("order_id")
            item_ids_str = request.data.get("item_ids")
            reason = request.data.get("reason")
            details = request.data.get("details", "")

            # Validation
            if not order_id:
                return Response(
                    {"detail": "Order ID is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not item_ids_str:
                return Response(
                    {"detail": "At least one item must be selected"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not reason:
                return Response(
                    {"detail": "Return reason is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Parse item IDs
            try:
                item_ids = json.loads(item_ids_str)
            except (json.JSONDecodeError, TypeError):
                return Response(
                    {"detail": "Invalid item IDs format"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get order and verify ownership
            order = get_object_or_404(Order, id=order_id, user=request.user)

            # Check if order is delivered
            if order.status != "delivered":
                return Response(
                    {"detail": "Only delivered orders can be returned"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if within 30-day window
            delivered_event = order.timeline.filter(status="delivered").first()
            if not delivered_event:
                return Response(
                    {"detail": "Order delivery date not found"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            days_since_delivery = (timezone.now() - delivered_event.created_at).days
            if days_since_delivery > 30:
                return Response(
                    {"detail": "Return window has expired (30 days from delivery)"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Verify all items belong to this order
            order_item_ids = set(order.items.values_list('id', flat=True))
            if not set(item_ids).issubset(order_item_ids):
                return Response(
                    {"detail": "Some items do not belong to this order"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Calculate refund amount
            items_to_return = order.items.filter(id__in=item_ids)
            refund_amount = sum(
                item.price * item.qty for item in items_to_return
            )

            # Determine shipping fee
            free_return_reasons = ["defective", "damaged", "wrong_item"]
            shipping_fee = 0 if reason in free_return_reasons else 500

            # Create return request
            return_request = ReturnRequest.objects.create(
                user=request.user,
                order=order,
                item_ids=item_ids,
                reason=reason,
                details=details,
                refund_amount=refund_amount,
                shipping_fee_deducted=shipping_fee,
                status="pending"
            )

            # Handle photo uploads
            photo_count = 0
            for key in request.FILES:
                if key.startswith('photo_'):
                    photo_file = request.FILES[key]
                    ReturnRequestPhoto.objects.create(
                        return_request=return_request,
                        image=photo_file
                    )
                    photo_count += 1
                    if photo_count >= 5:  # Max 5 photos
                        break

            # Send confirmation emails
            send_return_confirmation_email(return_request)
            send_admin_return_notification(return_request)

            # Serialize and return
            serializer = ReturnRequestSerializer(return_request)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error creating return request: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response(
                {"detail": f"Error: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class MyReturnRequestsView(APIView):
    """
    GET /api/orders/return-requests/
    List all return requests for the authenticated user
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return_requests = (
            ReturnRequest.objects.filter(user=request.user)
            .prefetch_related("photos", "order__items")
            .order_by("-created_at")
        )
        serializer = ReturnRequestSerializer(return_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReturnRequestDetailView(APIView):
    """
    GET /api/orders/return-requests/<id>/
    Get details of a specific return request
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, return_id):
        try:
            return_request = (
                ReturnRequest.objects.filter(id=return_id, user=request.user)
                .prefetch_related("photos", "order__items")
                .get()
            )
        except ReturnRequest.DoesNotExist:
            return Response(
                {"detail": "Return request not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ReturnRequestSerializer(return_request)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ==========================================================
# EMAIL HELPERS
# ==========================================================

def send_return_confirmation_email(return_request):
    """Send return confirmation email to customer"""
    subject = f"Return Request #{return_request.id} Received - Threads & Trends"
    
    message = f"""
Dear {return_request.user.get_full_name() or return_request.user.email},

Your return request has been received and is being reviewed.

Return Request Details:
- Request ID: #{return_request.id}
- Order ID: #{return_request.order_id}
- Reason: {return_request.get_reason_display()}
- Items: {len(return_request.item_ids)}
- Estimated Refund: Rs. {return_request.refund_amount - return_request.shipping_fee_deducted}

What happens next:
1. We'll review your request within 24 hours
2. You'll receive a prepaid return shipping label via email
3. Pack your items securely with all tags and accessories
4. Drop off at any authorized shipping location
5. Refund will be processed within 5-7 days after we receive the items

Shipping Fee: {"Free (defective/incorrect item)" if return_request.shipping_fee_deducted == 0 else f"Rs. {return_request.shipping_fee_deducted} (deducted from refund)"}

Need help? Contact us at returns@threadsandtrends.com

Thank you,
Threads & Trends Team
"""
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[return_request.user.email],
        fail_silently=False,
    )


def send_admin_return_notification(return_request):
    """Send notification to admin about new return request"""
    subject = f"New Return Request #{return_request.id} - Order #{return_request.order_id}"
    
    message = f"""
New return request received:

Request ID: #{return_request.id}
Order ID: #{return_request.order_id}
Customer: {return_request.user.email}
Reason: {return_request.get_reason_display()}
Details: {return_request.details or "None provided"}
Items Count: {len(return_request.item_ids)}
Refund Amount: Rs. {return_request.refund_amount}
Shipping Fee: Rs. {return_request.shipping_fee_deducted}

Review this request in the admin panel.
"""
    
    # Send to admin email (configure in settings)
    admin_email = getattr(settings, 'ADMIN_EMAIL', 'admin@threadsandtrends.com')
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[admin_email],
        fail_silently=True,
    )


# ==========================================================
# ADMIN ONLY (matches frontend: /api/orders/admin/...)
# ==========================================================

class AdminOrdersListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = (
            Order.objects.all()
            .prefetch_related("items", "timeline")
            .order_by("-created_at")
        )
        return Response(OrderSerializer(qs, many=True).data, status=status.HTTP_200_OK)


class AdminOrderDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, order_id):
        try:
            order = (
                Order.objects.all()
                .prefetch_related("items", "timeline")
                .get(id=order_id)
            )
        except Order.DoesNotExist:
            return Response({"detail": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)


class UpdateOrderStatusView(APIView):
    """
    Staff-only endpoint:
    PATCH /api/orders/admin/orders/<order_id>/status/
    body: { "status": "packed", "note": "Packed and ready" }
    """
    permission_classes = [IsAdminUser]

    @transaction.atomic
    def patch(self, request, order_id):
        new_status = (request.data.get("status") or "").strip()
        note = (request.data.get("note") or "").strip()

        allowed = {c[0] for c in Order.STATUS_CHOICES}
        if new_status not in allowed:
            return Response(
                {"detail": f"Invalid status. Allowed: {sorted(list(allowed))}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            order = (
                Order.objects.select_for_update()
                .prefetch_related("items", "timeline")
                .get(id=order_id)
            )
        except Order.DoesNotExist:
            return Response({"detail": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        if order.status in ["cancelled", "delivered"]:
            return Response({"detail": "Cannot change status of cancelled/delivered order."}, status=400)

        order.status = new_status
        order.save(update_fields=["status"])

        add_timeline(order, new_status, note)

        # refresh serializer output with timeline
        order = (
            Order.objects.filter(id=order_id)
            .prefetch_related("items", "timeline")
            .get()
        )
        return Response(OrderSerializer(order).data, status=status.HTTP_200_OK)


class AdminReturnRequestsView(APIView):
    """
    GET /api/orders/admin/return-requests/
    List all return requests (admin only)
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        return_requests = (
            ReturnRequest.objects.all()
            .prefetch_related("photos", "order__items", "user")
            .order_by("-created_at")
        )
        serializer = ReturnRequestSerializer(return_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AdminUpdateReturnStatusView(APIView):
    """
    PATCH /api/orders/admin/return-requests/<id>/status/
    Update return request status (admin only)
    """
    permission_classes = [IsAdminUser]

    @transaction.atomic
    def patch(self, request, return_id):
        new_status = request.data.get("status", "").strip()
        admin_notes = request.data.get("admin_notes", "").strip()
        tracking_number = request.data.get("tracking_number", "").strip()

        allowed_statuses = {c[0] for c in ReturnRequest.STATUS_CHOICES}
        if new_status not in allowed_statuses:
            return Response(
                {"detail": f"Invalid status. Allowed: {sorted(list(allowed_statuses))}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            return_request = ReturnRequest.objects.select_for_update().get(id=return_id)
        except ReturnRequest.DoesNotExist:
            return Response(
                {"detail": "Return request not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update fields
        return_request.status = new_status
        if admin_notes:
            return_request.admin_notes = admin_notes
        if tracking_number:
            return_request.return_tracking_number = tracking_number

        # Set timestamps
        if new_status == "approved" and not return_request.approved_at:
            return_request.approved_at = timezone.now()
        elif new_status == "refunded" and not return_request.refunded_at:
            return_request.refunded_at = timezone.now()

        return_request.save()

        serializer = ReturnRequestSerializer(return_request)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AdminReturnRequestDetailView(APIView):
    """
    GET /api/orders/admin/return-requests/<id>/
    Get details of a specific return request (admin only)
    """
    permission_classes = [IsAdminUser]

    def get(self, request, return_id):
        try:
            return_request = (
                ReturnRequest.objects.filter(id=return_id)
                .select_related('order', 'user')
                .prefetch_related('photos', 'order__items')
                .get()
            )
        except ReturnRequest.DoesNotExist:
            return Response(
                {"detail": "Return request not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ReturnRequestSerializer(return_request)
        return Response(serializer.data, status=status.HTTP_200_OK)