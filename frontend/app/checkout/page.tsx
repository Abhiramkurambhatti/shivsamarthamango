"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Gift,
  Truck,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Sparkles,
  MessageCircle,
  Copy,
  ExternalLink,
  ArrowRight,
  QrCode,
  CreditCard,
  Building2,
  Check
} from "lucide-react";
import { useStore } from "@/components/StoreProvider";
import { API_URL, WHATSAPP_NUMBER, BUSINESS_PHONE } from "@/lib/config";
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
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Success Confirmation State with Payment Details
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  const update = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const submitOrderViaWhatsApp = async () => {
    if (!s.cart.length) {
      setMsg(isMr ? "आपली कार्ट रिकामी आहे." : "Your cart is empty.");
      return;
    }
    if (!form.customer_name || !form.phone || !form.address || !form.city || !form.pincode) {
      setMsg(isMr ? "कृपया सर्व आवश्यक माहिती (*) भरावी." : "Please complete all required fields (*).");
      return;
    }

    setLoading(true);
    setMsg("");

    const giftNotes = isGift
      ? `\n🎁 [सप्रेम भेट पेटी]:\nभेट स्वीकारणाऱ्यांचे नाव: ${giftRecipient || "लाडके आप्त"}\nफोन: ${giftPhone || "N/A"}\nसंदेश: "${giftMessage || "सप्रेम भेट"}"\n(पेटीत बिल लपवा: ${hidePrice ? "होय" : "नाही"})`
      : "";

    const payload = {
      ...form,
      notes: (form.notes ? form.notes + "\n" : "") + giftNotes,
      items: s.cart.map((i) => ({
        product_id: i.id,
        name: i.name,
        unit: i.unit || "box",
        unit_label: i.unitLabel || (i.unit === "dozen" ? "१ डझन" : i.unit === "grams" ? "५०० ग्रॅम" : i.unit === "kg" ? "१ किलो" : `${i.weight}kg पेटी`),
        weight_kg: i.weight,
        price: i.price,
        quantity: i.qty,
        line_total: i.price * i.qty,
      })),
      subtotal: s.total,
      payment_method: "whatsapp",
    };

    try {
      const r = await fetch(`${API_URL}/orders/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let orderData: any;
      if (r.ok) {
        orderData = await r.json();
      } else {
        // Fallback local order number if backend API is temporarily offline
        const randId = Math.random().toString(36).substring(2, 10).toUpperCase();
        orderData = {
          order_number: `SSH-${randId}`,
          subtotal: s.total,
          customer_name: form.customer_name,
        };
      }

      // Format WhatsApp message with full details including product units & quantity
      const itemLines = s.cart
        .map(
          (i, idx) =>
            `${idx + 1}. 🥭 *${i.name}*\n   • एकक / प्रमाण: *${i.unitLabel || (i.unit === "dozen" ? "१ डझन (1 Dozen)" : i.unit === "grams" ? "५०० ग्रॅम (500g)" : i.unit === "kg" ? "१ किलो (1 Kg)" : `${i.weight}kg पेटी`)}*\n   • नग (Quantity): *${i.qty}*\n   • दर: ₹${i.price.toLocaleString("en-IN")}\n   • एकूण: *₹${(i.price * i.qty).toLocaleString("en-IN")}*`
        )
        .join("\n\n");

      const waMessage = encodeURIComponent(
        `🌿 *॥ शिवसमर्थ देवगड हापूस - नवी ऑर्डर ॥*\n\n` +
        `📋 *ऑर्डर क्र:* #${orderData.order_number}\n` +
        `👤 *ग्राहक:* ${form.customer_name}\n` +
        `📞 *मोबाईल:* ${form.phone}\n` +
        (form.email ? `📧 *ईमेल:* ${form.email}\n` : "") +
        `📍 *डिलिव्हरी पत्ता:* ${form.address}, ${form.city} - ${form.pincode}\n` +
        (form.notes ? `📝 *विशेष सूचना:* ${form.notes}\n` : "") +
        (giftNotes ? `${giftNotes}\n` : "") +
        `\n🛒 *ऑर्डर तपशील (Items & Units):*\n${itemLines}\n\n` +
        `━━━━━━━━━━━━━━━━━━━\n` +
        `💰 *एकूण देय रक्कम: ₹${s.total.toLocaleString("en-IN")}*\n` +
        `━━━━━━━━━━━━━━━━━━━\n\n` +
        `💳 *पेमेंट पद्धत:* WhatsApp Direct UPI / बँक ट्रान्सफर\n` +
        `कृपया वरील रकमेसाठी बँक तपशील / UPI QR कोड पाठवा. मी त्वरित पेमेंट करून स्क्रीनशॉट पाठवतो. धन्यवाद!`
      );

      // Open WhatsApp in new tab
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`, "_blank");

      // Set placed order for on-screen immediate payment instructions
      setPlacedOrder({
        order_number: orderData.order_number,
        total: s.total,
        customer_name: form.customer_name,
        phone: form.phone,
        itemsCount: s.cart.reduce((acc, x) => acc + x.qty, 0),
      });

      // Clear cart
      s.cart.forEach((i) => s.remove(i.cartKey || i.id));
    } catch (e) {
      setMsg(
        isMr
          ? "ऑर्डर सबमिट करताना अडचण आली. कृपया पुन्हा प्रयत्न करा किंवा थेट ९५५२० ५००९३ वर व्हॉट्सॲप संपर्क करा."
          : "Could not submit order. Please retry or contact us directly on WhatsApp +91 95520 50093."
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = isMr
    ? [
        ["customer_name", "पूर्ण नाव *"],
        ["phone", "मोबाईल नंबर (WhatsApp Number) *"],
        ["email", "ईमेल (ऐच्छिक)"],
        ["city", "शहर / गाव *"],
        ["pincode", "पिन कोड *"],
        ["address", "डिलिव्हरी पत्ता (Full Delivery Address) *"],
      ]
    : [
        ["customer_name", "Full Name *"],
        ["phone", "Phone / WhatsApp Number *"],
        ["email", "Email Address (optional)"],
        ["city", "City / Town *"],
        ["pincode", "PIN Code *"],
        ["address", "Delivery Address *"],
      ];

  // If order was successfully placed, show the Immediate Confirmation & Payment Instructions View
  if (placedOrder) {
    const paymentScreenshotText = encodeURIComponent(
      `नमस्कार! मी शिवसमर्थ देवगड हापूस ऑर्डर क्र. #${placedOrder.order_number} साठी ₹${placedOrder.total.toLocaleString("en-IN")} चे पेमेंट पूर्ण केले आहे. हा पेमेंटचा स्क्रीनशॉट सोबत जोडला आहे. कृपया ऑर्डर निश्चित करावी.`
    );

    return (
      <main className="container" style={{ paddingBottom: 80, maxWidth: 900 }}>
        <div style={{ textAlign: "center", margin: "30px 0 24px" }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              background: "#dcfce7",
              border: "3px solid #16a34a",
              display: "inline-grid",
              placeItems: "center",
              marginBottom: 16,
              boxShadow: "0 8px 24px rgba(22, 163, 74, 0.25)",
            }}
          >
            <CheckCircle2 size={42} color="#15803d" />
          </div>
          <div className="eyebrow" style={{ color: "#16a34a" }}>
            {isMr ? "✓ ऑर्डर यशस्वीरीत्या नोंदवली गेली!" : "✓ Order Placed Successfully!"}
          </div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 38px)", margin: "8px 0 10px", color: "var(--green)" }}>
            {isMr ? "ऑर्डर क्र:" : "Order ID:"} #{placedOrder.order_number}
          </h1>
          <p className="muted" style={{ maxWidth: 640, margin: "0 auto", fontSize: 15 }}>
            {isMr
              ? `धन्यवाद ${placedOrder.customer_name}! आपली ऑर्डर व्हॉट्सॲपवर पाठवली आहे. कृपया खालील बँक खात्यात किंवा UPI द्वारे पेमेंट पूर्ण करून स्क्रीनशॉट पाठवा.`
              : `Thank you, ${placedOrder.customer_name}! Your order has been shared via WhatsApp. Please complete payment using the details below and share the screenshot.`}
          </p>
        </div>

        {/* Immediate Payment Instructions Card */}
        <div
          className="content-card"
          style={{
            background: "#fff",
            border: "2px solid #c89a4b",
            borderRadius: 22,
            padding: "32px 28px",
            boxShadow: "0 12px 36px rgba(200, 154, 75, 0.12)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, borderBottom: "1px solid #f2eadc", paddingBottom: 16, marginBottom: 20 }}>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#c89a4b", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {isMr ? "पेमेंट सूचना व बँक माहिती" : "Official Payment Instructions"}
              </span>
              <h2 style={{ fontSize: 22, margin: "4px 0 0", color: "var(--green)", fontFamily: "'Playfair Display', serif" }}>
                {isMr ? "देय रक्कम:" : "Total Payable:"} ₹{placedOrder.total.toLocaleString("en-IN")}
              </h2>
            </div>
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "6px 14px", borderRadius: 99, color: "#166534", fontSize: 13, fontWeight: 700 }}>
              🔒 100% Direct Farmer Payment
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {/* UPI Payment Option */}
            <div
              style={{
                background: "radial-gradient(ellipse at top, #faf6ed 0%, #f7f0e1 100%)",
                border: "1.5px solid #e3d5be",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <QrCode size={22} color="#c89a4b" />
                <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700, color: "var(--green)" }}>
                  {isMr ? "१. UPI द्वारे पेमेंट (GPay / PhonePe / Paytm)" : "1. Instant UPI Payment"}
                </h3>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", border: "1px solid #e5dbcb", marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  UPI ID:
                </span>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  <code style={{ fontSize: 15, fontWeight: 700, color: "var(--green)" }}>9552050093@upi</code>
                  <button
                    onClick={() => copyToClipboard("9552050093@upi", "upi")}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: "1px solid #d3cbbd",
                      background: "#faf7f0",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {copiedField === "upi" ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                    <span>{copiedField === "upi" ? (isMr ? "कॉपी झाले" : "Copied") : (isMr ? "कॉपी" : "Copy")}</span>
                  </button>
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", border: "1px solid #e5dbcb" }}>
                <span style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  {isMr ? "UPI मोबाईल नंबर:" : "Linked Mobile Number:"}
                </span>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  <code style={{ fontSize: 15, fontWeight: 700, color: "var(--green)" }}>9552050093</code>
                  <button
                    onClick={() => copyToClipboard("9552050093", "phone")}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      border: "1px solid #d3cbbd",
                      background: "#faf7f0",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {copiedField === "phone" ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                    <span>{copiedField === "phone" ? (isMr ? "कॉपी झाले" : "Copied") : (isMr ? "कॉपी" : "Copy")}</span>
                  </button>
                </div>
              </div>

              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12, marginBottom: 0, lineHeight: 1.5 }}>
                {isMr
                  ? "✓ कोणत्याही UPI ॲपवर वरील नंबर किंवा UPI ID टाकून थेट रक्कम भरा."
                  : "✓ Open Google Pay, PhonePe or Paytm, enter the UPI ID or number, and complete payment."}
              </p>
            </div>

            {/* Bank Transfer Option */}
            <div
              style={{
                background: "radial-gradient(ellipse at top, #faf6ed 0%, #f7f0e1 100%)",
                border: "1.5px solid #e3d5be",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <Building2 size={22} color="#c89a4b" />
                <h3 style={{ fontSize: 16, margin: 0, fontWeight: 700, color: "var(--green)" }}>
                  {isMr ? "२. थेट बँक ट्रान्सफर (NEFT / IMPS)" : "2. Direct Bank Transfer"}
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #ded4c3", paddingBottom: 6 }}>
                  <span className="muted">{isMr ? "खातेदार नाव:" : "Account Name:"}</span>
                  <strong>Shiv Samarth Agro Farm</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px dashed #ded4c3", paddingBottom: 6 }}>
                  <span className="muted">{isMr ? "बँकेचे नाव:" : "Bank:"}</span>
                  <strong>State Bank of India (SBI)</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed #ded4c3", paddingBottom: 6 }}>
                  <span className="muted">{isMr ? "खाते क्रमांक:" : "Account No:"}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <code style={{ fontWeight: 700, color: "var(--green)" }}>39820150093</code>
                    <button
                      onClick={() => copyToClipboard("39820150093", "account")}
                      style={{ padding: "2px 6px", border: "1px solid #d3cbbd", background: "#fff", borderRadius: 4, cursor: "pointer" }}
                    >
                      {copiedField === "account" ? <Check size={11} color="#16a34a" /> : <Copy size={11} />}
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed #ded4c3", paddingBottom: 6 }}>
                  <span className="muted">IFSC Code:</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <code style={{ fontWeight: 700, color: "var(--green)" }}>SBIN0000361</code>
                    <button
                      onClick={() => copyToClipboard("SBIN0000361", "ifsc")}
                      style={{ padding: "2px 6px", border: "1px solid #d3cbbd", background: "#fff", borderRadius: 4, cursor: "pointer" }}
                    >
                      {copiedField === "ifsc" ? <Check size={11} color="#16a34a" /> : <Copy size={11} />}
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="muted">{isMr ? "शाखा:" : "Branch:"}</span>
                  <span>Devgad, Sindhudurg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Step: Share Payment Screenshot */}
          <div
            style={{
              marginTop: 24,
              padding: "20px 22px",
              background: "#f0fdf4",
              border: "1.5px solid #86efac",
              borderRadius: 16,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#16a34a", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 13 }}>
                ३
              </div>
              <div>
                <strong style={{ fontSize: 15, color: "#166534" }}>
                  {isMr ? "अंतिम टप्पा: पेमेंट स्क्रीनशॉट व्हॉट्सॲपवर पाठवा" : "Final Step: Share Payment Screenshot on WhatsApp"}
                </strong>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "#15803d" }}>
                  {isMr
                    ? "पेमेंट पूर्ण झाल्यावर खालील बटणावर क्लिक करून स्क्रीनशॉट पाठवा, जेणेकरून बागेतून पेटी पॅकिंग लगेच सुरू होईल."
                    : "Once paid, click below to share your payment screenshot so your farm harvest packing begins immediately."}
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${paymentScreenshotText}`}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "linear-gradient(135deg, #1c9b58, #147341)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                padding: "14px 24px",
                borderRadius: 12,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                textDecoration: "none",
                boxShadow: "0 6px 20px rgba(28, 155, 88, 0.35)",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <span>💬</span>
              <span>{isMr ? "पेमेंट स्क्रीनशॉट व्हॉट्सॲपवर पाठवा (Share Screenshot)" : "Send Payment Screenshot on WhatsApp"}</span>
              <ExternalLink size={16} />
            </a>
          </div>

          <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <Link
              href="/track-order"
              style={{
                color: "var(--green)",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              📦 {isMr ? "ऑर्डर स्थिती ट्रॅक करा (Track Order Status)" : "Track Order Status"} →
            </Link>

            <Link
              href="/shop"
              style={{
                color: "var(--muted)",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              ← {isMr ? "आणखी खरेदी करा (Continue Shopping)" : "Continue Shopping"}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Default Checkout Form
  return (
    <main className="container" style={{ paddingBottom: 60, maxWidth: 1100 }}>
      <div className="page-title">
        <div className="eyebrow">{isMr ? "थेट बागेतून आपल्या दारात" : "Orchard Direct Checkout"}</div>
        <h1 style={{ fontSize: "clamp(30px, 4.2vw, 44px)", margin: "8px 0 14px", color: "var(--green)" }}>
          {isMr ? "ऑर्डर व पत्ता तपशील (Checkout)" : "Checkout & Delivery Address"}
        </h1>
        <p className="muted" style={{ maxWidth: 700, margin: "0 auto" }}>
          {isMr
            ? "आपला अचूक पोहोच पत्ता द्या. सर्व ऑर्डर्स व सुरक्षित पेमेंट प्रक्रिया थेट व्हॉट्सॲपद्वारे सुलभपणे पूर्ण केली जाईल."
            : "Enter your address details. All orders & secure payment confirmations are processed seamlessly via WhatsApp."}
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

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {s.cart.map((i) => (
              <div
                key={i.cartKey || i.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: 14,
                  paddingBottom: 10,
                  borderBottom: "1px dashed var(--line)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: "var(--text)" }}>🥭 {i.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      style={{
                        padding: "1px 6px",
                        borderRadius: 4,
                        background: "rgba(200, 154, 75, 0.15)",
                        fontWeight: 700,
                        color: "var(--green)",
                      }}
                    >
                      {i.unitLabel || (i.unit === "dozen" ? (isMr ? "१ डझन" : "1 Dozen") : i.unit === "grams" ? (isMr ? "५०० ग्रॅम" : "500g") : i.unit === "kg" ? (isMr ? "१ किलो" : "1 Kg") : `${i.weight}kg पेटी`)}
                    </span>
                    <span>× <strong>{i.qty}</strong></span>
                  </div>
                </div>
                <b style={{ color: "var(--green)", fontSize: 15 }}>₹{(i.price * i.qty).toLocaleString("en-IN")}</b>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "18px 0" }}>
            <span style={{ fontWeight: 700, fontSize: 15 }}>{isMr ? "एकूण देय रक्कम:" : "Total Payable:"}</span>
            <h2 style={{ color: "var(--green)", margin: 0, fontSize: 28, fontFamily: "'Playfair Display', serif" }}>
              ₹{s.total.toLocaleString("en-IN")}
            </h2>
          </div>

          {/* Exclusively WhatsApp Order Button */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              className="btn"
              disabled={loading || !s.cart.length}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #1c9b58, #147341)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                padding: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                borderRadius: 12,
                boxShadow: "0 4px 18px rgba(28, 155, 88, 0.35)",
                cursor: loading ? "wait" : "pointer",
              }}
              onClick={submitOrderViaWhatsApp}
            >
              <MessageCircle size={18} />
              <span>
                {loading
                  ? (isMr ? "ऑर्डर नोंदवत आहे..." : "Processing...")
                  : (isMr ? "व्हॉट्सॲपवर ऑर्डर द्या व पेमेंट तपशील मिळवा" : "Order via WhatsApp & Pay")}
              </span>
            </button>
          </div>

          {/* Process explanation banner */}
          <div
            style={{
              marginTop: 16,
              padding: "12px 14px",
              background: "rgba(28, 155, 88, 0.08)",
              border: "1px solid rgba(28, 155, 88, 0.25)",
              borderRadius: 10,
              fontSize: 12,
              color: "#166534",
              lineHeight: 1.5,
            }}
          >
            <strong>📱 {isMr ? "सोपी व्हॉट्सॲप प्रक्रिया:" : "WhatsApp-Only Checkout Flow:"}</strong>
            <br />
            {isMr
              ? "बटण दाबल्यावर आपली ऑर्डर आपोआप व्हॉट्सॲपवर उघडेल आणि स्क्रीनवर बँक/UPI QR पेमेंट तपशील दिसतील."
              : "Clicking opens WhatsApp with your full order summary and displays official Bank/UPI payment details on screen."}
          </div>

          <div
            style={{
              marginTop: 12,
              padding: "10px 12px",
              background: "rgba(200, 154, 75, 0.08)",
              borderRadius: 10,
              fontSize: 11,
              color: "var(--muted)",
              lineHeight: 1.4,
            }}
          >
            🔒 {isMr ? "१००% सुरक्षित व्यवहार · थेट देवगड शेवाळे फार्म नारिंग्रे · हेल्पलाईन: ९५५२० ५००९३" : "100% Safe · Direct Naringre Farm Dispatch · Helpline: +91 95520 50093"}
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
