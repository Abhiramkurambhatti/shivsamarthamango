from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    OrderViewSet,
    EnquiryViewSet,
    OrderCreateView,
    EnquiryCreateView,
    health,
    create_payment_order,
    admin_summary,
    admin_login,
    admin_verify,
    admin_logout,
    upload_product_image,
)

router = DefaultRouter()
router.register("products", ProductViewSet, basename="product")
router.register("orders", OrderViewSet, basename="order")
router.register("enquiries", EnquiryViewSet, basename="enquiry")

urlpatterns = [
    path("", include(router.urls)),
    path("health/", health, name="health"),
    path("payments/create-order/", create_payment_order, name="payment-create"),
    path("upload/product-image/", upload_product_image, name="upload-product-image"),
    path("upload/image/", upload_product_image, name="upload-image"),
    path("admin/summary/", admin_summary, name="admin-summary"),
    path("admin/login/", admin_login, name="admin-login"),
    path("admin/verify/", admin_verify, name="admin-verify"),
    path("admin/logout/", admin_logout, name="admin-logout"),
]
