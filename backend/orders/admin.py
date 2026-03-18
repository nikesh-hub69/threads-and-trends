# orders/admin.py
from django.contrib import admin # type: ignore
from .models import Order, OrderItem, OrderTimelineEvent, ReturnRequest, ReturnRequestPhoto


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


class OrderTimelineInline(admin.TabularInline):
    model = OrderTimelineEvent
    extra = 0
    readonly_fields = ("status", "note", "created_at")
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "payment_method",
        "status",
        "subtotal",
        "points_discount",
        "total",
        "created_at",
    )

    list_filter = (
        "status",
        "payment_method",
        "created_at",
    )

    search_fields = ("id", "user__email", "full_name", "phone")
    ordering = ("-created_at",)

    inlines = [OrderItemInline, OrderTimelineInline]


@admin.register(OrderTimelineEvent)
class OrderTimelineEventAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "status", "note", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("order__id", "order__user__email", "note")
    ordering = ("created_at",)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "name", "qty", "price", "size")
    search_fields = ("order__id", "name")


# ✅ NEW: Return Request Admin

class ReturnRequestPhotoInline(admin.TabularInline):
    model = ReturnRequestPhoto
    extra = 0
    readonly_fields = ("image", "uploaded_at")
    can_delete = True


@admin.register(ReturnRequest)
class ReturnRequestAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "user",
        "reason",
        "status",
        "refund_amount",
        "shipping_fee_deducted",
        "created_at",
    )

    list_filter = (
        "status",
        "reason",
        "created_at",
    )

    search_fields = (
        "id",
        "order__id",
        "user__email",
        "details",
    )

    readonly_fields = (
        "user",
        "order",
        "item_ids",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        ("Return Information", {
            "fields": (
                "order",
                "user",
                "item_ids",
                "reason",
                "details",
            )
        }),
        ("Status & Processing", {
            "fields": (
                "status",
                "admin_notes",
                "return_tracking_number",
            )
        }),
        ("Financial Details", {
            "fields": (
                "refund_amount",
                "shipping_fee_deducted",
            )
        }),
        ("Timestamps", {
            "fields": (
                "created_at",
                "updated_at",
                "approved_at",
                "refunded_at",
            )
        }),
    )

    inlines = [ReturnRequestPhotoInline]

    ordering = ("-created_at",)

    actions = ["approve_returns", "mark_as_refunded"]

    def approve_returns(self, request, queryset):
        """Bulk approve return requests"""
        from django.utils import timezone # type: ignore
        updated = queryset.filter(status="pending").update(
            status="approved",
            approved_at=timezone.now()
        )
        self.message_user(request, f"{updated} return request(s) approved.")
    approve_returns.short_description = "Approve selected return requests"

    def mark_as_refunded(self, request, queryset):
        """Bulk mark returns as refunded"""
        from django.utils import timezone # type: ignore
        updated = queryset.exclude(status__in=["refunded", "rejected"]).update(
            status="refunded",
            refunded_at=timezone.now()
        )
        self.message_user(request, f"{updated} return request(s) marked as refunded.")
    mark_as_refunded.short_description = "Mark selected returns as refunded"


@admin.register(ReturnRequestPhoto)
class ReturnRequestPhotoAdmin(admin.ModelAdmin):
    list_display = ("id", "return_request", "uploaded_at")
    list_filter = ("uploaded_at",)
    search_fields = ("return_request__id",)
    readonly_fields = ("image", "uploaded_at")