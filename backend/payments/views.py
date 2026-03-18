# payments/views.py
import uuid
from decimal import Decimal, ROUND_DOWN

from django.conf import settings
from django.db import transaction
from django.shortcuts import redirect

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from orders.models import Order, OrderItem
from orders.esewa import make_esewa_form_fields, decode_esewa_success_data, status_check


def _to_decimal(v, default="0.00") -> Decimal:
    try:
        return Decimal(str(v)).quantize(Decimal("0.01"))
    except Exception:
        return Decimal(default)


def calc_points_earned(total_amount: Decimal) -> int:
    """
    Rule: Earn 1 point per Rs 100 spent (after discount).
    Example: Rs 999 -> 9 points
    """
    if total_amount <= 0:
        return 0
    return int((total_amount / Decimal("100")).quantize(Decimal("1"), rounding=ROUND_DOWN))


class EsewaInitView(APIView):
    """
    Creates an Order with payment_method=esewa + status=placed,
    applies points discount (if provided),
    returns eSewa form_url + fields (frontend auto-submits).
    """
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        user = request.user
        data = request.data or {}

        full_name = (data.get("full_name") or "").strip()
        phone = (data.get("phone") or "").strip()
        address = (data.get("address") or "").strip()
        items = data.get("items") or []

        points_to_redeem = int(data.get("points_to_redeem") or 0)
        if points_to_redeem < 0:
            points_to_redeem = 0

        if not full_name or not phone or not address:
            return Response({"detail": "full_name, phone, address required"}, status=400)
        if not items:
            return Response({"detail": "Cart is empty"}, status=400)

        # ✅ calculate subtotal using Decimal
        subtotal = Decimal("0.00")
        for it in items:
            price = _to_decimal(it.get("price") or "0")
            qty = int(it.get("qty") or 1)
            if qty < 1:
                qty = 1
            subtotal += (price * Decimal(qty))

        # ✅ clamp points to redeem (1 point = Rs 1)
        user_balance = int(getattr(user, "points_balance", 0) or 0)
        max_by_subtotal = int(subtotal.to_integral_value(rounding=ROUND_DOWN))
        max_redeemable = max(0, min(user_balance, max_by_subtotal))
        safe_points = max(0, min(points_to_redeem, max_redeemable))

        points_discount = Decimal(safe_points).quantize(Decimal("0.01"))
        total = subtotal - points_discount
        if total < 0:
            total = Decimal("0.00")

        # ✅ create order
        order = Order.objects.create(
            user=user,
            full_name=full_name,
            phone=phone,
            address=address,
            subtotal=subtotal,
            points_discount=points_discount,
            total=total,
            payment_method="esewa",
            points_redeemed=safe_points,
            points_earned=0,      # only award on payment success
            status="placed",
        )

        # ✅ create order items
        OrderItem.objects.bulk_create([
            OrderItem(
                order=order,
                product_id=int(it.get("product_id") or 0),
                name=(it.get("name") or "")[:255],
                price=_to_decimal(it.get("price") or "0"),
                qty=int(it.get("qty") or 1) if int(it.get("qty") or 1) > 0 else 1,
                size=(it.get("size") or "")[:50],
            )
            for it in items
        ])

        # ✅ UNIQUE eSewa transaction_uuid (fixes "Duplicate transaction UUID")
        # Use uuid4 so every payment attempt is unique.
        order.esewa_transaction_uuid = uuid.uuid4().hex
        order.save(update_fields=["esewa_transaction_uuid"])

        total_amount = str(order.total.quantize(Decimal("0.01")))

        form_url, status_url, fields = make_esewa_form_fields(
            total_amount=total_amount,
            transaction_uuid=order.esewa_transaction_uuid,
        )

        request.session[f"esewa_status_url_{order.id}"] = status_url

        return Response(
            {"order_id": order.id, "form_url": form_url, "fields": fields},
            status=200,
        )


class EsewaSuccessView(APIView):
    """
    eSewa redirects here with ?data=<base64>.
    We verify via status-check and then redirect to frontend.
    """
    @transaction.atomic
    def get(self, request):
        data_b64 = request.query_params.get("data")
        if not data_b64:
            return redirect(f"{settings.FRONTEND_BASE_URL}/checkout?pay=failed")

        try:
            payload = decode_esewa_success_data(data_b64)
            transaction_uuid = str(payload.get("transaction_uuid") or "")
        except Exception:
            return redirect(f"{settings.FRONTEND_BASE_URL}/checkout?pay=failed")

        # ✅ lookup order by esewa_transaction_uuid (NOT by id)
        try:
            order = (
                Order.objects.select_for_update()
                .select_related("user")
                .get(esewa_transaction_uuid=transaction_uuid)
            )
        except Order.DoesNotExist:
            return redirect(f"{settings.FRONTEND_BASE_URL}/checkout?pay=failed")

        # ✅ prevent double-award if user refreshes success page
        if order.status == "paid":
            return redirect(f"{settings.FRONTEND_BASE_URL}/order-success/{order.id}?pm=esewa")

        # choose status URL based on env
        if getattr(settings, "ESEWA_ENV", "RC") == "PROD":
            status_url = "https://epay.esewa.com.np/api/epay/transaction/status/"
        else:
            status_url = "https://rc.esewa.com.np/api/epay/transaction/status/"

        try:
            res = status_check(
                status_url=status_url,
                product_code=settings.ESEWA_PRODUCT_CODE,
                total_amount=str(order.total.quantize(Decimal("0.01"))),
                transaction_uuid=str(order.esewa_transaction_uuid),
            )
        except Exception:
            return redirect(f"{settings.FRONTEND_BASE_URL}/checkout?pay=pending")

        if (res.get("status") or "").upper() == "COMPLETE":
            # ✅ mark paid + award points now
            order.status = "paid"
            order.points_earned = int(calc_points_earned(order.total))
            order.save(update_fields=["status", "points_earned"])

            # ✅ update user points balance once
            user = order.user
            current = int(getattr(user, "points_balance", 0) or 0)
            new_balance = current - int(order.points_redeemed or 0) + int(order.points_earned or 0)
            user.points_balance = max(0, new_balance)
            user.save(update_fields=["points_balance"])

            return redirect(f"{settings.FRONTEND_BASE_URL}/order-success/{order.id}?pm=esewa")

        return redirect(f"{settings.FRONTEND_BASE_URL}/checkout?pay=failed")


class EsewaFailureView(APIView):
    def get(self, request):
        return redirect(f"{settings.FRONTEND_BASE_URL}/checkout?pay=failed")