"use client";

import Link from "next/link";
import { ShoppingCart, ShieldCheck } from "lucide-react";
import { useStore } from "./StoreProvider";
import { WHATSAPP_NUMBER } from "@/lib/config";

export default function ProductCard({ p }: { p: any }) {
  const s = useStore();
  const mr = s.lang === "mr";

  const waText = encodeURIComponent(
    mr
      ? `नमस्कार! मला शिवसमर्थ देवगड हापूस बागेतून "${p.name_mr || p.name}" (₹${Number(p.price).toLocaleString("en-IN")}) थेट १-क्लिकमध्ये ऑर्डर करायची आहे. कृपया डिलिव्हरी व पेमेंट तपशील पाठवा.`
      : `Hello! I would like to place a 1-click WhatsApp order for "${p.name}" (₹${Number(p.price).toLocaleString("en-IN")}). Please share delivery and payment details.`
  );

  return (
    <article className="product" style={{ position: "relative" }}>
      <Link href={`/product/${p.slug}`}>
        <div className="product-img" style={{ position: "relative" }}>
          <img src={p.image_url} alt={p.name} />
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "rgba(23, 43, 32, 0.88)",
              color: "#ecd599",
              fontSize: 10,
              fontWeight: 700,
              padding: "4px 8px",
              borderRadius: 6,
              backdropFilter: "blur(6px)",
              border: "1px solid rgba(200, 154, 75, 0.4)",
              letterSpacing: "0.02em",
            }}
          >
            🍃 {mr ? "चालू बहर · आडीत पिकवलेला" : "Current Harvest · Straw Ripened"}
          </div>
        </div>
      </Link>
      <div className="product-body">
        <span className="pill">{p.weight_kg} kg {mr ? "पेटी" : "box"}</span>
        <h3>{mr && p.name_mr ? p.name_mr : p.name}</h3>
        <div className="muted" style={{ fontSize: 12 }}>
          {p.stock_quantity > 0
            ? mr
              ? "✓ थेट नारिंग्रे बागेतून उपलब्ध"
              : "✓ Direct Farm-Fresh Available"
            : mr
            ? "सध्या उपलब्ध नाही"
            : "Currently unavailable"}
        </div>
        <div className="price">₹{Number(p.price).toLocaleString("en-IN")}</div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "auto", width: "100%" }}>
          <button className="btn" style={{ width: "100%", padding: "10px" }} onClick={() => s.add(p)}>
            <ShoppingCart size={15} />
            {mr ? "कार्टमध्ये जोडा" : "Add to cart"}
          </button>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
            target="_blank"
            rel="noreferrer"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "8px 10px",
              borderRadius: 99,
              background: "rgba(28, 155, 88, 0.12)",
              border: "1.5px solid #1c9b58",
              color: "#166534",
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
          >
            <span>💬</span>
            <span>{mr ? "१-क्लिक व्हॉट्सॲप ऑर्डर" : "1-Click WhatsApp Order"}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
