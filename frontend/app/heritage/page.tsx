"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { translations, Language } from "@/lib/translations";

export default function HeritagePage() {
  const s = useStore();
  const lang = (s.lang === "mr" ? "mr" : "en") as Language;
  const t = translations[lang];
  const isMr = lang === "mr";

  const heritageSites = [
    {
      title: t.heritage.h1Title,
      img: "/images/sindhudurg.jpg",
      desc: t.heritage.h1Desc,
    },
    {
      title: t.heritage.h2Title,
      img: "/images/ripe-mangoes.jpg",
      desc: t.heritage.h2Desc,
    },
    {
      title: t.heritage.h3Title,
      img: "/images/vijaydurg.jpg",
      desc: t.heritage.h3Desc,
    },
    {
      title: t.heritage.h4Title,
      img: "/images/founder-orchard.jpg",
      desc: t.heritage.h4Desc,
    },
  ];

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <div className="page-title" style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div className="eyebrow">{t.heritage.eyebrow}</div>
        <h1 style={{ fontSize: "clamp(32px, 4.5vw, 48px)", margin: "10px 0 16px", color: "var(--green)" }}>
          {t.heritage.title}
        </h1>
        <p className="muted" style={{ fontSize: 16 }}>
          {t.heritage.lead}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 28, marginTop: 40 }}>
        {heritageSites.map((site) => (
          <div className="content-card" key={site.title} style={{ padding: 20 }}>
            <div
              style={{
                borderRadius: 16,
                minHeight: 220,
                marginBottom: 16,
                backgroundImage: `url('${site.img}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <h2 className="serif" style={{ fontSize: 22, margin: "0 0 10px", color: "var(--green)" }}>
              {site.title}
            </h2>
            <p className="story-copy" style={{ fontSize: 14, lineHeight: 1.65, margin: 0 }}>
              {site.desc}
            </p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Link className="btn gold" href="/shop">
          {t.hero.shopBtn} <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
