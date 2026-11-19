"use client";

import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Award, Sprout, MapPin, Sparkles } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import ProductCard from "@/components/ProductCard";
import Hero3DScrollytelling from "@/components/Hero3DScrollytelling";
import PetiCustomizer from "@/components/PetiCustomizer";
import PincodeEstimator from "@/components/PincodeEstimator";
import MangoComparison from "@/components/MangoComparison";
import CustomerReviews from "@/components/CustomerReviews";
import { translations, Language } from "@/lib/translations";

export default function HomeClient({ products }: { products: any[] }) {
  const s = useStore();
  const lang = (s.lang === "mr" ? "mr" : "en") as Language;
  const t = translations[lang];
  const isMr = lang === "mr";

  const dignitariesList = [
    {
      img: "/images/trust-shivraj.jpg",
      name: t.dignitaries.dignitary1Name,
      role: t.dignitaries.dignitary1Role,
      desc: t.dignitaries.dignitary1Desc,
    },
    {
      img: "/images/trust-rijiju.jpg",
      name: t.dignitaries.dignitary2Name,
      role: t.dignitaries.dignitary2Role,
      desc: t.dignitaries.dignitary2Desc,
    },
    {
      img: "/images/trust-mohol.jpg",
      name: t.dignitaries.dignitary3Name,
      role: t.dignitaries.dignitary3Role,
      desc: t.dignitaries.dignitary3Desc,
    },
    {
      img: "/images/trust-police.jpg",
      name: t.dignitaries.dignitary4Name,
      role: t.dignitaries.dignitary4Role,
      desc: t.dignitaries.dignitary4Desc,
    },
  ];

  const galleryPreview = [
    { img: "/images/gallery-1.jpg", caption: t.gallery.c1 },
    { img: "/images/gallery-2.jpg", caption: t.gallery.c2 },
    { img: "/images/gallery-3.jpg", caption: t.gallery.c3 },
    { img: "/images/gallery-4.jpg", caption: t.gallery.c4 },
    { img: "/images/gallery-5.jpg", caption: t.gallery.c5 },
    { img: "/images/gallery-6.jpg", caption: t.gallery.c6 },
  ];

  return (
    <main>
      {/* 1. HERO 3D SCROLLYTELLING INTERACTIVE EXPERIENCE DIRECTLY ON HOMEPAGE */}
      <Hero3DScrollytelling />

      {/* 2. ORCHARD TRUST & TERROIR STRIP */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)", padding: "24px 0" }}>
        <div className="container">
          <div className="trustbar" style={{ marginTop: 0 }}>
            <div className="trust">
              <MapPin size={22} color="var(--gold)" />
              <span>{t.hero.trust1}</span>
            </div>
            <div className="trust">
              <Leaf size={22} color="var(--green)" />
              <span>{t.hero.trust2}</span>
            </div>
            <div className="trust">
              <Sprout size={22} color="var(--gold)" />
              <span>{t.hero.trust3}</span>
            </div>
            <div className="trust">
              <Award size={22} color="var(--green)" />
              <span>{t.hero.trust4}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE PETI CUSTOMIZER & UNBOXING SELECTOR */}
      <section className="section" style={{ background: "var(--bg)", paddingTop: 50, paddingBottom: 50 }}>
        <div className="container">
          <PetiCustomizer />
        </div>
      </section>

      {/* 4. PINCODE DELIVERY ESTIMATOR STRIP */}
      <section style={{ background: "var(--surface)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", padding: "32px 0" }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <PincodeEstimator />
        </div>
      </section>

      {/* 5. DIGNITARIES & VIP TRUST SHOWCASE */}
      <section className="section" style={{ background: "var(--bg)", borderBottom: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head-center">
            <div className="eyebrow">{t.dignitaries.eyebrow}</div>
            <h2>{t.dignitaries.title}</h2>
            <p>{t.dignitaries.lead}</p>
          </div>

          <div className="dignitary-grid">
            {dignitariesList.map((d, idx) => (
              <div key={idx} className="dignitary-card">
                <div className="dignitary-img">
                  <img src={d.img} alt={d.name} />
                </div>
                <div className="dignitary-body">
                  <h4>{d.name}</h4>
                  <div className="dignitary-role">{d.role}</div>
                  <p className="dignitary-desc">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DEDICATED FOUNDER STORY SECTION ("माझे मनोगत") */}
      <section className="section founder-section" id="founder-story">
        <div className="container">
          <div className="founder-grid">
            <div className="founder-photo-card">
              <div className="founder-photo-wrapper">
                <img src="/images/founder.jpg" alt="Founder - Shiv Samarth Hapus" />
              </div>
              <div style={{ textAlign: "center", marginTop: 14 }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 19, fontFamily: "'Playfair Display', serif", color: "var(--ink)" }}>
                  {t.founder.founderTitle}
                </h3>
                <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>
                  {t.founder.farmTitle}
                </p>
              </div>

              <div className="founder-stats-strip">
                <div className="founder-stat-item">
                  <strong>{t.founder.stat1Val}</strong>
                  <span>{t.founder.stat1Lbl}</span>
                </div>
                <div className="founder-stat-item">
                  <strong>{t.founder.stat2Val}</strong>
                  <span>{t.founder.stat2Lbl}</span>
                </div>
                <div className="founder-stat-item">
                  <strong>{t.founder.stat3Val}</strong>
                  <span>{t.founder.stat3Lbl}</span>
                </div>
                <div className="founder-stat-item">
                  <strong>{t.founder.stat4Val}</strong>
                  <span>{t.founder.stat4Lbl}</span>
                </div>
              </div>
            </div>

            <div className="founder-story-content">
              <div className="eyebrow">{t.founder.eyebrow}</div>
              <h2 className="serif" style={{ fontSize: "clamp(28px, 3.5vw, 40px)", lineHeight: 1.18, margin: "10px 0 14px", color: "var(--green)" }}>
                {t.founder.title}
              </h2>
              <p style={{ fontSize: 16, color: "var(--gold)", fontWeight: 700, margin: "0 0 20px" }}>
                {t.founder.subtitle}
              </p>

              <p>{t.founder.p1}</p>
              <p>{t.founder.p2}</p>
              <p>{t.founder.p3}</p>
              <p>{t.founder.p4}</p>
              <p>{t.founder.p5}</p>
              <p>{t.founder.p6}</p>

              <div className="founder-quote-box">
                "{t.founder.quote}"
              </div>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 24, alignItems: "center" }}>
                <Link className="btn gold" href="/shop">
                  {t.hero.shopBtn} <ArrowRight size={16} />
                </Link>
                <Link className="btn secondary" href="/story">
                  {isMr ? "सविस्तर प्रवास वाचा" : "Read Complete Journey"} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRODUCTS CATALOG */}
      <section className="section" id="products-catalog">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{t.products.eyebrow}</div>
              <h2>{t.products.title}</h2>
              <p>{t.products.lead}</p>
            </div>
            <Link className="btn secondary" href="/shop">
              {t.products.viewAll} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="product-grid">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. DEVGAD VS OTHER MANGOES COMPARISON GUIDE */}
      <MangoComparison />

      {/* 9. ORGANIC FARMING & NATURAL PRACTICES */}
      <section className="section" style={{ background: "var(--surface)", borderTop: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head-center">
            <div className="eyebrow">{t.farming.eyebrow}</div>
            <h2>{t.farming.title}</h2>
            <p>{t.farming.lead}</p>
          </div>

          <div className="farming-grid">
            <div className="farming-card">
              <div className="farming-card-header">
                <div className="farming-card-icon">
                  <MapPin size={22} />
                </div>
                <span className="farming-card-step">#01</span>
              </div>
              <h3>{t.farming.f1Title}</h3>
              <p>{t.farming.f1Desc}</p>
              <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px dashed var(--line)" }}>
                <span className="showcase-pill">
                  {isMr ? "🌊 कातळ खनिजे" : "🌊 Laterite Terroir"}
                </span>
              </div>
            </div>

            <div className="farming-card">
              <div className="farming-card-header">
                <div className="farming-card-icon">
                  <Leaf size={22} />
                </div>
                <span className="farming-card-step">#02</span>
              </div>
              <h3>{t.farming.f2Title}</h3>
              <p>{t.farming.f2Desc}</p>
              <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px dashed var(--line)" }}>
                <span className="showcase-pill">
                  {isMr ? "🌿 शून्य रसायने" : "🌿 Zero Chemicals"}
                </span>
              </div>
            </div>

            <div className="farming-card">
              <div className="farming-card-header">
                <div className="farming-card-icon">
                  <Sprout size={22} />
                </div>
                <span className="farming-card-step">#03</span>
              </div>
              <h3>{t.farming.f3Title}</h3>
              <p>{t.farming.f3Desc}</p>
              <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px dashed var(--line)" }}>
                <span className="showcase-pill">
                  {isMr ? "🌾 पेंढा आडी" : "🌾 Straw Ripened"}
                </span>
              </div>
            </div>

            <div className="farming-card">
              <div className="farming-card-header">
                <div className="farming-card-icon">
                  <Award size={22} />
                </div>
                <span className="farming-card-step">#04</span>
              </div>
              <h3>{t.farming.f4Title}</h3>
              <p>{t.farming.f4Desc}</p>
              <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px dashed var(--line)" }}>
                <span className="showcase-pill">
                  {isMr ? "🏷️ GI मानांकन" : "🏷️ GI Tag No. 497"}
                </span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 32 }}>
            <Link className="btn secondary" href="/farming">
              {isMr ? "आमच्या शेती पद्धती जाणून घ्या" : "Learn More About Our Farming"} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. CUSTOMER REVIEWS & VERIFIED TESTIMONIALS */}
      <CustomerReviews />

      {/* 11. KONKAN HERITAGE */}
      <section className="section">
        <div className="container">
          <div className="heritage">
            <div>
              <div className="eyebrow" style={{ color: "#e7c27e" }}>{t.heritage.eyebrow}</div>
              <h2 className="serif" style={{ fontSize: "clamp(28px, 3.5vw, 38px)", color: "#fff", margin: "10px 0 14px" }}>
                {t.heritage.title}
              </h2>
              <p>{t.heritage.lead}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "14px 0 18px" }}>
                <span style={{ fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,0.14)", padding: "4px 10px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)" }}>
                  🏰 {isMr ? "सिंधुदुर्ग व विजयदुर्ग" : "Historic Sea Forts"}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,0.14)", padding: "4px 10px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)" }}>
                  🌊 {isMr ? "देवगड समुद्रकिनारा" : "Arabian Sea Terroir"}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,0.14)", padding: "4px 10px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.2)" }}>
                  🥭 {isMr ? "नारिंग्रे शेवाळे बाग" : "20-Acre Family Farm"}
                </span>
              </div>
              <div style={{ marginTop: 22 }}>
                <Link className="btn gold" href="/heritage">
                  {t.heritage.exploreBtn} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="heritage-image" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, background: "rgba(16, 44, 34, 0.88)", backdropFilter: "blur(6px)", padding: "8px 14px", borderRadius: 12, color: "#fff", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "space-between", border: "1px solid rgba(255,255,255,0.15)" }}>
                <span>📍 {isMr ? "नारिंग्रे, देवगड (सिंधुदुर्ग)" : "Naringre, Devgad (Sindhudurg)"}</span>
                <span style={{ color: "#f7d58b", fontWeight: 700 }}>३५०+ वर्षे वारसा</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FARM & HARVEST GALLERY PREVIEW */}
      <section className="section" style={{ background: "var(--surface)", borderTop: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">{t.gallery.eyebrow}</div>
              <h2>{t.gallery.title}</h2>
              <p>{t.gallery.lead}</p>
            </div>
            <Link className="btn secondary" href="/gallery">
              {isMr ? "सर्व फोटो पहा" : "View Full Gallery"} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="gallery-grid">
            {galleryPreview.map((item, idx) => (
              <div key={idx} className="gallery-card">
                <img src={item.img} alt={item.caption} />
                <p>{item.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
