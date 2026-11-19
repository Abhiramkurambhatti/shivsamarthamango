"use client";

import Link from "next/link";
import { ArrowRight, Compass, MapPin, Landmark, Anchor, Shield, MessageCircle } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { translations, Language } from "@/lib/translations";

export default function HeritagePage() {
  const s = useStore();
  const lang = (s.lang === "mr" ? "mr" : "en") as Language;
  const t = translations[lang];
  const isMr = lang === "mr";

  const heritageSites = [
    {
      num: "#01",
      icon: <Landmark size={22} />,
      title: t.heritage.h1Title,
      img: "/images/sindhudurg.jpg",
      desc: t.heritage.h1Desc,
      tag: isMr ? "🏰 इ.स. १६६४ • छत्रपती शिवाजी महाराज जलदुर्ग" : "🏰 1664 CE • Sea Fortress of Shivaji Maharaj",
      loc: isMr ? "📍 मालवण, सिंधुदुर्ग" : "📍 Malvan, Sindhudurg",
      pills: isMr
        ? ["कुरटे बेट जलदुर्ग", "महाराजांच्या हस्त व पाऊलखुणा", "अभेद्य ४८ बुरुज"]
        : ["Kurte Island Fortress", "Historic Royal Footprints", "48 Imposing Bastions"],
    },
    {
      num: "#02",
      icon: <Compass size={22} />,
      title: t.heritage.h2Title,
      img: "/images/ripe-mangoes.jpg",
      desc: t.heritage.h2Desc,
      tag: isMr ? "🌊 देवगड समुद्र किनारपट्टी व कातळ" : "🌊 Devgad Coastline & Laterite Katal",
      loc: isMr ? "📍 देवगड, सिंधुदुर्ग" : "📍 Devgad, Sindhudurg",
      pills: isMr
        ? ["लाल जांभा कातळ खनिजे", "अरबी समुद्राची खारी हवा", "अस्सल हापूसचे माहेरघर"]
        : ["Red Laterite Minerals", "Maritime Coastal Breeze", "Global Home of Alphonso"],
    },
    {
      num: "#03",
      icon: <Anchor size={22} />,
      title: t.heritage.h3Title,
      img: "/images/vijaydurg.jpg",
      desc: t.heritage.h3Desc,
      tag: isMr ? "⚓ अजिंक्य सागरी दुर्ग • मराठा आरमार" : "⚓ Impregnable Victory Fort • Maratha Navy",
      loc: isMr ? "📍 विजयदुर्ग, देवगड" : "📍 Vijaydurg, Devgad",
      pills: isMr
        ? ["वाघोटन खाडीचे मुख", "कान्होजी आंग्रे आरमार केंद्र", "ऐतिहासिक सागरी तटबंदी"]
        : ["Vaghotan Estuary", "Kanhoji Angre Naval Base", "Tri-Layered Coastal Walls"],
    },
    {
      num: "#04",
      icon: <Shield size={22} />,
      title: t.heritage.h4Title,
      img: "/images/founder-orchard.jpg",
      desc: t.heritage.h4Desc,
      tag: isMr ? "🥭 २० एकर स्वमालकीची ऐतिहासिक बाग" : "🥭 20-Acre Shewale Family Coastal Orchard",
      loc: isMr ? "📍 नारिंग्रे, देवगड" : "📍 Naringre, Devgad",
      pills: isMr
        ? ["समुद्रकिनाऱ्यालगत नारिंग्रे गाव", "मातब्बर जुनी हापूस झाडे", "शिवसमर्थ शेवाळे वारसा"]
        : ["Coastal Naringre Valley", "Mature Heritage Trees", "Shewale Family Tradition"],
    },
  ];

  const heritageBadges = [
    { icon: "🏰", text: isMr ? "छत्रपती शिवाजी महाराज सागरी दुर्ग" : "Shivaji Maharaj Forts" },
    { icon: "🌊", text: isMr ? "अरबी समुद्र किनारपट्टी" : "Arabian Sea Coastline" },
    { icon: "⚓", text: isMr ? "मराठा आरमाराची राजधानी" : "Historic Maratha Navy" },
    { icon: "🥭", text: isMr ? "शतकांची हापूस शेती परंपरा" : "Alphonso Orchard Legacy" },
  ];

  const waMessage = encodeURIComponent(
    isMr
      ? "नमस्कार! मला देवगड कोकण वारसा आणि शिवसमर्थ हापूसच्या नारिंग्रे बागेतील आंब्यांबद्दल माहिती हवी आहे."
      : "Hello! I would like to know more about Devgad Konkan heritage and Shivsamarth mangoes."
  );

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      {/* Header */}
      <div className="page-title" style={{ textAlign: "center", maxWidth: 840, margin: "0 auto" }}>
        <div className="eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Landmark size={14} /> {t.heritage.eyebrow}
        </div>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 46px)", margin: "12px 0 16px", color: "var(--green)" }}>
          {t.heritage.title}
        </h1>
        <p className="muted" style={{ fontSize: "clamp(15px, 1.8vw, 17px)", lineHeight: 1.7 }}>
          {t.heritage.lead}
        </p>

        {/* Quick Trust / Heritage Badges */}
        <div className="showcase-trust-bar">
          {heritageBadges.map((badge, i) => (
            <span key={i} className="trust-pill">
              <span>{badge.icon}</span> {badge.text}
            </span>
          ))}
        </div>
      </div>

      {/* Responsive Showcase Grid (1 column on mobile, 2 columns on desktop) */}
      <div className="feature-showcase-grid">
        {heritageSites.map((site, idx) => (
          <div key={idx} className="feature-showcase-card">
            {/* Top Photo with Badges */}
            <div className="showcase-card-img-wrap">
              <img src={site.img} alt={site.title} />
              <div className="showcase-card-badge">
                {site.icon} <span>{site.num}</span>
              </div>
              <div className="showcase-card-tag">
                <span>{site.tag}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="showcase-card-body">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                <h2 className="showcase-card-title" style={{ margin: 0 }}>
                  {site.title}
                </h2>
              </div>

              <div style={{ fontSize: 13, color: "var(--gold)", fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
                <MapPin size={13} /> {site.loc}
              </div>

              <p className="showcase-card-desc">{site.desc}</p>

              {/* Micro-feature pills */}
              <div className="showcase-pill-list">
                {site.pills.map((pill, pi) => (
                  <span key={pi} className="showcase-pill">
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Heritage Stats & Culture Banner */}
      <div className="guarantee-banner">
        <div className="eyebrow" style={{ color: "var(--gold)", fontWeight: 700 }}>
          {isMr ? "🌊 कोकणची लाल माती आणि सागरी वारसा" : "🌊 RED LATERITE SOIL & COASTAL LEGACY"}
        </div>
        <h3 className="serif" style={{ fontSize: "clamp(22px, 3vw, 32px)", color: "var(--green)", margin: "8px 0 12px" }}>
          {isMr ? "शतकांची शेती परंपरा आणि छत्रपतींचा गौरवशाली इतिहास" : "Centuries of Orchard Heritage and Maratha Sea Fortress Legacy"}
        </h3>
        <p style={{ maxWidth: 680, margin: "0 auto", color: "var(--muted)", fontSize: 15, lineHeight: 1.65 }}>
          {isMr
            ? "देवगडची भौगोलिक स्थिती अद्वितीय आहे. अरबी समुद्राची खारी झुळूक, जांभा कातळातील नैसर्गिक खनिजे आणि नारिंग्रे खोऱ्यातील मुबलक सूर्यप्रकाश यामुळेच येथे पिकणाऱ्या हापूसला जगातील सर्वोच्च गोडी व सुवास लाभतो."
            : "Devgad's geographical terroir is irreplaceable. The saline sea breeze, rich red laterite minerals, and coastal sunlight unite to produce the legendary golden Alphonso cherished globally."}
        </p>

        {/* 3 Heritage Stats */}
        <div className="guarantee-grid">
          <div className="guarantee-item">
            <div className="guarantee-item-icon">🏰</div>
            <h4>{isMr ? "३५०+ वर्षांचा वारसा" : "350+ Years Legacy"}</h4>
            <p>
              {isMr
                ? "सिंधुदुर्ग व विजयदुर्ग या अजिंक्य सागरी किल्ल्यांच्या साक्षीने वसलेली देवगडची गौरवशाली भूमी."
                : "Guardians of the sea — standing strong beside Sindhudurg and Vijaydurg marine fortresses."}
            </p>
          </div>

          <div className="guarantee-item">
            <div className="guarantee-item-icon">🪨</div>
            <h4>{isMr ? "१००% जांभा कातळ माती" : "Devgad Katal Soil"}</h4>
            <p>
              {isMr
                ? "पाण्याचा निचरा करणारी सच्छिद्र जांभा जमीन आंब्याच्या झाडांना नैसर्गिक खनिजे पुरवते."
                : "Porous red laterite rock beds that drain excess monsoon water and infuse rich coastal minerals."}
            </p>
          </div>

          <div className="guarantee-item">
            <div className="guarantee-item-icon">🥭</div>
            <h4>{isMr ? "२० एकर स्वमालकीची बाग" : "20-Acre Family Farm"}</h4>
            <p>
              {isMr
                ? "नारिंग्रे गावात पिढ्यानपिढ्या जतन केलेली अस्सल जुनी हापूस झाडे आणि प्रामाणिक शेती."
                : "Decades of dedicated stewardship by the Shewale family in the coastal heart of Naringre."}
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
            {isMr ? "बागेबद्दल अधिक जाणून घ्या" : "Inquire on WhatsApp"}
          </a>
        </div>
      </div>
    </main>
  );
}
