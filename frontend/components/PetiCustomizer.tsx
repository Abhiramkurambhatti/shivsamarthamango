"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShoppingBag, Sparkles, ShieldCheck, HeartHandshake, Truck, MapPin } from "lucide-react";
import { useStore } from "./StoreProvider";
import { WHATSAPP_NUMBER } from "@/lib/config";

interface PetiOption {
  id: string;
  nameMr: string;
  nameEn: string;
  count: number;
  weight: string;
  price: number;
  originalPrice: number;
  tagMr?: string;
  tagEn?: string;
  popular?: boolean;
  boxTypeMr: string;
  boxTypeEn: string;
  saving?: number;
}

const PETI_OPTIONS: PetiOption[] = [
  {
    id: "1-dozen",
    nameMr: "१ डझन पेटी (१२ आंबे)",
    nameEn: "1 Dozen Peti (12 Mangoes)",
    count: 12,
    weight: "~3.2 - 3.5 किलो",
    price: 2400,
    originalPrice: 2600,
    boxTypeMr: "इको-फ्रेंडली व्हेंटिलेटेड बॉक्स",
    boxTypeEn: "Eco-Friendly Ventilated Box",
    saving: 200,
  },
  {
    id: "2-dozen",
    nameMr: "२ डझन फॅमिली पेटी (२४ आंबे)",
    nameEn: "2 Dozen Family Peti (24 Mangoes)",
    count: 24,
    weight: "~6.5 - 7.0 किलो",
    price: 4600,
    originalPrice: 5200,
    popular: true,
    tagMr: "सर्वाधिक पसंती · ₹६०० बचत",
    tagEn: "Most Popular · Save ₹600",
    boxTypeMr: "पारंपरिक कोकणी आडी पेटी",
    boxTypeEn: "Traditional Konkan Straw Peti",
    saving: 600,
  },
  {
    id: "4-dozen",
    nameMr: "४ डझन उत्सव लाकडी पेटी (४८ आंबे)",
    nameEn: "4 Dozen Wooden Peti (48 Mangoes)",
    count: 48,
    weight: "~13 - 14 किलो",
    price: 8800,
    originalPrice: 10400,
    tagMr: "मोठे कुटुंब व गिफ्ट · ₹१६०० बचत",
    tagEn: "Joint Family & Gift · Save ₹1600",
    boxTypeMr: "पारंपरिक लाकडी खोका / हेवी पेटी",
    boxTypeEn: "Heritage Wooden Crate Peti",
    saving: 1600,
  },
];

