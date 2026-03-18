# orders/serializers.py
from rest_framework import serializers # type: ignore
from .models import Order, OrderItem, OrderTimelineEvent, ReturnRequest, ReturnRequestPhoto


class OrderItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    name = serializers.CharField(max_length=255)
    price = serializers.DecimalField(max_digits=12, decimal_places=2)
    qty = serializers.IntegerField(min_value=1)
    size = serializers.CharField(
        max_length=50, required=False, allow_blank=True, default=""
    )


class OrderCreateSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    phone = serializers.CharField(max_length=30)
    address = serializers.CharField()

    payment_method = serializers.ChoiceField(
        choices=["cod", "esewa"], default="cod"
    )
    points_to_redeem = serializers.IntegerField(
        required=False, min_value=0, default=0
    )

    items = OrderItemCreateSerializer(many=True)

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("Cart is empty.")
        return items


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "product_id", "name", "price", "qty", "size"]


class OrderTimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderTimelineEvent
        fields = ["id", "status", "note", "created_at"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    timeline = OrderTimelineSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "full_name",
            "phone",
            "address",
            "subtotal",
            "points_discount",
            "total",
            "payment_method",
            "points_earned",
            "points_redeemed",
            "status",
            "created_at",
            "items",
            "timeline",  # ✅ timeline included
        ]


# ✅ NEW: Return Request Serializers
class ReturnRequestPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReturnRequestPhoto
        fields = ["id", "image", "uploaded_at"]


class ReturnRequestSerializer(serializers.ModelSerializer):
    photos = ReturnRequestPhotoSerializer(many=True, read_only=True)
    order_details = OrderSerializer(source="order", read_only=True)
    
    class Meta:
        model = ReturnRequest
        fields = [
            "id",
            "order",
            "order_details",
            "item_ids",
            "reason",
            "details",
            "status",
            "refund_amount",
            "shipping_fee_deducted",
            "return_tracking_number",
            "admin_notes",
            "created_at",
            "updated_at",
            "approved_at",
            "refunded_at",
            "photos",
        ]
        read_only_fields = [
            "user",
            "status",
            "refund_amount",
            "shipping_fee_deducted",
            "return_tracking_number",
            "admin_notes",
            "approved_at",
            "refunded_at",
        ]


class ReturnRequestCreateSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    item_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1,
        help_text="List of OrderItem IDs to return"
    )
    reason = serializers.ChoiceField(choices=ReturnRequest.REASON_CHOICES)
    details = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=2000,
        help_text="Additional details about the return"
    )

    def validate_item_ids(self, value):
        if not value:
            raise serializers.ValidationError("Please select at least one item to return")
        return value