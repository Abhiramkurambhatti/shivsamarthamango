# ॥ शिवसमर्थ ॥ Devgad Alphonso Farm — Full-Stack E-Commerce Platform

> **Authentic GI-Tagged Devgad Hapus Direct From 20-Acre Coastal Orchard in Naringre, Sindhudurg, Maharashtra.**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Django](https://img.shields.io/badge/Backend-Django%205%20%2B%20DRF-092E20?style=flat-square&logo=django)](https://www.djangoproject.com/)
[![License](https://img.shields.io/badge/License-Proprietary-gold?style=flat-square)](#)

---

## 🌟 Key Features

### 1. Customer Storefront
- **3D Scrollytelling Hero Experience:** Interactive 240-frame 3D mango rotation on scroll with instant poster fallback.
- **Bilingual Interface:** Instant **मराठी ⇄ English** toggle throughout the entire store.
- **Founder's Authentic Narrative ("माझे मनोगत"):** Full story of establishing the 20-acre organic orchard in Naringre, Devgad.
- **Dignitaries & VIP Trust Showcase:** Verified photo cards presenting the official peti to Union Ministers Hon. Shri Shivraj Singh Chouhan, Hon. Shri Kiren Rijiju, and Hon. Shri Murlidhar Mohol (Minister of State for Civil Aviation & Cooperation).
- **Interactive Peti Customizer & Size Selector:** Choose between 1 Dozen (12), 2 Dozen (24, Most Popular), and 4 Dozen (48 Heritage Wooden Box) with live price and savings calculation.
- **Pincode Delivery Estimator:** Real-time delivery transit check for any 6-digit Indian PIN code (24-36 hrs for Pune/Mumbai; 48 hrs for Maharashtra; express air cargo for national metros).
- **"Devgad Hapus vs Other Mangoes" Comparison:** 6-point criteria matrix comparing soil terroir, straw ripening, skin thickness, room-filling aroma, fiber-free pulp, and GI-tag certification.
- **Customer Reviews & Testimonials Photo Wall:** 5-star ratings and verified buyer testimonials from Pune, Mumbai, Navi Mumbai, and Bengaluru.
- **1-Click WhatsApp Quick Order:** Instant order button on all product cards pre-filling order specs to WhatsApp (+91 95520 50093).
- **Gift a Peti Mode on Checkout:** Send custom greeting postcards inside the mango box with options to hide invoice pricing.
- **Live Customer Order Tracking (`/track-order`):** 4-step live visual progress tracker (Order Confirmed → Straw Ripening → Packed & Dispatched → Delivered).

### 2. Confidential Admin Dashboard (`/admin-dashboard`)
- **Encrypted Security Gate:** Protected with username/password authentication; no confidential revenue or customer data is exposed without authorized login.
- **Business KPI Cards:** Real-time Total Revenue, Total Orders, Active Catalog, and Customer Enquiries.
- **Revenue Analytics & Charts:** Daily revenue bar chart and order volume trendline with 7D, 30D, 90D, and 1Y filters.
- **Order Pipeline Distribution:** Visual donut chart of order stages (New, Confirmed, Processing, Shipped, Completed, Cancelled).
- **Dedicated Management Tabs:**
  - Product Management (CRUD, toggle availability, update stock, low stock alerts)
  - Order Management (View full address, ordered petis, transition order status)
  - Customer Enquiries (Follow up on customer inquiries)
  - Inventory & Stock Valuation
- **1-Click Customer WhatsApp Dispatch Notification:** Automatically open WhatsApp with pre-drafted dispatch message and courier tracking number.
- **Printable 4×6 Box Shipping Labels:** 1-click printable thermal dispatch slips with barcode, GI-tag seal, sender farm address, and recipient details.
- **1-Click CSV Export:** Export all customer orders and contact details to CSV for dispatch logistics and accounting.

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, React, Lucide Icons, Canvas API, CSS Variables.
- **Backend:** Django 5, Django REST Framework, SQLite (Local Dev) / PostgreSQL (Production Ready).
- **Authentication:** Django Authentication + Cryptographically signed tokens.
- **Contact Channels:** WhatsApp Direct API, Email, Phone Integration.

---

## 📞 Official Contact Credentials

- **WhatsApp & Phone:** `+91 95520 50093` (`9552050093`)
- **Email Address:** `shivsamartha@gmail.com`
- **Farm Location:** Shewale Agro Farm, Naringre, Taluka Devgad, District Sindhudurg, Maharashtra - 416613.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+ (or Python 3.12)

### 1. Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```
*Backend API will run at `http://127.0.0.1:8000/api/`*

### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run build
npm run start
```
*Frontend will run at `http://localhost:3000/`*

---

## 🔐 Admin Portal Credentials

- **URL:** [http://localhost:3000/admin-dashboard](http://localhost:3000/admin-dashboard)
- **Username:** `admin`
- **Password:** `admin123`
- **Django Admin (Advanced Model Control):** `http://localhost:8000/admin/`

---

## 📂 Project Structure

```
├── backend/
│   ├── config/              # Django settings & URL routing
│   ├── store/               # Store app: models, views, serializers, APIs
│   ├── db.sqlite3           # Pre-seeded database with products, orders & admin
│   └── requirements.txt
├── frontend/
│   ├── app/                 # Next.js App Router (pages: /, /shop, /checkout, /track-order, etc.)
│   ├── components/          # React components (3D Hero, PetiCustomizer, PincodeEstimator, etc.)
│   ├── lib/                 # Config & Marathi/English translations
│   └── public/              # Farm photography, 3D mango frames, icons
├── downloads/               # Raw asset archives & Google Drive originals
├── docker-compose.yml       # Production docker orchestration
└── README.md
```

---

## 📜 Copyright & Origin

**॥ शिवसमर्थ ॥ देवगड हापूस**  
All Rights Reserved © Shewale Agro Farm, Naringre, Devgad.
