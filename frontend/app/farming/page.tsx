"use client";

import Link from "next/link";
import { ArrowRight, Leaf, MapPin, Award, Sprout, ShieldCheck, Sun, CheckCircle2, MessageCircle } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { translations, Language } from "@/lib/translations";

export default function FarmingPage() {
  const s = useStore();
  const lang = (s.lang === "mr" ? "mr" : "en") as Language;
  const t = translations[lang];
  const isMr = lang === "mr";

  const pillars = [
    {
      num: "#01",
      icon: <MapPin size={22} />,
      title: t.farming.f1Title,
      desc: t.farming.f1Desc,
      img: "/images/founder-orchard.jpg",
      tag: isMr ? "📍 नारिंग्रे, देवगड (सिंधुदुर्ग)" : "📍 Naringre, Devgad (Sindhudurg)",
      pills: isMr
        ? ["लाल जांभा कातळ", "खारी सागरी हवा", "नैसर्गिक गोडी व रंग"]
        : ["Red Laterite Katal", "Arabian Sea Breeze", "Natural Saffron Glow"],
    },
    {
      num: "#02",
      icon: <Leaf size={22} />,
      title: t.farming.f2Title,
      desc: t.farming.f2Desc,
      img: "/images/ripe-mangoes.jpg",
      tag: isMr ? "🌱 १००% नैसर्गिक सेंद्रिय" : "🌱 100% Organic Nutrition",
      pills: isMr
        ? ["देशी गोमूत्र व शेणखत", "पारंपरिक जिवामृत", "शून्य रासायनिक फवारणी"]
        : ["Desi Cow Dung Manure", "Jeevamrit Nutrition", "Zero Chemical Pesticides"],
    },
    {
      num: "#03",
      icon: <Sprout size={22} />,
      title: t.farming.f3Title,
      desc: t.farming.f3Desc,
      img: "/images/crate-straw.jpg",
      tag: isMr ? "🌾 पारंपरिक भाताची आडी" : "🌾 Traditional Rice Straw Bed",
      pills: isMr
        ? ["पारंपरिक भाताचा पेंढा", "नैसर्गिक तापमानात पिकवण", "अस्सल सुवास व चव"]
        : ["Natural Rice Straw", "Ambient Temperature", "No Artificial Carbide"],
    },
    {
      num: "#04",
      icon: <Award size={22} />,
      title: t.farming.f4Title,
      desc: t.farming.f4Desc,
      img: "/images/gi-tag-mango.jpg",
      tag: isMr ? "🏷️ GI Tag No. 497 प्रमाणित" : "🏷️ GI Tag No. 497 Certified",
      pills: isMr
        ? ["अधिकृत GI Tag No. 497", "थेट बागेतून ग्राहकांपर्यंत", "१००% शुद्धतेची हमी"]
        : ["Official GI Tag No. 497", "Farm-to-Door Traceable", "100% Devgad Authenticity"],
    },
  ];

  const trustBadges = [
    { icon: "🌿", text: isMr ? "१००% सेंद्रिय शेती" : "100% Organic Practices" },
    { icon: "🚫", text: isMr ? "शून्य कार्बाईड हमी" : "0% Carbide Ripening" },
    { icon: "🌾", text: isMr ? "भाताची पेंढा आडी" : "Rice Straw Ripened" },
    { icon: "🏷️", text: isMr ? "GI Tag No. 497" : "GI Tag No. 497" },
    { icon: "🌊", text: isMr ? "नारिंग्रे सागरी हवामान" : "Coastal Terroir" },
  ];

  const waMessage = encodeURIComponent(
    isMr
      ? "नमस्कार! मला शिवसमर्थ हापूसच्या सेंद्रिय शेती व अस्सल देवगड हापूस आंब्यांबद्दल चौकशी करायची आहे."
      : "Hello! I would like to inquire about Shivsamarth Hapus organic farming and fresh Devgad mangoes."
  );

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      {/* Header */}
      <div className="page-title" style={{ textAlign: "center", maxWidth: 840, margin: "0 auto" }}>
        <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Leaf size={14} /> {t.farming.eyebrow}
        </div>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 46px)", margin: "12px 0 16px", color: "var(--green)" }}>
          {t.farming.title}
        </h1>
        <p className="muted" style={{ fontSize: "clamp(15px, 1.8vw, 17px)", lineHeight: 1.7 }}>
          {t.farming.lead}
        </p>

        {/* Quick Trust Badges Strip */}
        <div className="showcase-trust-bar">
          {trustBadges.map((badge, i) => (
            <span key={i} className="trust-pill">
              <span>{badge.icon}</span> {badge.text}
            </span>
          ))}
        </div>
      </div>

      {/* Responsive Showcase Grid (1 column on mobile, 2 columns on desktop) */}
      <div className="feature-showcase-grid">
        {pillars.map((p, idx) => (
          <div key={idx} className="feature-showcase-card">
            {/* Top Photo with Badges */}
            <div className="showcase-card-img-wrap">
              <img src={p.img} alt={p.title} />
              <div className="showcase-card-badge">
                {p.icon} <span>{p.num}</span>
              </div>
              <div className="showcase-card-tag">
                <span>{p.tag}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="showcase-card-body">
              <h2 className="showcase-card-title">{p.title}</h2>
              <p className="showcase-card-desc">{p.desc}</p>

              {/* Micro-feature pills */}
              <div className="showcase-pill-list">
                {p.pills.map((pill, pi) => (
                  <span key={pi} className="showcase-pill">
                    <CheckCircle2 size={12} style={{ color: "var(--gold)" }} /> {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Organic Commitment & Farmer Pledge Banner */}
      <div className="guarantee-banner">
        <div className="eyebrow" style={{ color: "var(--gold)", fontWeight: 700 }}>
          {isMr ? "🌱 आमचे शेतकरी वचन" : "🌱 OUR ORGANIC PLEDGE"}
        </div>
        <h3 className="serif" style={{ fontSize: "clamp(22px, 3vw, 32px)", color: "var(--green)", margin: "8px 0 12px" }}>
          {isMr ? "अस्सल देवगड हापूसची शुद्धता आणि आरोग्याची हमी" : "Guaranteed Authenticity, Purity & Natural Health"}
        </h3>
        <p style={{ maxWidth: 680, margin: "0 auto", color: "var(--muted)", fontSize: 15, lineHeight: 1.65 }}>
          {isMr
            ? "आम्ही रासायनिक कीटकनाशके, कृत्रिम इथिलीन किंवा कार्बाईडचा अजिबात वापर करत नाही. निसर्गाने ज्या पद्धतीने हापूस घडवला आहे, त्याच शुद्ध रूपात आम्ही तो आपल्यापर्यंत पोहोचवतो."
            : "No calcium carbide, no artificial ethylene, and no hazardous chemical washes. We deliver Alphonso in its purest, most aromatic form directly from our Devgad orchard."}
        </p>

        {/* 3 Pillar Commitments */}
        <div className="guarantee-grid">
          <div className="guarantee-item">
            <div className="guarantee-item-icon">🚫</div>
            <h4>{isMr ? "१००% शून्य कार्बाईड" : "100% Zero Carbide"}</h4>
            <p>
              {isMr
                ? "पारंपरिक भाताच्या पेंढ्यात नैसर्गिक तापमानावर पिकवला जातो, ज्यामुळे नैसर्गिक सुगंध टिकून राहतो."
                : "Slow-ripened naturally in ambient rice straw beds to preserve intense aroma and vitamins."}
            </p>
          </div>

          <div className="guarantee-item">
            <div className="guarantee-item-icon">🌳</div>
            <h4>{isMr ? "झाडावर पक्वता व तोडणी" : "Tree-Matured Harvest"}</h4>
            <p>
              {isMr
                ? "आंबा झाडावर परिपूर्ण पक्व झाल्यावरच अनुभवी हातानिशी देठासह अलगद काढला जातो."
                : "Hand-picked strictly at physiological maturity so each mango achieves optimum brix sweetness."}
            </p>
          </div>

          <div className="guarantee-item">
            <div className="guarantee-item-icon">📦</div>
            <h4>{isMr ? "थेट बागेतून पॅकिंग" : "Direct Orchard Dispatch"}</h4>
            <p>
              {isMr
                ? "कोणताही मध्यस्थ नाही. देवगड नारिंग्रे बागेतून प्रतवारी करून थेट आपल्या घरी पोहोचवले जाते."
                : "Zero middlemen. Graded, cushioned with straw, and shipped straight from our farm to you."}
            </p>
          </div>
        </div>

        {/* Call to Actions */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
          <Link className="btn gold" href="/shop" style={{ padding: "12px 24px", fontSize: 15 }}>
            {t.hero.shopBtn} <ArrowRight size={16} />
          </Link>
          <a
            className="btn"
            href={`https://wa.me/919552050093?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#25D366",
              color: "#fff",
              border: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 22px",
              fontSize: 15,
            }}
          >
            <MessageCircle size={18} />
            {isMr ? "सेंद्रिय बागेबद्दल चौकशी करा" : "Chat on WhatsApp"}
          </a>
        </div>
      </div>
    </main>
  );
}
