"use client";

import Link from "next/link";
import { ArrowRight, Leaf, MapPin, Award, CheckCircle2, ShieldCheck, Heart } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { translations, Language } from "@/lib/translations";

export default function StoryPage() {
  const s = useStore();
  const lang = (s.lang === "mr" ? "mr" : "en") as Language;
  const t = translations[lang];
  const isMr = lang === "mr";

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <div className="page-title" style={{ textAlign: "center", maxWidth: 840, margin: "0 auto" }}>
        <div className="eyebrow">{t.founder.eyebrow}</div>
        <h1 style={{ fontSize: "clamp(32px, 4.5vw, 48px)", margin: "10px 0 16px", color: "var(--green)" }}>
          {t.founder.title}
        </h1>
        <p style={{ fontSize: 18, color: "var(--gold)", fontWeight: 700, margin: "0 0 12px" }}>
          {t.founder.subtitle}
        </p>
        <p className="muted" style={{ fontSize: 16 }}>
          {isMr
            ? "पुण्यातील एक आंबा खवय्या ते देवगडच्या नारिंग्रे गावातील २० एकर सेंद्रिय बागेचा मालक — एका आंबाप्रेमीचा प्रामाणिक ध्यास."
            : "From a passionate mango connoisseur in Pune to the proud custodian of a 20-acre organic orchard in Naringre, Devgad — an authentic journey of love for Alphonso."}
        </p>
      </div>

      <div className="founder-grid" style={{ marginTop: 36 }}>
        {/* Left Column: Founder Photo & Farm Badges */}
        <div className="founder-photo-card">
          <div className="founder-photo-wrapper">
            <img src="/images/founder.jpg" alt="Founder of Shiv Samarth Hapus" />
          </div>
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 20, fontFamily: "'Playfair Display', serif" }}>
              {t.founder.founderTitle}
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
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

          <div style={{ marginTop: 20, padding: "16px", background: "var(--soft)", borderRadius: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, color: "var(--green)", fontWeight: 700 }}>
              <ShieldCheck size={18} />
              <span>{isMr ? "आमची ४ मुख्य वचने" : "Our 4 Core Promises"}</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
              <li>{isMr ? "१००% नैसर्गिक व सेंद्रिय शेती" : "100% Organic & Residue-Free Farming"}</li>
              <li>{isMr ? "कोणतेही रासायनिक खते किंवा कीटकनाशके नाहीत" : "Zero Chemical Sprays or Adulterants"}</li>
              <li>{isMr ? "कार्बाईड मुक्त – गवताच्या आडीत पिकवलेला" : "Carbide-Free – Natural Straw-Bed Ripening"}</li>
              <li>{isMr ? "थेट बागेतून आपल्या दारात पोच" : "Direct Orchard-to-Doorstep Delivery"}</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Full Narrative */}
        <div className="founder-story-content">
          <div className="content-card" style={{ padding: 36 }}>
            <h2 className="serif" style={{ fontSize: 28, color: "var(--green)", margin: "0 0 16px" }}>
              {isMr ? "देवगड हापूस आंब्यावरील निष्ठा आणि सुरुवात" : "Unwavering Devotion to Devgad Alphonso"}
            </h2>

            <p>{t.founder.p1}</p>
            <p>{t.founder.p2}</p>
            <p>{t.founder.p3}</p>

            <div style={{ margin: "28px 0" }}>
              <img
                src="/images/founder-orchard.jpg"
                alt="Founder inspecting mangoes on tree"
                style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 18 }}
              />
              <span style={{ display: "block", fontSize: 12, color: "var(--muted)", marginTop: 6, fontStyle: "italic" }}>
                {isMr
                  ? "नारिंग्रे येथील बागेत उत्तम कलमांवरील आंब्यांची स्वतः पाहणी करताना संस्थापक."
                  : "Founder inspecting healthy Alphonso fruit clusters on 20-acre orchard in Naringre."}
              </span>
            </div>

            <h3 className="serif" style={{ fontSize: 24, color: "var(--green)", margin: "24px 0 12px" }}>
              {isMr ? "पुणे ते देवगड – ३७५ किमीचा ध्यास" : "Pune to Devgad – A 375 km Calling"}
            </h3>

            <p>{t.founder.p4}</p>
            <p>{t.founder.p5}</p>
            <p>{t.founder.p6}</p>

            <div className="founder-quote-box">
              "{t.founder.quote}"
            </div>

            <div style={{ margin: "28px 0" }}>
              <img
                src="/images/founder-harvest.jpg"
                alt="Harvest and straw bed grading"
                style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 18 }}
              />
              <span style={{ display: "block", fontSize: 12, color: "var(--muted)", marginTop: 6, fontStyle: "italic" }}>
                {isMr
                  ? "पारंपरिक गवताच्या आडीत (पेंढा) आंब्याची प्रतवारी करताना."
                  : "Traditional hand-sorting and natural straw-bed (aadi) ripening at the farm."}
              </span>
            </div>

            <div style={{ marginTop: 32, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link className="btn gold" href="/shop">
                {isMr ? "अस्सल देवगड हापूस खरेदी करा" : "Shop Authentic Devgad Mangoes"} <ArrowRight size={17} />
              </Link>
              <Link className="btn secondary" href="/contact">
                {isMr ? "आमच्याशी संपर्क साधा" : "Get in Touch"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
