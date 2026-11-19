"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Sun, Moon, Languages, Menu, Phone, MapPin, Mail, ShieldCheck, Lock } from "lucide-react";
import { useStore } from "./StoreProvider";
import { whatsappUrl } from "@/lib/config";
import { translations, Language } from "@/lib/translations";

export function SiteHeader() {
  const pathname = usePathname();
  if (pathname === "/admin-dashboard") return null;

  const s = useStore();
  const currentLang = (s.lang === "mr" ? "mr" : "en") as Language;
  const t = translations[currentLang];
  const isMr = currentLang === "mr";

  const toggleLanguage = () => {
    s.setLang(isMr ? "en" : "mr");
  };

  return (
    <>
      <div className="topline">
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px" }}>
          <span>{t.topline}</span>
          <span style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <MapPin size={12} /> {isMr ? "नारिंग्रे, ता. देवगड" : "Naringre, Devgad"}
            </span>
            <a href="tel:+919552050093" style={{ color: "#fff", display: "inline-flex", alignItems: "center", gap: 4 }}>
              <Phone size={12} /> +91 95520 50093
            </a>
          </span>
        </div>
      </div>

      <header className="header">
        <div className="container nav">
          <Link className="brand" href="/">
            <span className="brandmark">✦</span>
            <span>
              SHIV SAMARTH
              <br />
              <small style={{ fontFamily: "DM Sans", fontSize: 9, letterSpacing: ".18em", color: "var(--gold)", fontWeight: 700 }}>
                {isMr ? "देवगड हापूस" : "DEVGAD HAPUS"}
              </small>
            </span>
          </Link>

          <nav className="navlinks">
            <Link href="/" style={{ fontWeight: pathname === "/" ? 700 : 500 }}>{t.nav.home}</Link>
            <Link href="/story" style={{ fontWeight: pathname === "/story" ? 700 : 500 }}>{t.nav.story}</Link>
            <Link href="/shop" style={{ fontWeight: pathname === "/shop" ? 700 : 500 }}>{t.nav.shop}</Link>
            <Link href="/farming" style={{ fontWeight: pathname === "/farming" ? 700 : 500 }}>{t.nav.farming}</Link>
            <Link href="/heritage" style={{ fontWeight: pathname === "/heritage" ? 700 : 500 }}>{t.nav.heritage}</Link>
            <Link href="/gallery" style={{ fontWeight: pathname === "/gallery" ? 700 : 500 }}>{t.nav.gallery}</Link>
            <Link href="/contact" style={{ fontWeight: pathname === "/contact" ? 700 : 500 }}>{t.nav.contact}</Link>
            <Link href="/track-order" style={{ fontWeight: pathname === "/track-order" ? 700 : 500, color: "var(--gold)" }}>
              {isMr ? "ऑर्डर ट्रॅक करा" : "Track Order"}
            </Link>
          </nav>

          <div className="navtools">
            <button
              className="langbtn"
              onClick={toggleLanguage}
              title={isMr ? "Switch to English" : "मराठीत बदला"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 700,
                background: isMr ? "#214638" : "#fff",
                color: isMr ? "#fff" : "#214638",
                border: "1.5px solid #214638",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                cursor: "pointer",
                padding: "6px 12px",
                fontSize: 13,
              }}
            >
              <Languages size={15} />
              <span>{isMr ? "मराठी ⇄ EN" : "English ⇄ मराठी"}</span>
            </button>

            <button className="iconbtn" aria-label="Toggle theme" onClick={s.toggleTheme}>
              {s.theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <Link className="iconbtn" href="/cart" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700 }}>
              <ShoppingBag size={16} /> {s.count}
            </Link>

            <Link
              className="iconbtn"
              href="/admin-dashboard"
              title={isMr ? "व्यवस्थापक नियंत्रण कक्ष (Admin Panel)" : "Admin Panel (Restricted)"}
              aria-label="Admin Portal"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "rgba(200, 154, 75, 0.12)",
                border: "1.5px solid rgba(200, 154, 75, 0.45)",
                color: "var(--gold)",
                borderRadius: 99,
                padding: "6px 12px",
                fontWeight: 700,
                fontSize: 12,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(200, 154, 75, 0.15)",
                transition: "all 0.2s ease",
              }}
            >
              <ShieldCheck size={15} />
              <span>{isMr ? "व्यवस्थापक" : "Admin"}</span>
            </Link>

            <button className="iconbtn mobile-menu" aria-label="Shop" onClick={() => (location.href = "/shop")}>
              <Menu size={17} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/admin-dashboard") return null;

  const s = useStore();
  const currentLang = (s.lang === "mr" ? "mr" : "en") as Language;
  const t = translations[currentLang];
  const isMr = currentLang === "mr";

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand" style={{ color: "#fff", marginBottom: 12 }}>
            <span className="brandmark">✦</span>
            <span>
              SHIV SAMARTH HAPUS
              <br />
              <small style={{ fontFamily: "DM Sans", fontSize: 10, letterSpacing: ".16em", color: "var(--gold)" }}>
                {isMr ? "शेवाळे ॲग्रो फार्म · नारिंग्रे, देवगड" : "SHEWALE AGRO FARM · DEVGAD"}
              </small>
            </span>
          </div>
          <p style={{ lineHeight: 1.7, maxWidth: 360 }}>{t.footer.about}</p>
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <span className="pill" style={{ background: "#2a4d3f", color: "#e6f0e9", border: "1px solid #3d6957" }}>
              ✓ {isMr ? "२० एकर नारिंग्रे बाग" : "20-Acre Orchard"}
            </span>
            <span className="pill" style={{ background: "#2a4d3f", color: "#e6f0e9", border: "1px solid #3d6957" }}>
              ✓ {isMr ? "GI Tag प्रमाणित" : "GI Tag Certified"}
            </span>
            <span className="pill" style={{ background: "#2a4d3f", color: "#e6f0e9", border: "1px solid #3d6957" }}>
              ✓ {isMr ? "१००% नैसर्गिक" : "100% Organic"}
            </span>
          </div>
        </div>

        <div>
          <h3>{t.footer.exploreTitle}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
            <Link href="/">{t.nav.home}</Link>
            <Link href="/story">{t.nav.story}</Link>
            <Link href="/shop">{t.nav.shop}</Link>
            <Link href="/farming">{t.nav.farming}</Link>
            <Link href="/heritage">{t.nav.heritage}</Link>
            <Link href="/gallery">{t.nav.gallery}</Link>
            <Link href="/contact">{t.nav.contact}</Link>
            <Link href="/track-order">{isMr ? "ऑर्डर ट्रॅक करा (Track Order)" : "Track Order"}</Link>
            <Link
              href="/admin-dashboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                color: "var(--gold)",
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              <Lock size={12} /> {isMr ? "व्यवस्थापक प्रवेश" : "Admin Portal"}
            </Link>
          </div>
        </div>

        <div>
          <h3>{t.footer.contactTitle}</h3>
          <div style={{ marginTop: 12, lineHeight: 1.8, fontSize: 13 }}>
            <p style={{ display: "flex", alignItems: "flex-start", gap: 8, margin: "0 0 10px" }}>
              <MapPin size={18} style={{ flexShrink: 0, marginTop: 2, color: "var(--gold)" }} />
              <span>{t.footer.address}</span>
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 10px" }}>
              <Phone size={15} style={{ color: "var(--gold)" }} />
              <a href="tel:+919552050093" style={{ color: "#fff" }}>+91 95520 50093</a>
            </p>
            <p style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 0 10px" }}>
              <Mail size={15} style={{ color: "var(--gold)" }} />
              <a href="mailto:shivsamartha@gmail.com" style={{ color: "#fff" }}>shivsamartha@gmail.com</a>
            </p>
            <div style={{ marginTop: 12 }}>
              <a
                href={whatsappUrl("Namaskar, I would like to enquire about Shiv Samarth Devgad Hapus mangoes.")}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#1c9b58",
                  color: "#fff",
                  padding: "7px 14px",
                  borderRadius: 99,
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                💬 {isMr ? "व्हॉट्सॲपवर संपर्क करा" : "WhatsApp Direct"}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container"
        style={{
          borderTop: "1px solid #ffffff20",
          marginTop: 36,
          paddingTop: 20,
          fontSize: 12,
          color: "#c6d3c8",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span>© {new Date().getFullYear()} {t.footer.rights}</span>
        <span>{t.footer.developedBy}</span>
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  const pathname = usePathname();
  if (pathname === "/admin-dashboard") return null;

  const s = useStore();
  const isMr = s.lang === "mr";

  return (
    <a
      className="whatsapp"
      href={whatsappUrl(
        isMr
          ? "नमस्कार, मला शिवसमर्थ देवगड हापूस आंब्याविषयी अधिक माहिती हवी आहे."
          : "Namaskar, I would like to enquire about Shiv Samarth Devgad Hapus mangoes."
      )}
      target="_blank"
      rel="noreferrer"
      style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
    >
      💬 <span>{isMr ? "व्हॉट्सॲपवर संपर्क" : "WhatsApp Us"}</span>
    </a>
  );
}
