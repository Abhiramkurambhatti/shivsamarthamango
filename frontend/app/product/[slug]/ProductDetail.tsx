"use client";

import { useStore } from "@/components/StoreProvider";
import { whatsappUrl } from "@/lib/config";
import { ShoppingCart, Award, CheckCircle2, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductDetail({ p }: { p: any }) {
  const s = useStore();
  const isMr = s.lang === "mr";

  return (
    <main className="container section" style={{ paddingBottom: 60 }}>
      <div style={{ marginBottom: 20 }}>
        <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
          <ArrowLeft size={16} /> {isMr ? "मागे (सर्व उत्पादने)" : "Back to All Products"}
        </Link>
      </div>

      <div className="story-grid" style={{ alignItems: "center", gap: 44 }}>
        <div style={{ borderRadius: 24, overflow: "hidden", border: "1px solid var(--line)", background: "var(--soft)", boxShadow: "0 12px 36px rgba(0,0,0,0.06)" }}>
          <img src={p.image_url} alt={p.name} style={{ width: "100%", maxHeight: 480, objectFit: "cover", display: "block" }} />
        </div>

        <div>
          <div className="eyebrow" style={{ color: "var(--gold)" }}>
            {isMr ? "॥ शिवसमर्थ देवगड हापूस ॥" : "Shiv Samarth Devgad Hapus"}
          </div>
          <h1 className="serif" style={{ fontSize: "clamp(32px, 4vw, 44px)", margin: "8px 0 12px", color: "var(--green)" }}>
            {isMr && p.name_mr ? p.name_mr : p.name}
          </h1>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
            <span className="pill">{p.weight_kg} kg {isMr ? "पेटी" : "box"}</span>
            <span className="pill" style={{ background: "rgba(33, 70, 56, 0.1)", color: "var(--green)" }}>
              ✓ {isMr ? "१००% सेंद्रिय व नैसर्गिक" : "100% Organic & Natural"}
            </span>
            <span className="pill" style={{ background: "rgba(200, 154, 75, 0.15)", color: "var(--gold)" }}>
              ✓ {isMr ? "GI Tag प्रमाणित" : "GI Tag Certified"}
            </span>
          </div>

          <div className="price" style={{ fontSize: 32, margin: "14px 0" }}>
            ₹{Number(p.price).toLocaleString("en-IN")}
          </div>

          <p className="story-copy" style={{ fontSize: 15, lineHeight: 1.8, marginBottom: 20 }}>
            {isMr && p.description_mr ? p.description_mr : p.description}
          </p>

          <div style={{ padding: "14px 18px", background: "var(--soft)", borderRadius: 14, marginBottom: 24, fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
            <div style={{ fontWeight: 700, color: "var(--green)", marginBottom: 4 }}>
              {isMr ? "✓ नारिंग्रे, देवगड बागेतून थेट पाठवणी" : "✓ Direct Dispatch from Naringre, Devgad"}
            </div>
            {isMr
              ? "पारंपरिक गवताच्या आडीत पिकवून सुरक्षित बॉक्समध्ये थेट आपल्या दारात पोहोचवले जाईल."
              : "Naturally straw-ripened and dispatched in specialized protective packaging directly to your home."}
          </div>

          <div className="actions" style={{ gap: 14 }}>
            <button className="btn gold" onClick={() => s.add(p)} style={{ padding: "14px 28px", fontSize: 15 }}>
              <ShoppingCart size={18} /> {isMr ? "कार्टमध्ये जोडा" : "Add to Cart"}
            </button>
            <a
              className="btn secondary"
              href={whatsappUrl(
                isMr
                  ? `नमस्कार, मला ${p.name_mr || p.name} (${p.weight_kg} किलो पेटी) विषयी विचारणा करायची आहे.`
                  : `Hello, I am interested in ordering ${p.name} (${p.weight_kg} kg box). Please confirm availability.`
              )}
              target="_blank"
              rel="noreferrer"
              style={{ padding: "14px 24px" }}
            >
              💬 {isMr ? "व्हॉट्सॲपवर विचारणा करा" : "Enquire on WhatsApp"}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
