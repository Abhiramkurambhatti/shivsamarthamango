"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { translations, Language } from "@/lib/translations";

export default function GalleryPage() {
  const s = useStore();
  const lang = (s.lang === "mr" ? "mr" : "en") as Language;
  const t = translations[lang];
  const isMr = lang === "mr";

  const galleryItems = [
    { src: "/images/gallery-1.jpg", caption: t.gallery.c1 },
    { src: "/images/gallery-2.jpg", caption: t.gallery.c2 },
    { src: "/images/gallery-3.jpg", caption: t.gallery.c3 },
    { src: "/images/gallery-4.jpg", caption: t.gallery.c4 },
    { src: "/images/gallery-5.jpg", caption: t.gallery.c5 },
    { src: "/images/gallery-6.jpg", caption: t.gallery.c6 },
    { src: "/images/trust-shivraj.jpg", caption: isMr ? "मा. केंद्रीय मंत्री श्री. शिवराज सिंह चौहान यांना पेटी भेट" : "Presenting official peti to Union Minister Shivraj Singh Chouhan" },
    { src: "/images/trust-rijiju.jpg", caption: isMr ? "मा. केंद्रीय मंत्री श्री. किरेन रिजिजू यांना शिवसमर्थ हापूस भेट" : "Presenting Shiv Samarth Hapus to Union Minister Kiren Rijiju" },
    { src: "/images/trust-mohol.jpg", caption: isMr ? "मा. केंद्रीय राज्यमंत्री श्री. मुरलीधर मोहोळ यांना शिवसमर्थ हापूस भेट" : "Presenting official peti to Union Minister of State Shri Murlidhar Mohol" },
  ];

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <div className="page-title" style={{ textAlign: "center", maxWidth: 840, margin: "0 auto" }}>
        <div className="eyebrow">{t.gallery.eyebrow}</div>
        <h1 style={{ fontSize: "clamp(32px, 4.5vw, 48px)", margin: "10px 0 16px", color: "var(--green)" }}>
          {t.gallery.title}
        </h1>
        <p className="muted" style={{ fontSize: 16 }}>
          {t.gallery.lead}
        </p>
      </div>

      <div className="gallery-grid" style={{ marginTop: 36 }}>
        {galleryItems.map((item, idx) => (
          <div key={idx} className="gallery-card">
            <img src={item.src} alt={item.caption} />
            <p>{item.caption}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 44 }}>
        <Link className="btn gold" href="/shop">
          {t.hero.shopBtn} <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  );
}
