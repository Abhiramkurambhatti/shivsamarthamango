from django.core.management.base import BaseCommand
from store.models import Product, Order, Enquiry
from django.utils import timezone
from datetime import timedelta
import random

class Command(BaseCommand):
    help = "Create illustrative demo products, orders and enquiries."
    def handle(self, *args, **options):
        demo = [
            ("Devgad Hapus Alphonso", "देवगड हापूस", "hapus", 5, 2400, 24,
             "Authentic GI-tagged Devgad Alphonso. Hand-picked from coastal laterite soil orchards with rich golden aroma.",
             "/images/devgad-hapus.jpg"),
            ("Ratnagiri Hapus", "रत्नागिरी हापूस", "hapus", 5, 2200, 18,
             "Classic Konkan Ratnagiri Alphonso with sweet tender pulp, naturally ripened in hay.",
             "/images/ratnagiri-hapus.jpg"),
            ("Kesar Mango", "केसर आंबा", "other", 3, 950, 32,
             "Fragrant golden-saffron Kesar mangoes known for intense natural sweetness and distinct aroma.",
             "/images/kesar-mango.jpg"),
            ("Mango Gift Box", "आंबा गिफ्ट बॉक्स", "gift", 3, 1800, 14,
             "Traditional wooden peti packed with farm-fresh handpicked Alphonso in natural paddy straw.",
             "/images/gift-box.jpg")
        ]
        for name, mr, cat, weight, price, stock, desc, img in demo:
            Product.objects.update_or_create(
                slug=name.lower().replace(" ", "-"),
                defaults={"name": name, "name_mr": mr, "category": cat, "weight_kg": weight,
                          "price": price, "stock_quantity": stock, "description": desc,
                          "image_url": img,
                          "is_active": True, "is_featured": True}
            )

        # Seed sample orders if fewer than 5 exist
        if Order.objects.count() < 5:
            now = timezone.now()
            sample_orders = [
                ("Pratik Sawant", "9820011223", "pratik@example.com", "Bandra West", "Mumbai", "400050", 4800, "whatsapp", "completed", 6),
                ("Sneha Kulkarni", "9819922334", "sneha@example.com", "Kothrud", "Pune", "411038", 2400, "gateway", "shipped", 4),
                ("Rajesh Deshmukh", "9833344556", "rajesh@example.com", "Dadar", "Mumbai", "400028", 7200, "whatsapp", "processing", 3),
                ("Ananya Joshi", "9876500112", "ananya@example.com", "Naupada", "Thane", "400602", 2200, "gateway", "confirmed", 1),
                ("Vikas Shinde", "9867011223", "vikas@example.com", "Vashi", "Navi Mumbai", "400703", 3600, "whatsapp", "new", 0),
            ]
            for name, phone, email, addr, city, pin, amt, method, st, days_ago in sample_orders:
                order = Order.objects.create(
                    customer_name=name,
                    phone=phone,
                    email=email,
                    address=addr,
                    city=city,
                    pincode=pin,
                    subtotal=amt,
                    payment_method=method,
                    status=st,
                    items=[{"name": "Devgad Hapus Alphonso", "qty": max(1, amt // 2400), "price": 2400}]
                )
                order.created_at = now - timedelta(days=days_ago, hours=random.randint(1, 8))
                order.save()

        # Seed sample enquiry if none exist
        if Enquiry.objects.count() == 0:
            Enquiry.objects.create(
                name="Siddhesh Patil",
                phone="9892011234",
                email="siddhesh@example.com",
                message="Interested in bulk delivery of 25 boxes of Devgad Alphonso for corporate gifting in Mumbai."
            )

        self.stdout.write(self.style.SUCCESS("Demo products, sample orders and enquiries verified."))
