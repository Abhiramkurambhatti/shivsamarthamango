"use client";

import { useState } from "react";
import { API_URL, whatsappUrl } from "@/lib/config";
import { useStore } from "@/components/StoreProvider";
import { translations, Language } from "@/lib/translations";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function ContactPage() {
  const s = useStore();
  const lang = (s.lang === "mr" ? "mr" : "en") as Language;
  const t = translations[lang];
  const isMr = lang === "mr";

  const [f, setF] = useState({ name: "", phone: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(false);

  const change = (e: any) => setF({ ...f, [e.target.name]: e.target.value });

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setErr(false);
    try {
      const r = await fetch(`${API_URL}/enquiries/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      if (!r.ok) throw 0;
      setMsg(t.contact.success);
      setF({ name: "", phone: "", email: "", message: "" });
    } catch {
      setErr(true);
      setMsg(t.contact.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <div className="page-title" style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
        <div className="eyebrow">{t.contact.eyebrow}</div>
        <h1 style={{ fontSize: "clamp(32px, 4.5vw, 48px)", margin: "10px 0 16px", color: "var(--green)" }}>
          {t.contact.title}
        </h1>
      </div>

      <div className="story-grid" style={{ marginTop: 30 }}>
        <form className="content-card" onSubmit={submit}>
          <div className="form-grid">
            <div className="field">
              <label>{t.contact.name} *</label>
              <input name="name" value={f.name} onChange={change} required placeholder={isMr ? "उदा. सचिन पवार" : "e.g. Rahul Patil"} />
            </div>
            <div className="field">
              <label>{t.contact.phone} *</label>
              <input name="phone" value={f.phone} onChange={change} required placeholder="+91 98000 00000" />
            </div>
            <div className="field full">
              <label>{t.contact.email}</label>
              <input name="email" type="email" value={f.email} onChange={change} placeholder="name@example.com" />
            </div>
            <div className="field full">
              <label>{t.contact.message} *</label>
              <textarea
                name="message"
                rows={5}
                value={f.message}
                onChange={change}
                required
                placeholder={isMr ? "उदा. मला ३ पेट्या देवगड हापूस पुण्यात मागवायच्या आहेत." : "e.g. I would like to order 3 petis of Alphonso mangoes to Pune."}
              />
            </div>
          </div>

          <button className="btn gold" style={{ marginTop: 18 }} disabled={loading}>
            <Send size={16} /> {loading ? t.contact.sending : t.contact.sendBtn}
          </button>

          {msg && (
            <p className="notice" style={{ marginTop: 16, borderColor: err ? "red" : "var(--green)", color: "var(--ink)" }}>
              {msg}
            </p>
          )}
        </form>

        <div className="content-card">
          <h2 className="serif" style={{ fontSize: 24, color: "var(--green)", margin: "0 0 16px" }}>
            {t.contact.visitTitle}
          </h2>

          <div style={{ lineHeight: 1.8, fontSize: 14 }}>
            <p style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
              <MapPin size={20} color="var(--gold)" style={{ flexShrink: 0, marginTop: 4 }} />
              <span style={{ whiteSpace: "pre-line" }}>{t.contact.address}</span>
            </p>

            <p style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
              <Phone size={18} color="var(--gold)" />
              <span>
                <strong>{t.contact.phoneLabel}</strong>{" "}
                <a href="tel:+919552050093" style={{ color: "var(--green)", fontWeight: 700 }}>
                  +91 95520 50093
                </a>
              </span>
            </p>

            <p style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
              <Mail size={18} color="var(--gold)" />
              <span>
                <strong>{t.contact.emailLabel}</strong>{" "}
                <a href="mailto:shivsamartha@gmail.com" style={{ color: "var(--green)", fontWeight: 700 }}>
                  shivsamartha@gmail.com
                </a>
              </span>
            </p>

            <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
              <a
                className="btn"
                style={{ background: "#1c9b58", width: "100%", justifyContent: "center" }}
                href={whatsappUrl(
                  isMr
                    ? "नमस्कार, मला शिवसमर्थ देवगड हापूस आंब्याविषयी विचारणा करायची आहे."
                    : "Namaskar, I would like to enquire about ordering Shiv Samarth Devgad Alphonso mangoes."
                )}
                target="_blank"
                rel="noreferrer"
              >
                💬 {isMr ? "व्हॉट्सॲपवर त्वरित संपर्क" : "Direct WhatsApp Order"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
