"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Sun, Moon, Languages, Menu, X, Phone, MapPin, Mail, ShieldCheck, Lock, ExternalLink, ChevronRight } from "lucide-react";
import { useStore } from "./StoreProvider";
import { whatsappUrl, WHATSAPP_NUMBER } from "@/lib/config";
import { translations, Language } from "@/lib/translations";

export function SiteHeader() {
  const pathname = usePathname();
  if (pathname === "/admin-dashboard") return null;

  const s = useStore();
  const currentLang = (s.lang === "mr" ? "mr" : "en") as Language;
  const t = translations[currentLang];
  const isMr = currentLang === "mr";

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const toggleLanguage = () => {
    s.setLang(isMr ? "en" : "mr");
  };

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/story", label: t.nav.story },
    { href: "/shop", label: t.nav.shop, highlight: true },
    { href: "/farming", label: t.nav.farming },
    { href: "/heritage", label: t.nav.heritage },
    { href: "/gallery", label: t.nav.gallery },
    { href: "/contact", label: t.nav.contact },
    { href: "/track-order", label: isMr ? "ऑर्डर ट्रॅक करा" : "Track Order" },
  ];

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="topline">
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "12px",
            flexWrap: "wrap",
            gap: "4px 12px",
          }}
        >
          <span style={{ fontWeight: 600 }}>{t.topline}</span>
          <span style={{ display: "inline-flex", gap: "14px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, opacity: 0.9 }}>
              <MapPin size={12} /> {isMr ? "नारिंग्रे, ता. देवगड" : "Naringre, Devgad"}
            </span>
            <a href="tel:+919552050093" style={{ color: "#fff", display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none", fontWeight: 700 }}>
              <Phone size={12} /> +91 95520 50093
            </a>
          </span>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER */}
      <header className="header">
        <div className="container nav">
          {/* Brand Logo */}
          <Link className="brand" href="/" style={{ textDecoration: "none" }}>
            <span className="brandmark">✦</span>
            <span>
              SHIV SAMARTH
              <br />
              <small style={{ fontFamily: "DM Sans", fontSize: 9, letterSpacing: ".18em", color: "var(--gold)", fontWeight: 700 }}>
                {isMr ? "देवगड हापूस" : "DEVGAD HAPUS"}
              </small>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="navlinks">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontWeight: pathname === item.href ? 700 : 500,
                  color: item.highlight && pathname !== item.href ? "var(--green)" : pathname === item.href ? "var(--green)" : undefined,
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action Tools */}
          <div className="navtools">
            {/* Language Switcher */}
            <button
              className="langbtn"
              onClick={toggleLanguage}
              title={isMr ? "Switch to English" : "मराठीत बदला"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontWeight: 700,
                background: isMr ? "#214638" : "#fff",
                color: isMr ? "#fff" : "#214638",
                border: "1.5px solid #214638",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                cursor: "pointer",
                padding: "6px 10px",
                fontSize: 12,
              }}
            >
              <Languages size={14} />
              <span>{isMr ? "मराठी" : "EN"}</span>
            </button>

            {/* Theme Toggle */}
            <button className="iconbtn" aria-label="Toggle theme" onClick={s.toggleTheme} style={{ padding: "8px 10px" }}>
              {s.theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            {/* Cart Icon & Count */}
            <Link className="iconbtn" href="/cart" aria-label="Cart" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 700, padding: "8px 11px" }}>
              <ShoppingBag size={15} />
              <span>{s.count}</span>
            </Link>

            {/* Admin Badge (Desktop) */}
            <Link
              className="iconbtn desktop-admin-badge"
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
                padding: "6px 11px",
                fontWeight: 700,
                fontSize: 12,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(200, 154, 75, 0.15)",
                transition: "all 0.2s ease",
              }}
            >
              <ShieldCheck size={14} />
              <span className="admin-text">{isMr ? "व्यवस्थापक" : "Admin"}</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              className="iconbtn mobile-menu"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ padding: "8px 10px", display: "inline-flex", alignItems: "center" }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* 3. MOBILE SLIDING DRAWER MENU */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(15, 28, 21, 0.65)",
              backdropFilter: "blur(4px)",
              transition: "opacity 0.25s ease",
            }}
          />

          {/* Drawer Content */}
          <div
            style={{
              position: "relative",
              width: "min(320px, 86vw)",
              height: "100%",
              background: "var(--surface, #ffffff)",
              borderLeft: "1.5px solid var(--line, #e9e0d1)",
              boxShadow: "-8px 0 32px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              zIndex: 2,
              overflowY: "auto",
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: "20px 20px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--line, #e9e0d1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="brandmark" style={{ width: 32, height: 32, fontSize: 16 }}>✦</span>
                <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 16, color: "var(--green)" }}>
                  SHIV SAMARTH
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "var(--muted)",
                  padding: 4,
                  cursor: "pointer",
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Drawer Links */}
            <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: "12px 16px",
                      borderRadius: 12,
                      background: isActive ? "rgba(33, 70, 56, 0.08)" : "transparent",
                      color: isActive ? "var(--green)" : "var(--ink)",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 15,
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={16} color={isActive ? "var(--green)" : "#94a3b8"} />
                  </Link>
                );
              })}
            </div>

            {/* Quick Actions in Drawer */}
            <div
              style={{
                marginTop: "auto",
                padding: "18px 16px 24px",
                borderTop: "1px solid var(--line, #e9e0d1)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                background: "var(--bg, #faf7f0)",
              }}
            >
              {/* WhatsApp Quick Order Button */}
              <a
                href={whatsappUrl("Namaskar, I would like to place an order for Shiv Samarth Devgad Hapus mangoes.")}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "#1c9b58",
                  color: "#fff",
                  padding: "11px 16px",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  textDecoration: "none",
                  boxShadow: "0 4px 12px rgba(28, 155, 88, 0.25)",
                }}
              >
                <span>💬</span>
                <span>{isMr ? "व्हॉट्सॲप थेट ऑर्डर" : "WhatsApp Direct Order"}</span>
              </a>

              {/* Admin Portal Link */}
              <Link
                href="/admin-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "9px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(200, 154, 75, 0.4)",
                  background: "#fff",
                  color: "var(--gold)",
                  fontWeight: 700,
                  fontSize: 12,
                  textDecoration: "none",
                }}
              >
                <Lock size={13} />
                <span>{isMr ? "व्यवस्थापक कक्ष (Admin Login)" : "Admin Portal Login"}</span>
              </Link>

              {/* Contact Footer in drawer */}
              <div style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                📞 +91 95520 50093 · नारिंग्रे, देवगड
              </div>
            </div>
          </div>
        </div>
      )}
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
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
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
