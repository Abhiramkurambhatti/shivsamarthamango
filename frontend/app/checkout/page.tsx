"use client";

import { useState } from "react";
import { Gift, Truck, CheckCircle2, ShieldCheck, Heart, Sparkles, MessageCircle } from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { API_URL, WHATSAPP_NUMBER } from "@/lib/config";
import PincodeEstimator from "@/components/PincodeEstimator";

export default function Checkout() {
  const s = useStore();
  const isMr = s.lang === "mr";

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
  });

  // Gifting Mode State
  const [isGift, setIsGift] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState("");
  const [giftPhone, setGiftPhone] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [hidePrice, setHidePrice] = useState(true);

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (method: "whatsapp" | "gateway") => {
    if (!s.cart.length) {
      setMsg(isMr ? "आपली कार्ट रिकामी आहे." : "Your cart is empty.");
      return;
    }
    if (!form.customer_name || !form.phone || !form.address || !form.city || !form.pincode) {
      setMsg(isMr ? "कृपया सर्व आवश्यक माहिती भरावी." : "Please complete all required fields.");
      return;
    }

    setLoading(true);

    const giftNotes = isGift
      ? `\n🎁 [सप्रेम भेट पेटी]:\nभेट स्वीकारणाऱ्यांचे नाव: ${giftRecipient || "लाडके आप्त"}\nफोन: ${giftPhone || "N/A"}\nसंदेश: "${giftMessage || "सप्रेम भेट"}"\n(पेटीत बिल लपवा: ${hidePrice ? "होय" : "नाही"})`
      : "";

    const payload = {
      ...form,
      notes: (form.notes ? form.notes + "\n" : "") + giftNotes,
      items: s.cart.map((i) => ({
        product_id: i.id,
        name: i.name,
        weight_kg: i.weight,
        price: i.price,
        quantity: i.qty,
      })),
      subtotal: s.total,
      payment_method: method,
    };

    try {
      const r = await fetch(`${API_URL}/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error("Order service unavailable");
      const order = await r.json();

      if (method === "whatsapp") {
        const lines = s.cart.map((i) => `🥭 ${i.name} (Qty ${i.qty}) = ₹${i.price * i.qty}`).join("\n");
        const waText = encodeURIComponent(
          `नमस्कार! मी शिवसमर्थ देवगड हापूस ऑर्डर क्र. ${order.order_number} नोंदवली आहे:\n\n${lines}\n\n💰 एकूण रक्कम: ₹${s.total.toLocaleString("en-IN")}\n👤 नाव: ${form.customer_name}\n📞 फोन: ${form.phone}\n📍 पत्ता: ${form.address}, ${form.city} - ${form.pincode}${giftNotes ? "\n" + giftNotes : ""}\n\nकृपया बँक खात्याचा किंवा UPI QR कोड पाठवा. धन्यवाद!`
        );

        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`, "_blank");
        setMsg(
          isMr
            ? `ऑर्डर क्र. ${order.order_number} यशस्वीरीत्या नोंदवली गेली. कृपया व्हॉट्सॲपवर अंतिम पुष्टी करा.`
            : `Order ${order.order_number} registered! Please complete confirmation on WhatsApp.`
        );
        s.cart.forEach((i) => s.remove(i.id));
      } else {
        setMsg(
          isMr
            ? `ऑर्डर क्र. ${order.order_number} यशस्वीरीत्या नोंदवली गेली. आमचे प्रतिनिधी लवकरच आपल्याशी संपर्क साधतील.`
            : `Order ${order.order_number} recorded. Our farm coordinator will contact you shortly.`
        );
        s.cart.forEach((i) => s.remove(i.id));
      }
    } catch (e) {
      setMsg(
        isMr
          ? "ऑर्डर सबमिट करता आली नाही. कृपया पुन्हा प्रयत्न करा किंवा थेट ९५५२० ५००९३ वर व्हॉट्सॲप संपर्क करा."
          : "Could not submit order. Please retry or contact us directly on WhatsApp +91 95520 50093."
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = isMr
    ? [
        ["customer_name", "पूर्ण नाव *"],
        ["phone", "मोबाईल नंबर *"],
        ["email", "ईमेल (ऐच्छिक)"],
        ["city", "शहर / गाव *"],
        ["pincode", "पिन कोड *"],
        ["address", "डिलिव्हरी पत्ता (Delivery Address) *"],
      ]
    : [
        ["customer_name", "Full Name *"],
        ["phone", "Phone Number *"],
        ["email", "Email Address (optional)"],
        ["city", "City / Town *"],
        ["pincode", "PIN Code *"],
        ["address", "Delivery Address *"],
      ];

  return (
    <main className="container" style={{ paddingBottom: 60, maxWidth: 1100 }}>
      <div className="page-title">
        <div className="eyebrow">{isMr ? "थेट बागेतून आपल्या दारात" : "Orchard Direct Checkout"}</div>
        <h1 style={{ fontSize: "clamp(30px, 4.2vw, 44px)", margin: "8px 0 14px", color: "var(--green)" }}>
          {isMr ? "ऑर्डर व पत्ता तपशील (Checkout)" : "Checkout & Delivery Address"}
        </h1>
        <p className="muted" style={{ maxWidth: 700, margin: "0 auto" }}>
          {isMr
            ? "आपला अचूक पोहोच पत्ता द्या, जेणेकरून सिंधुदुर्ग देवगड नारिंग्रे बागेतून ताजी पेटी सुरक्षित रवाना करता येईल."
            : "Enter your address details to dispatch freshly harvested Alphonso petis direct from Naringre, Devgad."}
        </p>
      </div>

      <div className="story-grid" style={{ alignItems: "start", gap: 30 }}>
        {/* Left Column: Form & Gifting */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="content-card">
            <h3 style={{ fontSize: 18, margin: "0 0 16px", color: "var(--green)", fontWeight: 700 }}>
              {isMr ? "१. ग्राहक संपर्क व डिलिव्हरी पत्ता" : "1. Customer Contact & Delivery Details"}
            </h3>
            <div className="form-grid">
              {fields.map(([name, label]) => (
                <div className={`field ${name === "address" ? "full" : ""}`} key={name}>
                  <label>{label}</label>
                  {name === "address" ? (
                    <textarea name={name} rows={3} value={(form as any)[name]} onChange={update} required />
                  ) : (
                    <input name={name} value={(form as any)[name]} onChange={update} required={name !== "email"} />
                  )}
                </div>
              ))}
              <div className="field full">
                <label>{isMr ? "ऑर्डरबाबत विशेष सूचना (ऐच्छिक)" : "Order Notes (optional)"}</label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder={isMr ? "उदा. कॉल करून मगच पेटी द्या, गेटवर ठेवा इ." : "e.g. Ring bell, deliver in morning"}
                  value={form.notes}
                  onChange={update}
                />
              </div>
            </div>
          </div>

          {/* Gifting Mode Card */}
          <div
            className="content-card"
            style={{
              background: isGift ? "rgba(200, 154, 75, 0.08)" : "var(--surface)",
              border: isGift ? "1.5px solid var(--gold)" : "1px solid var(--line)",
              transition: "all 0.25s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <input
                type="checkbox"
                id="gift-toggle"
                checked={isGift}
                onChange={(e) => setIsGift(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: "var(--gold)", marginTop: 3, cursor: "pointer" }}
              />
              <label htmlFor="gift-toggle" style={{ cursor: "pointer", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 16, color: "var(--green)" }}>
                  <Gift size={18} color="var(--gold)" />
                  <span>{isMr ? "ही पेटी नातेवाईक किंवा मित्रांना सप्रेम भेट पाठवायची आहे?" : "Send as a Gift to Family or Friends?"}</span>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted)" }}>
                  {isMr
                    ? "आम्ही पेटीमध्ये आपल्या नावासह आकर्षक पारंपरिक सदिच्छा पत्रक (Greeting Postcard) ठेवू."
                    : "We will include an official festive greeting card with your custom message inside the box."}
                </p>
              </label>
            </div>

            {isGift && (
              <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px dashed var(--gold)", display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="form-grid">
                  <div className="field">
                    <label>{isMr ? "भेट स्वीकारणाऱ्यांचे नाव *" : "Recipient's Name *"}</label>
                    <input
                      type="text"
                      placeholder={isMr ? "उदा. काका, मित्र, आई-बाबा" : "e.g. Uncle, Dear Friend"}
                      value={giftRecipient}
                      onChange={(e) => setGiftRecipient(e.target.value)}
                    />
                  </div>
                  <div className="field">
                    <label>{isMr ? "त्यांचा मोबाईल नंबर (ऐच्छिक)" : "Recipient's Phone (optional)"}</label>
                    <input
                      type="text"
                      placeholder={isMr ? "डिलिव्हरी समन्वयासाठी" : "For delivery coordination"}
                      value={giftPhone}
                      onChange={(e) => setGiftPhone(e.target.value)}
                    />
                  </div>
                  <div className="field full">
                    <label>{isMr ? "आपला शुभेच्छा संदेश (Custom Greeting Note) *" : "Your Personal Greeting Message *"}</label>
                    <textarea
                      rows={2}
                      placeholder={isMr ? "उदा. 'देवगड हापूसच्या सुवर्ण गोडीसह सस्नेह नमस्कार!' किंवा वाढदिवसाच्या शुभेच्छा..." : "e.g. Wishing you sweet memories with Devgad Alphonso!"}
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                    />
                  </div>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text)", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={hidePrice}
                    onChange={(e) => setHidePrice(e.target.checked)}
                    style={{ accentColor: "var(--gold)" }}
                  />
                  <span>{isMr ? "✓ पेटीत बिलाची किंमत लपवा (Hide pricing on gift invoice slip)" : "✓ Hide invoice pricing inside the box"}</span>
                </label>
              </div>
            )}
          </div>

          {/* Pincode Estimator Helper */}
          <PincodeEstimator />
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="content-card" style={{ position: "sticky", top: 100 }}>
          <h2 className="serif" style={{ fontSize: 22, margin: "0 0 16px", color: "var(--green)" }}>
            {isMr ? "ऑर्डर गोषवारा (Order Summary)" : "Order Summary"}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {s.cart.map((i) => (
              <div key={i.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, fontSize: 14 }}>
                <span style={{ color: "var(--text)" }}>
                  🥭 {i.name} × <strong>{i.qty}</strong>
                </span>
                <b style={{ color: "var(--green)" }}>₹{(i.price * i.qty).toLocaleString("en-IN")}</b>
              </div>
            ))}
          </div>

          <hr style={{ borderColor: "var(--line)", margin: "16px 0" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{isMr ? "एकूण देय रक्कम:" : "Total Payable:"}</span>
            <h2 style={{ color: "var(--green)", margin: 0, fontSize: 28, fontFamily: "'Playfair Display', serif" }}>
              ₹{s.total.toLocaleString("en-IN")}
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              className="btn"
              disabled={loading}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #1c9b58, #147341)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                padding: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 4px 16px rgba(28, 155, 88, 0.3)",
              }}
              onClick={() => submit("whatsapp")}
            >
              <span>💬</span>
              <span>{isMr ? "व्हॉट्सॲपवर १-क्लिक ऑर्डर द्या" : "Order via WhatsApp (1-Click)"}</span>
            </button>

            <button
              className="btn secondary"
              disabled={loading}
              style={{ width: "100%", padding: "12px", fontSize: 14 }}
              onClick={() => submit("gateway")}
            >
              {isMr ? "थेट नोंदणी करा (Cash / Bank Transfer)" : "Register Order Directly"}
            </button>
          </div>

          <div style={{ marginTop: 18, padding: "12px", background: "rgba(200, 154, 75, 0.08)", borderRadius: 10, fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
            🔒 {isMr ? "१००% सुरक्षित व्यवहार · थेट देवगड शेवाळे फार्म नारिंग्रे येथून रवाना · हेल्पलाईन: ९५५२० ५००९३" : "100% Safe · Direct Naringre Farm Dispatch · Helpline: +91 95520 50093"}
          </div>

          {msg && (
            <p className="notice" style={{ marginTop: 16 }}>
              {msg}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
