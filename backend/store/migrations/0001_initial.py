from django.db import migrations, models

class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="Enquiry",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=160)),
                ("phone", models.CharField(blank=True, max_length=20)),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("message", models.TextField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="Order",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("order_number", models.CharField(blank=True, max_length=24, unique=True)),
                ("customer_name", models.CharField(max_length=160)),
                ("phone", models.CharField(max_length=20)),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("address", models.TextField()),
                ("city", models.CharField(max_length=100)),
                ("pincode", models.CharField(max_length=10)),
                ("items", models.JSONField(default=list)),
                ("subtotal", models.DecimalField(decimal_places=2, max_digits=10)),
                ("payment_method", models.CharField(choices=[("whatsapp", "WhatsApp"), ("gateway", "Online gateway")], max_length=20)),
                ("status", models.CharField(choices=[("new", "New"), ("confirmed", "Confirmed"), ("processing", "Processing"), ("shipped", "Shipped"), ("completed", "Completed"), ("cancelled", "Cancelled")], default="new", max_length=20)),
                ("notes", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=180)),
                ("name_mr", models.CharField(blank=True, max_length=180)),
                ("slug", models.SlugField(blank=True, unique=True)),
                ("category", models.CharField(choices=[("hapus", "Hapus"), ("other", "Other mango"), ("gift", "Gift box")], default="hapus", max_length=20)),
                ("description", models.TextField(blank=True)),
                ("description_mr", models.TextField(blank=True)),
                ("weight_kg", models.DecimalField(decimal_places=2, default=5, max_digits=6)),
                ("price", models.DecimalField(decimal_places=2, max_digits=10)),
                ("compare_at_price", models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ("stock_quantity", models.PositiveIntegerField(default=0)),
                ("image_url", models.URLField(blank=True)),
                ("is_featured", models.BooleanField(default=False)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ["-is_featured", "name"]},
        ),
    ]
