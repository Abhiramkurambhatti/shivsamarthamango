"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/components/StoreProvider";
import ProductCard from "@/components/ProductCard";
import { translations, Language } from "@/lib/translations";
import { ShieldCheck, Truck, Award, Sparkles, Filter, Leaf, HeartHandshake, CheckCircle } from "lucide-react";
import Link from "next/link";

interface ShopClientProps {
  products: any[];
}

export default function ShopClient({ products }: ShopClientProps) {
  const s = useStore();
  const lang = (s.lang === "mr" ? "mr" : "en") as Language;
  const isMr = lang === "mr";
  const t = translations[lang];

  // Category filter state
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", labelMr: "सर्व उत्पादने", labelEn: "All Varieties", icon: "🥭" },
    { id: "hapus", labelMr: "अस्सल देवगड हापूस", labelEn: "Devgad Hapus", icon: "⭐" },
    { id: "other", labelMr: "इतर आंबे (केसर)", labelEn: "Kesar & Others", icon: "🌿" },
    { id: "gift", labelMr: "सप्रेम भेट पेटी", labelEn: "Gift Petis", icon: "🎁" },
  ];

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <main style={{ paddingBottom: 80, background: "var(--bg, #fbf8f2)" }}>
      {/* 1. SHOP HEADER & HERO BANNER */}
      <section
        style={{
          background: "linear-gradient(135deg, #172b20 0%, #1c3628 50%, #122219 100%)",
          color: "#fff",
          padding: "60px 20px 50px",
          position: "relative",
          overflow: "hidden",
          borderBottom: "2px solid rgba(200, 154, 75, 0.35)",
        }}
      >
        {/* Subtle decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "5%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200, 154, 75, 0.18) 0%, rgba(0,0,0,0) 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(200, 154, 75, 0.18)",
              border: "1px solid rgba(200, 154, 75, 0.45)",
              color: "#ffd27d",
              fontSize: 12,
              fontWeight: 700,
              padding: "5px 14px",
              borderRadius: 99,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            <Sparkles size={14} color="#ffd27d" />
            <span>{isMr ? "थेट बागेतून अस्सल खरेदी · सिझन २०२६" : "Direct From Orchard · 2026 Harvest Season"}</span>
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(32px, 4.8vw, 52px)",
              fontWeight: 800,
              color: "#ffffff",
              margin: "0 0 14px",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            {isMr ? "अस्सल देवगड हापूस व फळे खरेदी केंद्र" : "Devgad Alphonso Mango Marketplace"}
          </h1>

          <p
            style={{
              fontSize: "clamp(15px, 2vw, 17px)",
              color: "rgba(255, 255, 255, 0.85)",
              maxWidth: 720,
              margin: "0 auto 24px",
              lineHeight: 1.6,
            }}
          >
            {isMr
              ? "सिंधुदुर्ग देवगड नारिंग्रे येथील शेवाळे ॲग्रो फार्ममधून थेट तोडलेले, पारंपरिक गवताच्या आडीत पिकवलेले १००% रसायनमुक्त व भौगोलिक मानांकन (GI Tag) प्राप्त हापूस."
              : "Handpicked directly from Shewale Agro Farm in Naringre, Devgad. 100% residue-free, naturally straw-ripened, and authenticated with official GI Tag."}
          </p>

          {/* Quick Stats Strip */}
          <div
            style={{
              display: "inline-flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "16px 28px",
              background: "rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(10px)",
              padding: "10px 24px",
              borderRadius: 99,
              border: "1px solid rgba(255, 255, 255, 0.12)",
              fontSize: 13,
              color: "#ecd599",
            }}
          >
            <span>🌿 {isMr ? "२० एकर स्वमालकीची बाग" : "20-Acre Coastal Orchard"}</span>
            <span>·</span>
            <span>🏷️ {isMr ? "GI Tag प्रमाणित हापूस" : "GI Tag Certified"}</span>
            <span>·</span>
            <span>📦 {isMr ? "डझन व ग्रॅम पर्याय उपलब्ध" : "Dozen, Kg & Grams Options"}</span>
            <span>·</span>
            <span>🚚 {isMr ? "२४-४८ तासांत सुरक्षित डिलिव्हरी" : "24-48hr Express Dispatch"}</span>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY TABS & FILTER BAR */}
      <section className="container" style={{ maxWidth: 1200, margin: "-20px auto 36px", padding: "0 20px", position: "relative", zIndex: 10 }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: 18,
            padding: "12px 18px",
            boxShadow: "0 10px 30px rgba(23, 43, 32, 0.08)",
            border: "1.5px solid rgba(200, 154, 75, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {/* Category Tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 4 }}>
              {isMr ? "प्रकार:" : "Filter:"}
            </span>
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 99,
                    border: "1px solid",
                    borderColor: isActive ? "var(--green)" : "#e5dbcb",
                    background: isActive ? "var(--green)" : "#faf6ee",
                    color: isActive ? "#ffffff" : "#2d372e",
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{isMr ? cat.labelMr : cat.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Result Count & WhatsApp Helpline */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13, color: "var(--muted)" }}>
            <span>
              {isMr ? `एकूण ${filteredProducts.length} उत्पादने` : `Showing ${filteredProducts.length} varieties`}
            </span>
            <span>·</span>
            <span style={{ color: "#166534", fontWeight: 700 }}>
              📞 {isMr ? "मदत: ९५५२० ५००९३" : "Helpline: +91 95520 50093"}
            </span>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT SHOWCASE GRID */}
      <section className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        {filteredProducts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#fff",
              borderRadius: 20,
              border: "1px dashed #d3cbbd",
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>🥭</div>
            <h3 style={{ fontSize: 20, margin: "0 0 8px", color: "var(--green)" }}>
              {isMr ? "या वर्गातील उत्पादने लवकरच उपलब्ध होतील" : "Varieties in this category coming soon"}
            </h3>
            <button
              onClick={() => setActiveCategory("all")}
              style={{
                marginTop: 12,
                padding: "8px 20px",
                borderRadius: 99,
                border: "none",
                background: "var(--green)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {isMr ? "सर्व उत्पादने पहा" : "View All Products"}
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 28,
            }}
          >
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>

      {/* 4. NATURAL QUALITY PILLARS & TRUST BADGES */}
      <section className="container" style={{ maxWidth: 1200, margin: "60px auto 0", padding: "0 20px" }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: 24,
            padding: "36px 32px",
            border: "1.5px solid rgba(200, 154, 75, 0.35)",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.03)",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 30px" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#c89a4b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {isMr ? "॥ आमची शेतकरी हमी ॥" : "Our Farmer Direct Guarantee"}
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 26,
                color: "var(--green)",
                margin: "6px 0 8px",
              }}
            >
              {isMr ? "अस्सल देवगड हापूसची शुद्धता व खात्री" : "100% Authentic Devgad Heritage Guarantee"}
            </h2>
            <p style={{ fontSize: 14, color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>
              {isMr
                ? "मध्यस्थ नाही, कृत्रिम रसायने नाहीत — थेट बागेतील झाडावरून उतरवलेला आणि नैसर्गिक पेंढ्यात पिकवलेला हापूस."
                : "No middlemen, no artificial carbide ripening — harvested straight from coastal trees and dispatched in organic straw."}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 20,
            }}
          >
            <div style={{ padding: 18, background: "#faf7f0", borderRadius: 16, border: "1px solid #ebdcc5" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(200, 154, 75, 0.2)", display: "grid", placeItems: "center", marginBottom: 12 }}>
                <Award size={20} color="#c89a4b" />
              </div>
              <h4 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "var(--green)" }}>
                {isMr ? "GI Tag मानांकन प्रमाणित" : "Official GI Tag Certified"}
              </h4>
              <p style={{ margin: 0, fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                {isMr
                  ? "देवगड भौगोलिक मानांकन प्राप्त अस्सल शेवाळे फार्मचा अधिकृत हापूस."
                  : "Authentic Alphonso verified to originate solely from Devgad's coastal belt."}
              </p>
            </div>

            <div style={{ padding: 18, background: "#faf7f0", borderRadius: 16, border: "1px solid #ebdcc5" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(33, 70, 56, 0.12)", display: "grid", placeItems: "center", marginBottom: 12 }}>
                <Leaf size={20} color="#214638" />
              </div>
              <h4 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "var(--green)" }}>
                {isMr ? "१००% नैसर्गिक गवताची आडी" : "Natural Paddy Straw Ripening"}
              </h4>
              <p style={{ margin: 0, fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                {isMr
                  ? "कोणत्याही कार्बाईड किंवा रसायनांशिवाय पारंपरिक भाताच्या पेंढ्यात नैसर्गिक पिकवणूक."
                  : "Zero carbide or chemicals used. Slowly ripened in traditional paddy straw for supreme sweetness."}
              </p>
            </div>

            <div style={{ padding: 18, background: "#faf7f0", borderRadius: 16, border: "1px solid #ebdcc5" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(22, 163, 74, 0.12)", display: "grid", placeItems: "center", marginBottom: 12 }}>
                <Truck size={20} color="#16a34a" />
              </div>
              <h4 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "var(--green)" }}>
                {isMr ? "थेट बागेतून २४-४८ तासांत पाठवणी" : "Express Coastal Dispatch"}
              </h4>
              <p style={{ margin: 0, fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                {isMr
                  ? "तोडणीनंतर त्वरित कुशन बॉक्समध्ये पॅक करून पुणे, मुंबई व प्रमुख शहरांत थेट रवाना."
                  : "Dispatched in customized protective cushioned boxes to preserve harvest freshness."}
              </p>
            </div>

            <div style={{ padding: 18, background: "#faf7f0", borderRadius: 16, border: "1px solid #ebdcc5" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(28, 155, 88, 0.12)", display: "grid", placeItems: "center", marginBottom: 12 }}>
                <HeartHandshake size={20} color="#1c9b58" />
              </div>
              <h4 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 700, color: "var(--green)" }}>
                {isMr ? "१००% समाधान किंवा रिप्लेसमेंट" : "100% Satisfaction Guarantee"}
              </h4>
              <p style={{ margin: 0, fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                {isMr
                  ? "ट्रान्सिटमध्ये खराब झाल्यास त्वरित मदत किंवा नवीन पेटी देण्याची शेतकरी हमी."
                  : "Direct farmer support with prompt resolution or replacement for any transit damage."}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
