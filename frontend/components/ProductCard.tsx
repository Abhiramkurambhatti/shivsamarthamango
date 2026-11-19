"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, ShieldCheck, Check, Sparkles, MessageCircle, Info } from "lucide-react";
import { useStore } from "./StoreProvider";
import { WHATSAPP_NUMBER } from "@/lib/config";
import ProductImageSlider from "./ProductImageSlider";

interface ProductCardProps {
  p: any;
}

export default function ProductCard({ p }: ProductCardProps) {
  const s = useStore();
  const mr = s.lang === "mr";

  // Determine available units (fallback to standard units if none configured)
  const availableUnits: string[] =
    Array.isArray(p.available_units) && p.available_units.length > 0
      ? p.available_units
      : ["box", "dozen", "grams", "kg"];

  // Default active unit
  const [selectedUnit, setSelectedUnit] = useState<string>(availableUnits[0] || "box");

  // Per-unit price calculations
  const basePrice = Number(p.price) || 2400;
  const weightKg = Number(p.weight_kg) || 5;

  const getUnitPrice = (unit: string): number => {
    if (p.unit_prices && typeof p.unit_prices[unit] === "number" && p.unit_prices[unit] > 0) {
      return p.unit_prices[unit];
    }
    // Dynamic default calculations if custom unit_prices not set
    switch (unit) {
      case "dozen":
        // 1 dozen (approx 12 mangoes, ~3-3.5kg)
        return Math.round(basePrice * 0.6);
      case "grams":
      case "500g":
        // 500 grams trial / sampling box
        return Math.round((basePrice / weightKg) * 0.5);
      case "kg":
      case "1kg":
        // 1 kilogram
        return Math.round(basePrice / weightKg);
      case "box":
      default:
        return basePrice;
    }
  };

  const getUnitLabel = (unit: string): string => {
    switch (unit) {
      case "dozen":
        return mr ? "१ डझन (12 नग)" : "1 Dozen (12 pcs)";
      case "grams":
      case "500g":
        return mr ? "५०० ग्रॅम (Grams)" : "500 Grams";
      case "kg":
      case "1kg":
        return mr ? "१ किलो (Kg)" : "1 Kilogram";
      case "box":
      default:
        return mr ? `${weightKg} किलो पेटी (Box)` : `${weightKg}kg Peti (Box)`;
    }
  };

  const currentPrice = getUnitPrice(selectedUnit);
  const currentUnitLabel = getUnitLabel(selectedUnit);

  const [addedNotice, setAddedNotice] = useState(false);

  const handleAddToCart = () => {
    s.add(p, selectedUnit, currentPrice, currentUnitLabel);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const waText = encodeURIComponent(
    mr
      ? `नमस्कार! मला शिवसमर्थ देवगड हापूस बागेतून "${p.name_mr || p.name}" - ${currentUnitLabel} (दर: ₹${currentPrice.toLocaleString("en-IN")}) थेट व्हॉट्सॲपवर १-क्लिक ऑर्डर करायचे आहे. कृपया बँक तपशील / UPI QR पाठवा.`
      : `Hello! I would like to place a 1-click WhatsApp order for "${p.name}" - ${currentUnitLabel} (Rate: ₹${currentPrice.toLocaleString("en-IN")}). Please share UPI/Bank payment details.`
  );

  return (
    <article
      className="product-card-enhanced"
      style={{
        background: "#ffffff",
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid rgba(200, 154, 75, 0.25)",
        boxShadow: "0 6px 24px rgba(23, 43, 32, 0.05), 0 1px 3px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease",
        position: "relative",
      }}
    >
      {/* Product Image Slider Container with Natural Photo Enhancement */}
      <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        <Link href={`/product/${p.slug}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
          <ProductImageSlider
            images={p.images && p.images.length > 0 ? p.images : [p.image_url]}
            fallbackImage={p.image_url || "/images/devgad-hapus.jpg"}
            alt={p.name}
            aspectRatio="4 / 3"
          />
        </Link>

        {/* Authentic GI Tag / Harvest Badge Overlay */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            pointerEvents: "none",
            zIndex: 4,
          }}
        >
          <span
            style={{
              background: "rgba(23, 43, 32, 0.92)",
              color: "#ecd599",
              fontSize: 10,
              fontWeight: 700,
              padding: "4px 9px",
              borderRadius: 8,
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(200, 154, 75, 0.5)",
              letterSpacing: "0.03em",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span>🌿</span> {mr ? "चालू बहर · आडीत पिकवलेला" : "Straw Ripened · GI Tagged"}
          </span>

          {p.category === "hapus" && (
            <span
              style={{
                background: "rgba(200, 154, 75, 0.95)",
                color: "#172b20",
                fontSize: 9,
                fontWeight: 800,
                padding: "2px 7px",
                borderRadius: 6,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                width: "fit-content",
              }}
            >
              {mr ? "अस्सल देवगड" : "Devgad Laterite Soil"}
            </span>
          )}
        </div>

        {/* Stock Health Tag Overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 12,
            background: "rgba(255, 255, 255, 0.92)",
            color: "#166534",
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 6,
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            gap: 5,
            pointerEvents: "none",
            zIndex: 4,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
          <span>{mr ? "थेट बागेतून उपलब्ध" : "Fresh in Stock"}</span>
        </div>
      </div>

      {/* Product Body */}
      <div
        style={{
          padding: "18px 18px 16px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: 12,
        }}
      >
        {/* Title & Origin */}
        <div>
          <Link href={`/product/${p.slug}`} style={{ textDecoration: "none" }}>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 19,
                fontWeight: 700,
                color: "var(--green)",
                margin: "0 0 4px",
                lineHeight: 1.25,
                transition: "color 0.2s",
              }}
            >
              {mr && p.name_mr ? p.name_mr : p.name}
            </h3>
          </Link>
          <div style={{ fontSize: 12, color: "var(--muted)", display: "flex", alignItems: "center", gap: 6 }}>
            <span>📍 नारिंग्रे, देवगड (सिंधुदुर्ग)</span>
            <span>·</span>
            <span>{mr ? "रसाळ व गोड" : "Zero Carbide"}</span>
          </div>
        </div>

        {/* UNIT SELECTION OPTIONS (Grams & Dozen & Box & Kg) */}
        <div style={{ marginTop: 2 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#8a7b66",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 6,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{mr ? "प्रमाण / एकक निवडा (Select Unit):" : "Select Unit / Size:"}</span>
            <span style={{ color: "var(--green)", fontWeight: 800 }}>{currentUnitLabel}</span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${availableUnits.length}, 1fr)`,
              gap: 5,
              background: "#faf6ed",
              padding: 3,
              borderRadius: 10,
              border: "1px solid #ebdcc5",
            }}
          >
            {availableUnits.map((u) => {
              const isActive = selectedUnit === u;
              const label =
                u === "dozen"
                  ? (mr ? "डझन" : "Dozen")
                  : u === "grams" || u === "500g"
                  ? (mr ? "५००g" : "500g")
                  : u === "kg" || u === "1kg"
                  ? (mr ? "१ किलो" : "1 Kg")
                  : (mr ? "पेटी" : "Box");

              return (
                <button
                  key={u}
                  type="button"
                  onClick={() => setSelectedUnit(u)}
                  style={{
                    padding: "6px 2px",
                    borderRadius: 8,
                    border: "none",
                    background: isActive ? "var(--green)" : "transparent",
                    color: isActive ? "#ffffff" : "#4b5548",
                    fontSize: "clamp(10px, 2.6vw, 11px)",
                    fontWeight: isActive ? 700 : 600,
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Display */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            paddingTop: 4,
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 24,
                  fontWeight: 800,
                  color: "var(--green)",
                }}
              >
                ₹{currentPrice.toLocaleString("en-IN")}
              </span>
              <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>
                / {currentUnitLabel}
              </span>
            </div>
            {p.compare_at_price && selectedUnit === "box" && (
              <div style={{ fontSize: 11, color: "#9ca3af", textDecoration: "line-through" }}>
                ₹{Number(p.compare_at_price).toLocaleString("en-IN")}
              </div>
            )}
          </div>

          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#16a34a",
              background: "#dcfce7",
              padding: "2px 8px",
              borderRadius: 99,
            }}
          >
            {mr ? "१००% शुद्ध" : "100% Pure"}
          </span>
        </div>

        {/* Actions: Add to Cart + 1-Click WhatsApp Order */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "auto" }}>
          <button
            className="btn"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: 13,
              fontWeight: 700,
              background: addedNotice ? "#16a34a" : "var(--green)",
              transition: "background 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              borderRadius: 10,
            }}
            onClick={handleAddToCart}
          >
            {addedNotice ? <Check size={16} /> : <ShoppingCart size={15} />}
            <span>
              {addedNotice
                ? (mr ? "कार्टमध्ये जोडले! ✓" : "Added to Cart! ✓")
                : (mr ? `कार्टमध्ये जोडा (${currentUnitLabel})` : `Add to Cart (${currentUnitLabel})`)}
            </span>
          </button>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
            target="_blank"
            rel="noreferrer"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "9px 12px",
              borderRadius: 10,
              background: "rgba(28, 155, 88, 0.08)",
              border: "1.5px solid #1c9b58",
              color: "#15803d",
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            <span>💬</span>
            <span>{mr ? "१-क्लिक व्हॉट्सॲप ऑर्डर" : "1-Click WhatsApp Order"}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
