from rest_framework import viewsets, generics, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Sum, Count, Q
from django.conf import settings
from django.utils import timezone
from django.contrib.auth import authenticate, login, logout
from django.core import signing
from datetime import timedelta
import calendar

from .models import Product, Order, Enquiry
from .serializers import ProductSerializer, OrderSerializer, EnquirySerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    Full CRUD ViewSet for Product Management.
    Returns active products for public users, all products for admin/management when ?all=true.
    Supports search, category filtering, and direct stock/active toggles.
    """
    serializer_class = ProductSerializer
    lookup_field = "slug"
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Product.objects.all()
        # If not requesting all products, default to active ones
        show_all = self.request.query_params.get("all") == "true" or self.request.user.is_staff
        if not show_all and self.action == "list":
            qs = qs.filter(is_active=True)

        category = self.request.query_params.get("category")
        if category and category != "all":
            qs = qs.filter(category=category)

        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(name_mr__icontains=search) |
                Q(description__icontains=search)
            )

        return qs

    @action(detail=True, methods=["post"])
    def toggle_active(self, request, slug=None):
        product = self.get_object()
        product.is_active = not product.is_active
        product.save(update_fields=["is_active", "updated_at"])
        return Response({"id": product.id, "name": product.name, "is_active": product.is_active})

    @action(detail=True, methods=["post"])
    def update_stock(self, request, slug=None):
        product = self.get_object()
        try:
            quantity = int(request.data.get("stock_quantity", product.stock_quantity))
            if quantity < 0:
                return Response({"error": "Stock cannot be negative."}, status=status.HTTP_400_BAD_REQUEST)
            product.stock_quantity = quantity
            product.save(update_fields=["stock_quantity", "updated_at"])
            return Response({"id": product.id, "name": product.name, "stock_quantity": product.stock_quantity})
        except (ValueError, TypeError):
            return Response({"error": "Invalid stock quantity provided."}, status=status.HTTP_400_BAD_REQUEST)


class OrderViewSet(viewsets.ModelViewSet):
    """
    Full CRUD ViewSet for Order Management.
    Supports filtering by status, payment method, date range, and customer search.
    Handles atomic stock deduction and restoration upon cancellation.
    """
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Order.objects.all().order_by("-created_at")

        order_status = self.request.query_params.get("status")
        if order_status and order_status != "all":
            qs = qs.filter(status=order_status)

        payment_method = self.request.query_params.get("payment_method")
        if payment_method and payment_method != "all":
            qs = qs.filter(payment_method=payment_method)

        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(order_number__icontains=search) |
                Q(customer_name__icontains=search) |
                Q(phone__icontains=search) |
                Q(email__icontains=search) |
                Q(city__icontains=search)
            )

        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")
        if start_date:
            qs = qs.filter(created_at__date__gte=start_date)
        if end_date:
            qs = qs.filter(created_at__date__lte=end_date)

        return qs

    def perform_create(self, serializer):
        with transaction.atomic():
            order = serializer.save()
            # Deduct stock for ordered items if available
            items = order.items if isinstance(order.items, list) else []
            for it in items:
                prod_id = it.get("id")
                qty = it.get("quantity") or it.get("qty", 1)
                if prod_id and qty:
                    try:
                        p = Product.objects.select_for_update().get(id=prod_id)
                        if p.stock_quantity >= qty:
                            p.stock_quantity -= qty
                            p.save(update_fields=["stock_quantity", "updated_at"])
                    except Product.DoesNotExist:
                        pass

    def perform_update(self, serializer):
        instance = serializer.instance
        old_status = instance.status
        new_status = serializer.validated_data.get("status", old_status)

        with transaction.atomic():
            order = serializer.save()

            # If order was cancelled from an active state, restore inventory
            if new_status == "cancelled" and old_status != "cancelled":
                items = order.items if isinstance(order.items, list) else []
                for it in items:
                    prod_id = it.get("id")
                    qty = it.get("quantity") or it.get("qty", 1)
                    if prod_id and qty:
                        try:
                            p = Product.objects.select_for_update().get(id=prod_id)
                            p.stock_quantity += qty
                            p.save(update_fields=["stock_quantity", "updated_at"])
                        except Product.DoesNotExist:
                            pass


class EnquiryViewSet(viewsets.ModelViewSet):
    """
    Full CRUD ViewSet for Customer Enquiries Management.
    Supports status updates (new, in_progress, resolved), internal notes, and search.
    """
    serializer_class = EnquirySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Enquiry.objects.all().order_by("-created_at")

        enquiry_status = self.request.query_params.get("status")
        if enquiry_status and enquiry_status != "all":
            qs = qs.filter(status=enquiry_status)

        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(phone__icontains=search) |
                Q(email__icontains=search) |
                Q(subject__icontains=search) |
                Q(message__icontains=search)
            )

        return qs


# Legacy views maintained for backwards compatibility
class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]


class EnquiryCreateView(generics.CreateAPIView):
    queryset = Enquiry.objects.all()
    serializer_class = EnquirySerializer
    permission_classes = [AllowAny]


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"status": "ok", "service": "Shiv Samarth Hapus API"})


@api_view(["POST"])
@permission_classes([AllowAny])
def create_payment_order(request):
    return Response({
        "configured": False,
        "message": "Payment gateway is not configured. Contact the site administrator."
    }, status=status.HTTP_503_SERVICE_UNAVAILABLE)


@api_view(["GET"])
@permission_classes([AllowAny])
def admin_summary(request):
    """
    Comprehensive Analytics API supporting:
    - Dynamic ranges: 7d, 30d, 90d, 1y (or ?days=N)
    - Total Revenue, Today's Revenue, MTD, Previous Month, and Growth Rate %
    - Average Order Value (AOV)
    - Full Order Pipeline Breakdown
    - Inventory Valuation & Low-Stock Alerts
    - Daily Timeline with Revenue & Volume Curves
    - Recent Orders & Enquiries
    """
    if not (getattr(settings, "DEBUG", False) or request.user.is_staff):
        return Response({"detail": "Authentication credentials required."}, status=status.HTTP_403_FORBIDDEN)

    now = timezone.now()
    today = now.date()

    # Determine date range filter
    range_param = request.query_params.get("range", "7d")
    days_map = {"7d": 7, "30d": 30, "90d": 90, "1y": 365}
    num_days = days_map.get(range_param)
    if not num_days:
        try:
            num_days = int(request.query_params.get("days", 7))
        except (ValueError, TypeError):
            num_days = 7

    # 1. Total Revenue (all-time non-cancelled orders)
    non_cancelled = Order.objects.exclude(status="cancelled")
    total_revenue = non_cancelled.aggregate(total=Sum("subtotal"))["total"] or 0
    non_cancelled_count = non_cancelled.count()
    avg_order_value = round(float(total_revenue) / non_cancelled_count, 2) if non_cancelled_count > 0 else 0

    # 2. Today's Revenue
    today_orders = non_cancelled.filter(created_at__date=today)
    today_revenue = today_orders.aggregate(total=Sum("subtotal"))["total"] or 0

    # 3. This Month Revenue (MTD)
    this_month_start = today.replace(day=1)
    this_month_orders = non_cancelled.filter(created_at__date__gte=this_month_start)
    this_month_revenue = this_month_orders.aggregate(total=Sum("subtotal"))["total"] or 0

    # 4. Previous Month Revenue
    if this_month_start.month == 1:
        prev_month_start = this_month_start.replace(year=this_month_start.year - 1, month=12, day=1)
    else:
        prev_month_start = this_month_start.replace(month=this_month_start.month - 1, day=1)

    prev_month_end = this_month_start - timedelta(days=1)
    prev_month_orders = non_cancelled.filter(
        created_at__date__gte=prev_month_start,
        created_at__date__lte=prev_month_end
    )
    prev_month_revenue = prev_month_orders.aggregate(total=Sum("subtotal"))["total"] or 0

    # 5. Month-over-Month Revenue Growth Percentage
    if prev_month_revenue > 0:
        revenue_growth_pct = round(((float(this_month_revenue) - float(prev_month_revenue)) / float(prev_month_revenue)) * 100, 1)
    else:
        revenue_growth_pct = 100.0 if this_month_revenue > 0 else 0.0

    # 6. Order Status Distribution
    status_counts = {}
    for st, _ in Order.STATUS_CHOICES:
        status_counts[st] = Order.objects.filter(status=st).count()

    # 7. Payment Methods Breakdown
    payment_counts = {
        "whatsapp": Order.objects.filter(payment_method="whatsapp").count(),
        "gateway": Order.objects.filter(payment_method="gateway").count(),
    }

    # 8. Inventory & Stock Valuation
    all_products = Product.objects.all()
    inventory = []
    total_inventory_value = 0
    low_stock_count = 0
    out_of_stock_count = 0

    for p in all_products:
        item_val = float(p.price) * p.stock_quantity
        total_inventory_value += item_val
        if p.stock_quantity == 0:
            out_of_stock_count += 1
        elif p.stock_quantity <= 15:
            low_stock_count += 1

        inventory.append({
            "id": p.id,
            "name": p.name,
            "category": p.get_category_display(),
            "stock": p.stock_quantity,
            "price": float(p.price),
            "is_active": p.is_active,
            "total_value": item_val,
        })

    # 9. Dynamic Timeline Trend (Daily breakdown for num_days)
    timeline = []
    # If range is 1 year (365 days), group by month or sample intervals to keep chart readable
    if num_days <= 90:
        for i in range(num_days - 1, -1, -1):
            day = today - timedelta(days=i)
            day_orders = Order.objects.filter(created_at__date=day)
            day_rev = day_orders.exclude(status="cancelled").aggregate(total=Sum("subtotal"))["total"] or 0
            timeline.append({
                "date": day.strftime("%b %d"),
                "raw_date": day.isoformat(),
                "orders": day_orders.count(),
                "revenue": float(day_rev),
            })
    else:
        # Group by 12 months for 1y
        for i in range(11, -1, -1):
            # calculate year and month
            m = today.month - i
            y = today.year
            while m <= 0:
                m += 12
                y -= 1
            month_orders = Order.objects.filter(created_at__year=y, created_at__month=m)
            month_rev = month_orders.exclude(status="cancelled").aggregate(total=Sum("subtotal"))["total"] or 0
            month_name = calendar.month_abbr[m]
            timeline.append({
                "date": f"{month_name} '{str(y)[-2:]}",
                "raw_date": f"{y}-{m:02d}",
                "orders": month_orders.count(),
                "revenue": float(month_rev),
            })

    # 10. Recent Orders
    recent_orders = [
        {
            "id": o.id,
            "order_number": o.order_number,
            "customer_name": o.customer_name,
            "phone": o.phone,
            "subtotal": float(o.subtotal),
            "status": o.status,
            "payment_method": o.payment_method,
            "created_at": o.created_at.strftime("%d %b %Y, %I:%M %p"),
        }
        for o in Order.objects.order_by("-created_at")[:6]
    ]

    # 11. Recent Enquiries
    recent_enquiries = [
        {
            "id": e.id,
            "name": e.name,
            "phone": e.phone,
            "email": e.email,
            "subject": e.subject,
            "message": e.message[:80] + ("..." if len(e.message) > 80 else ""),
            "status": e.status,
            "created_at": e.created_at.strftime("%d %b %Y, %I:%M %p"),
        }
        for e in Enquiry.objects.order_by("-created_at")[:6]
    ]

    return Response({
        "products": Product.objects.count(),
        "active_products": Product.objects.filter(is_active=True).count(),
        "orders": Order.objects.count(),
        "new_orders": Order.objects.filter(status="new").count(),
        "enquiries": Enquiry.objects.count(),
        "new_enquiries": Enquiry.objects.filter(status="new").count(),
        "total_revenue": float(total_revenue),
        "today_revenue": float(today_revenue),
        "this_month_revenue": float(this_month_revenue),
        "prev_month_revenue": float(prev_month_revenue),
        "revenue_growth_pct": revenue_growth_pct,
        "avg_order_value": avg_order_value,
        "order_status_distribution": status_counts,
        "payment_method_distribution": payment_counts,
        "inventory": inventory,
        "total_inventory_value": total_inventory_value,
        "low_stock_count": low_stock_count,
        "out_of_stock_count": out_of_stock_count,
        "timeline": timeline,
        "recent_orders": recent_orders,
        "recent_enquiries": recent_enquiries,
        "range": range_param,
        "is_authenticated": request.user.is_authenticated,
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def admin_login(request):
    """
    Authenticate admin credentials and return a signed session token.
    Restricted to staff/superuser accounts.
    """
    username = request.data.get("username", "").strip()
    password = request.data.get("password", "")

    if not username or not password:
        return Response(
            {"success": False, "error": "Username and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response(
            {"success": False, "error": "Invalid username or password. Access denied."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.is_active:
        return Response(
            {"success": False, "error": "This admin account has been deactivated."},
            status=status.HTTP_403_FORBIDDEN
        )

    if not (user.is_staff or user.is_superuser):
        return Response(
            {"success": False, "error": "Access denied. Admin privileges required."},
            status=status.HTTP_403_FORBIDDEN
        )

    login(request, user)
    token = signing.dumps({
        "user_id": user.id,
        "username": user.username,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
    }, salt="shivsamarth-admin-auth")

    return Response({
        "success": True,
        "message": "Authentication successful.",
        "username": user.username,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
        "token": token,
    })


@api_view(["GET"])
@permission_classes([AllowAny])
def admin_verify(request):
    """
    Verify whether the provided token or session is a valid logged-in admin.
    """
    auth_header = request.headers.get("Authorization", "")
    token = None
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1].strip()

    if not token:
        token = request.query_params.get("token", "")

    if token:
        try:
            data = signing.loads(token, salt="shivsamarth-admin-auth", max_age=86400 * 7)
            return Response({
                "authenticated": True,
                "username": data.get("username"),
                "is_staff": data.get("is_staff", True),
                "is_superuser": data.get("is_superuser", False),
            })
        except (signing.BadSignature, signing.SignatureExpired):
            return Response({"authenticated": False, "error": "Session expired or invalid."}, status=status.HTTP_401_UNAUTHORIZED)

    if request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser):
        return Response({
            "authenticated": True,
            "username": request.user.username,
            "is_staff": request.user.is_staff,
            "is_superuser": request.user.is_superuser,
        })

    return Response({"authenticated": False}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
@permission_classes([AllowAny])
def admin_logout(request):
    """
    Logs out the current admin session.
    """
    logout(request)
    return Response({"success": True, "message": "Logged out successfully."})