export default function PetiCustomizer() {
  const [selected, setSelected] = useState<PetiOption>(PETI_OPTIONS[1]);
  const [added, setAdded] = useState(false);
  const s = useStore();
  const isMr = s.lang === "mr";

  const handleAddToCart = () => {
    s.add({
      id: selected.id === "1-dozen" ? 1 : selected.id === "2-dozen" ? 102 : 104,
      name: isMr ? `देवगड हापूस - ${selected.nameMr}` : `Devgad Alphonso - ${selected.nameEn}`,
      name_mr: `देवगड हापूस - ${selected.nameMr}`,
      price: selected.price,
      weight_kg: selected.id === "1-dozen" ? 3.5 : selected.id === "2-dozen" ? 7 : 14,
      image_url: "/images/devgad-hapus.jpg",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  const whatsappMessage = encodeURIComponent(
    isMr
      ? `नमस्कार! मला शिवसमर्थ देवगड हापूस पेटी ऑर्डर करायची आहे:\n\n📦 प्रकार: ${selected.nameMr}\n💰 किंमत: ₹${selected.price.toLocaleString("en-IN")}\n⚖️ वजन: ${selected.weight}\n📍 बाग: नारिंग्रे, देवगड\n\nकृपया बँक / UPI तपशील व डिलिव्हरी माहिती पाठवा.`
      : `Hello! I would like to order Shiv Samarth Devgad Alphonso Mangoes:\n\n📦 Box: ${selected.nameEn}\n💰 Price: ₹${selected.price.toLocaleString("en-IN")}\n⚖️ Approx Weight: ${selected.weight}\n📍 Orchard: Naringre, Devgad\n\nPlease share payment details and delivery schedule.`
  );

  return (
    <div
      style={{
        background: "radial-gradient(ellipse at top, #1c3629 0%, #102118 60%, #0a150f 100%)",
        color: "#f8f3ea",
        borderRadius: 24,
        padding: "44px 32px",
        boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        border: "1.5px solid rgba(200, 154, 75, 0.3)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Gold Header Bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #c89a4b, #ecd599, #c89a4b)",
        }}
      />

      <div style={{ textAlign: "center", maxWidth: 780, margin: "0 auto 36px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(200, 154, 75, 0.15)",
            border: "1px solid rgba(200, 154, 75, 0.35)",
            color: "#ecd599",
            borderRadius: 99,
            padding: "5px 14px",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          <Sparkles size={14} /> {isMr ? "आपली पेटी निवडा · बागेतून थेट डिलिव्हरी" : "Choose Your Peti · Orchard Fresh Dispatch"}
        </div>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(26px, 3.8vw, 38px)",
            color: "#fff",
            margin: "0 0 12px",
            letterSpacing: "-0.01em",
          }}
        >
          {isMr ? "अस्सल देवगड हापूस — कुटुंब व भेट पेटी निवडा" : "Authentic Devgad Alphonso — Select Your Peti"}
        </h2>
        <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 15, margin: 0, lineHeight: 1.6 }}>
          {isMr
            ? "प्रत्येक आंबा देवगड नारिंग्रे येथील २० एकर बागेत हाताने तोडून, नैसर्गिक गवताच्या आडीत पिकवून, GI-Tag शिक्क्यासह सुरक्षित पॅक केला जातो."
            : "Hand-harvested at peak maturity from our 20-acre coastal orchard in Naringre, Devgad. Ripened naturally in organic rice straw."}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {PETI_OPTIONS.map((opt) => {
          const isSelected = selected.id === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => setSelected(opt)}
              style={{
                borderRadius: 18,
                padding: "24px 20px",
                background: isSelected ? "rgba(200, 154, 75, 0.14)" : "rgba(255,255,255,0.04)",
                border: isSelected ? "2px solid #ecd599" : "1px solid rgba(255,255,255,0.12)",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.25s ease",
                transform: isSelected ? "translateY(-4px)" : "none",
                boxShadow: isSelected ? "0 12px 30px rgba(200,154,75,0.25)" : "none",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {opt.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: -12,
                    right: 18,
                    background: "linear-gradient(135deg, #c89a4b, #e0b25e)",
                    color: "#102118",
                    fontSize: 11,
                    fontWeight: 800,
                    padding: "3px 12px",
                    borderRadius: 99,
                    letterSpacing: "0.04em",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  ★ {isMr ? opt.tagMr : opt.tagEn}
                </div>
              )}

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      border: isSelected ? "2px solid #ecd599" : "1.5px solid rgba(255,255,255,0.3)",
                      background: isSelected ? "#ecd599" : "transparent",
                      color: isSelected ? "#102118" : "transparent",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  >
                    ✓
                  </div>
                  <span style={{ fontSize: 12, color: "#ecd599", fontWeight: 700 }}>
                    {isMr ? opt.boxTypeMr : opt.boxTypeEn}
                  </span>
                </div>

                <h3 style={{ fontSize: 19, margin: "0 0 6px", color: "#fff", fontWeight: 700 }}>
                  {isMr ? opt.nameMr : opt.nameEn}
                </h3>
                <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                  {isMr ? `अंदाजे वजन: ${opt.weight}` : `Approx Weight: ${opt.weight}`} · Grade A+ (250g+)
                </p>

                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 28, fontWeight: 800, color: "#ecd599", fontFamily: "'Playfair Display', serif" }}>
                    ₹{opt.price.toLocaleString("en-IN")}
                  </span>
                  <span style={{ fontSize: 15, textDecoration: "line-through", color: "rgba(255,255,255,0.4)" }}>
                    ₹{opt.originalPrice.toLocaleString("en-IN")}
                  </span>
                  {opt.saving && (
                    <span style={{ fontSize: 12, color: "#4ade80", fontWeight: 700 }}>
                      {isMr ? `(₹${opt.saving} सूट)` : `(Save ₹${opt.saving})`}
                    </span>
                  )}
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px", fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.85)" }}>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <ShieldCheck size={14} color="#ecd599" />
                    <span>{isMr ? "१००% GI-Tag प्रमाणित देवगड हापूस" : "100% GI-Tag Certified Devgad Hapus"}</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Check size={14} color="#4ade80" />
                    <span>{isMr ? "पारंपरिक गवताच्या आडीत नैसर्गिक पिकवण" : "Rice straw (Aadi) naturally ripened"}</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Check size={14} color="#4ade80" />
                    <span>{isMr ? "शून्य कार्बाईड · रासायनिक अवशेषमुक्त" : "Zero Carbide · Chemical Free"}</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Truck size={14} color="#ecd599" />
                    <span>{isMr ? "थेट नारिंग्रे बागेतून एक्सप्रेस डिलिव्हरी" : "Direct Naringre Orchard Dispatch"}</span>
                  </li>
                </ul>
              </div>

              <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: 12, color: isSelected ? "#ecd599" : "rgba(255,255,255,0.5)", fontWeight: 600 }}>
                  {isSelected
                    ? (isMr ? "✓ सध्या निवडलेली पेटी" : "✓ Currently Selected")
                    : (isMr ? "निवडण्यासाठी क्लिक करा" : "Click to Select")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Bar */}
      <div
        style={{
          marginTop: 32,
          padding: "20px 24px",
          background: "rgba(0,0,0,0.35)",
          borderRadius: 18,
          border: "1px solid rgba(200, 154, 75, 0.25)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            {isMr ? "निवडलेली पेटी:" : "Selected Peti:"}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
            {isMr ? selected.nameMr : selected.nameEn} —{" "}
            <span style={{ color: "#ecd599" }}>₹{selected.price.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              borderRadius: 99,
              background: added ? "#15803d" : "#214638",
              color: "#fff",
              border: "1.5px solid rgba(255,255,255,0.2)",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <ShoppingBag size={16} />
            <span>{added ? (isMr ? "✓ कार्टमध्ये जोडले!" : "✓ Added to Cart!") : (isMr ? "कार्टमध्ये जोडा" : "Add to Cart")}</span>
          </button>

          {/* 1-Click WhatsApp Quick Order */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              borderRadius: 99,
              background: "linear-gradient(135deg, #1c9b58, #147341)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 4px 18px rgba(28, 155, 88, 0.35)",
              transition: "all 0.2s",
            }}
          >
            <span>💬</span>
            <span>{isMr ? "१-क्लिक व्हॉट्सॲप ऑर्डर" : "1-Click WhatsApp Order"}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
