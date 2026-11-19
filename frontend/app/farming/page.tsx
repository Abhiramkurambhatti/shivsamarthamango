"use client";

import Link from "next/link";
import { ArrowRight, Leaf, MapPin, Award, Sprout, ShieldCheck, Sun } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { translations, Language } from "@/lib/translations";

export default function FarmingPage() {
  const s = useStore();
  const lang = (s.lang === "mr" ? "mr" : "en") as Language;
  const t = translations[lang];
  const isMr = lang === "mr";

  const pillars = [
    {
      icon: <MapPin size={24} />,
      title: t.farming.f1Title,
      desc: t.farming.f1Desc,
      img: "/images/founder-orchard.jpg",
    },
    {
      icon: <Leaf size={24} />,
      title: t.farming.f2Title,
      desc: t.farming.f2Desc,
      img: "/images/ripe-mangoes.jpg",
    },
    {
      icon: <Sprout size={24} />,
      title: t.farming.f3Title,
      desc: t.farming.f3Desc,
      img: "/images/crate-straw.jpg",
    },
    {
      icon: <Award size={24} />,
      title: t.farming.f4Title,
      desc: t.farming.f4Desc,
      img: "/images/gi-tag-mango.jpg",
    },
  ];

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <div className="page-title" style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div className="eyebrow">{t.farming.eyebrow}</div>
        <h1 style={{ fontSize: "clamp(32px, 4.5vw, 48px)", margin: "10px 0 16px", color: "var(--green)" }}>
          {t.farming.title}
        </h1>
        <p className="muted" style={{ fontSize: 16 }}>
          {t.farming.lead}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 28, marginTop: 40 }}>
        {pillars.map((p, idx) => (
          <div key={idx} className="content-card" style={{ padding: 24, display: "flex", flexDirection: "column" }}>
            <div style={{ borderRadius: 16, overflow: "hidden", height: 240, marginBottom: 18 }}>
              <img src={p.img} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--green)", marginBottom: 8 }}>
              {p.icon}
              <h2 className="serif" style={{ fontSize: 22, margin: 0 }}>{p.title}</h2>
            </div>
            <p className="story-copy" style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              {p.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="content-card" style={{ marginTop: 36, textAlign: "center", padding: 36, background: "var(--soft)" }}>
        <h3 className="serif" style={{ fontSize: 24, color: "var(--green)", margin: "0 0 10px" }}>
          {isMr ? "अस्सल देवगड हापूसची गोडी अनुभवा" : "Experience True Devgad Alphonso Sweetness"}
        </h3>
        <p style={{ maxWidth: 600, margin: "0 auto 20px", color: "var(--muted)" }}>
          {isMr
            ? "आमच्या नारिंग्रे बागेतील १००% नैसर्गिक आणि सेंद्रिय हापूस थेट आपल्या घरी मागवा."
            : "Order 100% natural, residue-free Alphonso mangoes directly from our orchard in Naringre."}
        </p>
        <Link className="btn gold" href="/shop">
          {t.hero.shopBtn} <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
