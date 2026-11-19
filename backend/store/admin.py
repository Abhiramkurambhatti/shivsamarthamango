from django.contrib import admin
from .models import Product, Order, Enquiry

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "weight_kg", "price", "stock_quantity", "is_active", "is_featured")
    list_filter = ("category", "is_active", "is_featured")
    search_fields = ("name", "name_mr", "slug")
    prepopulated_fields = {"slug": ("name",)}

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("order_number", "customer_name", "phone", "subtotal", "payment_method", "status", "courier_name", "tracking_number", "created_at")
    list_filter = ("status", "payment_method", "created_at")
    search_fields = ("order_number", "customer_name", "phone", "email", "tracking_number")
    readonly_fields = ("order_number", "created_at")

@admin.register(Enquiry)
class EnquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "email", "subject", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("name", "phone", "email", "subject", "message")
