"use client";

import { useState } from "react";
import { useStore } from "@/components/StoreProvider";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { ShoppingCart, Award, CheckCircle2, ShieldCheck, ArrowLeft, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import ProductImageSlider from "@/components/ProductImageSlider";

export default function ProductDetail({ p }: { p: any }) {
  const s = useStore();
  const isMr = s.lang === "mr";

  // Units
  const availableUnits: string[] =
    Array.isArray(p.available_units) && p.available_units.length > 0
      ? p.available_units
      : ["box", "dozen", "grams", "kg"];

  const [selectedUnit, setSelectedUnit] = useState<string>(availableUnits[0] || "box");
  const [added, setAdded] = useState(false);

  const basePrice = Number(p.price) || 2400;
  const weightKg = Number(p.weight_kg) || 5;

  const getUnitPrice = (unit: string): number => {
    if (p.unit_prices && typeof p.unit_prices[unit] === "number" && p.unit_prices[unit] > 0) {
      return p.unit_prices[unit];
    }
    switch (unit) {
      case "dozen":
        return Math.round(basePrice * 0.6);
      case "grams":
      case "500g":
        return Math.round((basePrice / weightKg) * 0.5);
      case "kg":
      case "1kg":
        return Math.round(basePrice / weightKg);
      case "box":
      default:
        return basePrice;
    }
  };

  const getUnitLabel = (unit: string): string => {
    switch (unit) {
      case "dozen":
        return isMr ? "१ डझन (12 नग)" : "1 Dozen (12 mangoes)";
      case "grams":
      case "500g":
        return isMr ? "५०० ग्रॅम (Grams)" : "500 Grams Pack";
      case "kg":
      case "1kg":
        return isMr ? "१ किलो (Kg)" : "1 Kilogram";
      case "box":
      default:
        return isMr ? `${weightKg} किलो पेटी (Box)` : `${weightKg}kg Box`;
    }
  };

  const currentPrice = getUnitPrice(selectedUnit);
  const currentUnitLabel = getUnitLabel(selectedUnit);

  const handleAddToCart = () => {
    s.add(p, selectedUnit, currentPrice, currentUnitLabel);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    isMr
      ? `नमस्कार! मला शिवसमर्थ देवगड बागेतून "${p.name_mr || p.name}" - ${currentUnitLabel} (दर: ₹${currentPrice.toLocaleString("en-IN")}) थेट व्हॉट्सॲपवर १-क्लिक ऑर्डर करायचे आहे. कृपया बँक / UPI तपशील पाठवा.`
      : `Hello! I would like to order "${p.name}" - ${currentUnitLabel} (₹${currentPrice.toLocaleString("en-IN")}) direct from Devgad farm. Please share payment details.`
  )}`;

  return (
    <main className="container section" style={{ paddingBottom: 60, maxWidth: 1100 }}>
      <div style={{ marginBottom: 20 }}>
        <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
          <ArrowLeft size={16} /> {isMr ? "मागे (सर्व उत्पादने)" : "Back to All Products"}
        </Link>
      </div>

      <div className="story-grid" style={{ alignItems: "start", gap: 44 }}>
        {/* Left Column: Interactive Product Photo Slider */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              borderRadius: 24,
              overflow: "hidden",
              border: "1.5px solid rgba(200, 154, 75, 0.35)",
              background: "#fff",
              boxShadow: "0 14px 40px rgba(0,0,0,0.06)",
              position: "relative",
            }}
          >
            <ProductImageSlider
              images={p.images && p.images.length > 0 ? p.images : [p.image_url]}
              fallbackImage={p.image_url || "/images/devgad-hapus.jpg"}
              alt={p.name}
              aspectRatio="4 / 3"
            />
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                background: "rgba(23, 43, 32, 0.9)",
                color: "#ecd599",
                padding: "5px 12px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(200, 154, 75, 0.4)",
                pointerEvents: "none",
                zIndex: 4,
              }}
            >
              🍃 {isMr ? "अस्सल देवगड नारिंग्रे बाग" : "100% Genuine Devgad Farm"}
            </div>
          </div>
        </div>

        <div>
          <div className="eyebrow" style={{ color: "var(--gold)" }}>
            {isMr ? "॥ शिवसमर्थ देवगड हापूस ॥" : "Shiv Samarth Devgad Hapus"}
          </div>
          <h1 className="serif" style={{ fontSize: "clamp(30px, 4vw, 42px)", margin: "8px 0 12px", color: "var(--green)" }}>
            {isMr && p.name_mr ? p.name_mr : p.name}
          </h1>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 20 }}>
            <span className="pill" style={{ background: "rgba(33, 70, 56, 0.1)", color: "var(--green)" }}>
              ✓ {isMr ? "१००% सेंद्रिय व नैसर्गिक" : "100% Organic & Natural"}
            </span>
            <span className="pill" style={{ background: "rgba(200, 154, 75, 0.15)", color: "var(--gold)" }}>
              ✓ {isMr ? "GI Tag प्रमाणित" : "GI Tag Certified"}
            </span>
          </div>

          {/* UNIT SELECTION OPTION (Dozen, Grams, Box, Kg) */}
          <div
            style={{
              background: "#faf6ed",
              border: "1px solid #e8dbca",
              borderRadius: 16,
              padding: "16px 18px",
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {isMr ? "प्रमाण / एकक निवडा (Select Unit):" : "Select Unit / Quantity Type:"}
              </span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "var(--gold)" }}>{currentUnitLabel}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(75px, 1fr))", gap: 8 }}>
              {availableUnits.map((u) => {
                const isActive = selectedUnit === u;
                const priceForUnit = getUnitPrice(u);
                const title =
                  u === "dozen"
                    ? (isMr ? "डझन" : "Dozen")
                    : u === "grams" || u === "500g"
                    ? (isMr ? "५०० ग्रॅम" : "500g")
                    : u === "kg" || u === "1kg"
                    ? (isMr ? "१ किलो" : "1 Kg")
                    : (isMr ? "पेटी (Box)" : "Box");

                return (
                  <button
                    key={u}
                    onClick={() => setSelectedUnit(u)}
                    style={{
                      padding: "10px 8px",
                      borderRadius: 10,
                      border: "1.5px solid",
                      borderColor: isActive ? "var(--green)" : "#e0d4c1",
                      background: isActive ? "var(--green)" : "#fff",
                      color: isActive ? "#fff" : "var(--text)",
                      cursor: "pointer",
                      textAlign: "center",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
                    <div style={{ fontSize: 11, opacity: isActive ? 0.9 : 0.7, marginTop: 2 }}>
                      ₹{priceForUnit.toLocaleString("en-IN")}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 18 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 800, color: "var(--green)" }}>
              ₹{currentPrice.toLocaleString("en-IN")}
            </span>
            <span style={{ fontSize: 14, color: "var(--muted)", fontWeight: 600 }}>/ {currentUnitLabel}</span>
          </div>

          <p className="story-copy" style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
            {isMr && p.description_mr ? p.description_mr : p.description}
          </p>

          <div style={{ padding: "14px 18px", background: "var(--soft)", borderRadius: 14, marginBottom: 24, fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
            <div style={{ fontWeight: 700, color: "var(--green)", marginBottom: 4 }}>
              {isMr ? "✓ नारिंग्रे, देवगड बागेतून थेट पाठवणी" : "✓ Direct Dispatch from Naringre, Devgad"}
            </div>
            {isMr
              ? "पारंपरिक गवताच्या आडीत पिकवून सुरक्षित बॉक्समध्ये थेट आपल्या दारात पोहोचवले जाईल."
              : "Naturally straw-ripened and dispatched in specialized protective packaging directly to your home."}
          </div>

          <div className="actions" style={{ gap: 14, display: "flex", flexWrap: "wrap" }}>
            <button
              className="btn gold"
              onClick={handleAddToCart}
              style={{ padding: "14px 28px", fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              {added ? <Check size={18} /> : <ShoppingCart size={18} />}
              <span>{added ? (isMr ? "जोडले! ✓" : "Added! ✓") : (isMr ? `कार्टमध्ये जोडा (${currentUnitLabel})` : `Add to Cart (${currentUnitLabel})`)}</span>
            </button>

            <a
              className="btn secondary"
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "14px 24px",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(28, 155, 88, 0.12)",
                border: "1.5px solid #1c9b58",
                color: "#15803d",
                textDecoration: "none",
                fontWeight: 700,
                borderRadius: 12,
              }}
            >
              <span>💬</span>
              <span>{isMr ? "व्हॉट्सॲपवर १-क्लिक ऑर्डर" : "1-Click WhatsApp Order"}</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
