"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, Phone, HelpCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { API_URL, WHATSAPP_NUMBER } from "@/lib/config";

interface OrderDetail {
  id: number;
  order_number: string;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  pincode: string;
  subtotal: number;
  status: "new" | "confirmed" | "processing" | "shipped" | "completed" | "cancelled";
  courier_name?: string;
  tracking_number?: string;
  created_at: string;
  items: Array<{
    name?: string;
    title?: string;
    price?: number;
    qty?: number;
    quantity?: number;
  }>;
}

const STEPS = [
  { key: "confirmed", labelMr: "ऑर्डर स्वीकारली", labelEn: "Order Confirmed", descMr: "ऑर्डर प्रणालीमध्ये नोंदवली आहे", descEn: "Order placed & verified" },
  { key: "processing", labelMr: "आडीत नैसर्गिक पिकवण व ग्रेडिंग", labelEn: "Straw Ripening & Grading", descMr: "योग्य पक्वतेतील उत्तम फळे निवडली", descEn: "Sorted & ripened in organic rice straw" },
  { key: "shipped", labelMr: "इको-पॅकिंग व कुरिअर रवाना", labelEn: "Dispatched in Transit", descMr: "कोकण एक्सप्रेस कार्गोद्वारे रवाना", descEn: "Dispatched via Express Farm Cargo" },
  { key: "completed", labelMr: "घरी पोहोचली", labelEn: "Delivered to Doorstep", descMr: "अस्सल देवगड गोडव्याचा आनंद घ्या!", descEn: "Delivered fresh to your doorstep" },
];

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const s = useStore();
  const isMr = s.lang === "mr";

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch(`${API_URL}/orders/?search=${encodeURIComponent(clean)}`);
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.results || [];
        if (list.length > 0) {
          setOrder(list[0]);
        } else {
          setOrder(null);
          setError(
            isMr
              ? "या क्रमांकाची किंवा फोन नंबरची कोणतीही ऑर्डर सापडली नाही. कृपया नंबर तपासा किंवा व्हॉट्सॲपवर संपर्क करा."
              : "No order found matching this Order Number or Phone. Please check or contact us on WhatsApp."
          );
        }
      } else {
        setError(isMr ? "माहिती मिळवताना त्रुटी आली." : "Error retrieving order details.");
      }
    } catch (err) {
      setError(isMr ? "सर्व्हरशी संपर्क होऊ शकला नाही." : "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "new":
        return 0;
      case "confirmed":
        return 0;
      case "processing":
        return 1;
      case "shipped":
        return 2;
      case "completed":
        return 3;
      case "cancelled":
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;

  return (
    <main className="container" style={{ paddingBottom: 80, maxWidth: 960 }}>
      <div style={{ textAlign: "center", margin: "40px auto 32px" }}>
        <div className="eyebrow">
          <Truck size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
          {isMr ? "थेट बागेतील प्रवास" : "Live Farm to Doorstep Tracking"}
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px, 4vw, 42px)", color: "var(--green)", margin: "8px 0 12px" }}>
          {isMr ? "आपली आंबा पेटी ट्रॅक करा" : "Track Your Mango Peti"}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 16, maxWidth: 640, margin: "0 auto" }}>
          {isMr
            ? "आपला ऑर्डर नंबर (उदा. SSH-2026-1001) किंवा नोंदणीकृत मोबाईल नंबर टाका आणि पेटीचा सद्य प्रवास तपासा."
            : "Enter your Order Number (e.g. SSH-2026-1001) or 10-digit Mobile Number to check real-time ripening and dispatch status."}
        </p>
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          gap: 12,
          maxWidth: 620,
          margin: "0 auto 36px",
          background: "var(--surface)",
          padding: 8,
          borderRadius: 99,
          border: "2px solid var(--gold)",
          boxShadow: "0 8px 30px rgba(200, 154, 75, 0.15)",
        }}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={18} color="var(--gold)" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isMr ? "ऑर्डर क्र. किंवा मोबाईल नंबर टाका..." : "Enter Order No. or Mobile Number..."}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px 16px 12px 44px",
              borderRadius: 99,
              border: "none",
              background: "transparent",
              color: "var(--text)",
              fontSize: 15,
              outline: "none",
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 28px",
            borderRadius: 99,
            border: "none",
            background: "linear-gradient(135deg, #c89a4b, #a27429)",
            color: "#172b20",
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? "wait" : "pointer",
            boxShadow: "0 4px 14px rgba(200, 154, 75, 0.3)",
          }}
        >
          {loading ? (isMr ? "शोधत आहे..." : "Tracking...") : (isMr ? "ट्रॅक करा" : "Track Order")}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div
          style={{
            maxWidth: 620,
            margin: "0 auto 30px",
            background: "#fee2e2",
            border: "1px solid #f87171",
            color: "#b91c1c",
            padding: "14px 18px",
            borderRadius: 14,
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {/* Order Status Display */}
      {order && (
        <div
          style={{
            background: "var(--surface)",
            borderRadius: 24,
            border: "1.5px solid var(--line)",
            padding: "36px 32px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 16,
              borderBottom: "1px solid var(--line)",
              paddingBottom: 20,
              marginBottom: 30,
            }}
          >
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gold)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {isMr ? "अधिकृत ऑर्डर" : "Official Order"}
              </span>
              <h2 style={{ margin: "4px 0", fontSize: 24, color: "var(--green)" }}>{order.order_number}</h2>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>
                {isMr ? "ग्राहक:" : "Customer:"} <strong>{order.customer_name}</strong> · {order.city}
              </span>
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 16px",
                  borderRadius: 99,
                  background: order.status === "completed" ? "#dcfce7" : order.status === "cancelled" ? "#fee2e2" : "#fef3c7",
                  color: order.status === "completed" ? "#15803d" : order.status === "cancelled" ? "#b91c1c" : "#b45309",
                  fontWeight: 700,
                  fontSize: 13,
                  textTransform: "capitalize",
                }}
              >
                ● {order.status}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--green)", marginTop: 6 }}>
                ₹{Number(order.subtotal).toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          {order.status === "cancelled" ? (
            <div style={{ padding: "20px", background: "#fee2e2", borderRadius: 14, color: "#b91c1c", textAlign: "center" }}>
              {isMr ? "ही ऑर्डर रद्द करण्यात आली आहे." : "This order has been cancelled."}
            </div>
          ) : (
            <div style={{ margin: "36px 0 40px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  position: "relative",
                  gap: 12,
                }}
              >
                {STEPS.map((step, idx) => {
                  const isDone = idx <= currentStep;
                  const isCurrent = idx === currentStep;
                  return (
                    <div key={step.key} style={{ textAlign: "center", position: "relative" }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: isDone ? "var(--green)" : "var(--bg)",
                          border: isDone ? "2px solid var(--gold)" : "2px solid var(--line)",
                          color: isDone ? "#fff" : "var(--muted)",
                          display: "grid",
                          placeItems: "center",
                          margin: "0 auto 12px",
                          fontWeight: 800,
                          fontSize: 16,
                          boxShadow: isCurrent ? "0 0 20px rgba(200, 154, 75, 0.5)" : "none",
                          transition: "all 0.3s",
                        }}
                      >
                        {isDone ? "✓" : idx + 1}
                      </div>
                      <h4 style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: isDone ? "var(--green)" : "var(--muted)" }}>
                        {isMr ? step.labelMr : step.labelEn}
                      </h4>
                      <p style={{ margin: 0, fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>
                        {isMr ? step.descMr : step.descEn}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Courier & Dispatch Details */}
          {(order.courier_name || order.tracking_number) && (
            <div
              style={{
                background: "rgba(200, 154, 75, 0.08)",
                border: "1px solid var(--gold)",
                borderRadius: 14,
                padding: "16px 20px",
                marginBottom: 24,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{isMr ? "कुरिअर पार्टनर:" : "Courier Partner:"}</span>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--green)" }}>{order.courier_name || "Konkan Fast Cargo"}</div>
              </div>
              <div>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{isMr ? "ट्रॅकिंग क्रमांक:" : "Tracking Number:"}</span>
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--gold)", fontFamily: "monospace" }}>
                  {order.tracking_number || "SSH-EXPRESS-DEVGAD"}
                </div>
              </div>
            </div>
          )}

          {/* Items Summary */}
          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 20 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--green)", marginBottom: 12 }}>
              {isMr ? "पेटी तपशील (Ordered Mangoes):" : "Order Summary:"}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {order.items &&
                order.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      padding: "8px 12px",
                      background: "var(--bg)",
                      borderRadius: 8,
                    }}
                  >
                    <span>
                      🥭 {item.title || item.name} × <strong>{item.qty || item.quantity || 1}</strong>
                    </span>
                    <span style={{ fontWeight: 700, color: "var(--green)" }}>
                      ₹{(Number(item.price || 0) * Number(item.qty || item.quantity || 1)).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Need Help WhatsApp CTA */}
          <div style={{ marginTop: 28, textAlign: "center" }}>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `नमस्कार! मला माझी ऑर्डर ${order.order_number} बद्दल विचारणा करायची आहे.`
              )}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#1c9b58",
                color: "#fff",
                padding: "10px 22px",
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              <span>💬</span>
              <span>{isMr ? "ऑर्डरबाबत व्हॉट्सॲपवर संपर्क करा" : "Need Help? WhatsApp Support"}</span>
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
