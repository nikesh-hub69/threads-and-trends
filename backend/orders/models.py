# orders/models.py
from django.db import models # type: ignore
from django.contrib.auth import get_user_model # type: ignore

User = get_user_model()


class Order(models.Model):
    STATUS_CHOICES = (
        ("placed", "Placed"),
        ("packed", "Packed"),
        ("out_for_delivery", "Out for delivery"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
        ("paid", "Paid"),  # optional payment-only state
    )

    PAYMENT_CHOICES = (
        ("cod", "Cash on Delivery"),
        ("esewa", "eSewa"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30)
    address = models.TextField()

    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    points_discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default="cod")

    points_earned = models.IntegerField(default=0)
    points_redeemed = models.IntegerField(default=0)

    # ✅ Current order stage (timeline driver)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="placed")

    # ✅ IMPORTANT for eSewa: MUST be unique per payment attempt
    esewa_transaction_uuid = models.CharField(max_length=64, blank=True, default="", db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.email}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product_id = models.IntegerField()
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    qty = models.IntegerField(default=1)
    size = models.CharField(max_length=50, blank=True, default="")

    def line_total(self):
        return self.price * self.qty


# ✅ Timeline history (every stage change is recorded)
class OrderTimelineEvent(models.Model):
    STATUS_CHOICES = Order.STATUS_CHOICES

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="timeline")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES)
    note = models.CharField(max_length=255, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Order #{self.order_id} → {self.status}"


# ✅ NEW: Return Request Model
class ReturnRequest(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending Review"),
        ("approved", "Approved"),
        ("label_sent", "Return Label Sent"),
        ("received", "Items Received"),
        ("refunded", "Refunded"),
        ("rejected", "Rejected"),
    )

    REASON_CHOICES = (
        ("wrong_size", "Wrong Size"),
        ("defective", "Defective Product"),
        ("damaged", "Product Damaged in Transit"),
        ("wrong_item", "Wrong Item Received"),
        ("changed_mind", "Changed Mind"),
        ("quality_issues", "Product Quality Issues"),
        ("other", "Other"),
    )

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="return_requests")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="return_requests")
    
    # Items being returned (JSON field storing item IDs)
    item_ids = models.JSONField(default=list, help_text="List of OrderItem IDs being returned")
    
    # Return details
    reason = models.CharField(max_length=50, choices=REASON_CHOICES)
    details = models.TextField(blank=True, default="", help_text="Additional details about the return")
    
    # Status tracking
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default="pending")
    
    # Refund info
    refund_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    shipping_fee_deducted = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Return shipping
    return_tracking_number = models.CharField(max_length=100, blank=True, default="")
    
    # Admin notes
    admin_notes = models.TextField(blank=True, default="")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    refunded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Return Request #{self.id} - Order #{self.order_id}"


# ✅ NEW: Return Request Photos
class ReturnRequestPhoto(models.Model):
    return_request = models.ForeignKey(ReturnRequest, on_delete=models.CASCADE, related_name="photos")
    image = models.ImageField(upload_to="return_requests/%Y/%m/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo for Return Request #{self.return_request_id}"