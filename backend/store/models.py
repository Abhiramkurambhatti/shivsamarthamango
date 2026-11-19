from django.db import models
from django.utils.text import slugify

class Product(models.Model):
    CATEGORY_CHOICES = [("hapus", "Hapus"), ("other", "Other mango"), ("gift", "Gift box")]
    name = models.CharField(max_length=180)
    name_mr = models.CharField(max_length=180, blank=True)
    slug = models.SlugField(unique=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="hapus")
    description = models.TextField(blank=True)
    description_mr = models.TextField(blank=True)
    weight_kg = models.DecimalField(max_digits=6, decimal_places=2, default=5)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    image_url = models.CharField(max_length=500, blank=True)
    available_units = models.JSONField(default=list, blank=True, help_text='List of allowed units, e.g. ["box","dozen","kg","500g","250g"]')
    unit_prices = models.JSONField(default=dict, blank=True, help_text='Per-unit pricing, e.g. {"dozen": 2400, "500g": 600}')
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_featured", "name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ("new", "New"), ("confirmed", "Confirmed"), ("processing", "Processing"),
        ("shipped", "Shipped"), ("completed", "Completed"), ("cancelled", "Cancelled"),
    ]
    PAYMENT_CHOICES = [("whatsapp", "WhatsApp"), ("gateway", "Online gateway")]
    order_number = models.CharField(max_length=24, unique=True, blank=True)
    customer_name = models.CharField(max_length=160)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    items = models.JSONField(default=list)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    notes = models.TextField(blank=True)
    courier_name = models.CharField(max_length=100, blank=True)
    tracking_number = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.order_number:
            import uuid
            self.order_number = "SSH-" + uuid.uuid4().hex[:8].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.order_number

class Enquiry(models.Model):
    STATUS_CHOICES = [
        ("new", "New"),
        ("in_progress", "In Progress"),
        ("resolved", "Resolved"),
    ]
    name = models.CharField(max_length=160)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name
