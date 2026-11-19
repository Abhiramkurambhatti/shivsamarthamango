"use client";

import { useStore } from "@/components/StoreProvider";
import ProductCard from "@/components/ProductCard";
import { translations, Language } from "@/lib/translations";

export default function ShopClient({ products }: { products: any[] }) {
  const s = useStore();
  const lang = (s.lang === "mr" ? "mr" : "en") as Language;
  const t = translations[lang];

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <div className="page-title" style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div className="eyebrow">{t.products.eyebrow}</div>
        <h1 style={{ fontSize: "clamp(32px, 4.5vw, 48px)", margin: "10px 0 16px", color: "var(--green)" }}>
          {t.products.title}
        </h1>
        <p className="muted" style={{ fontSize: 16 }}>
          {t.products.lead}
        </p>
      </div>

      <div className="product-grid" style={{ marginTop: 36 }}>
        {products.map((p) => (
          <ProductCard key={p.id} p={p} />
        ))}
      </div>
    </main>
  );
}
