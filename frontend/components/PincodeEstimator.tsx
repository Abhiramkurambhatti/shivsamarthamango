"use client";

import { useState } from "react";
import { MapPin, Truck, CheckCircle2, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { useStore } from "./StoreProvider";

export default function PincodeEstimator() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<{
    zone: "fast" | "standard" | "national";
    city: string;
    duration: string;
    durationEn: string;
    method: string;
    methodEn: string;
  } | null>(null);

  const s = useStore();
  const isMr = s.lang === "mr";

  const checkPincode = (code: string) => {
    const clean = code.trim();
    setPincode(clean);

    if (clean.length !== 6 || isNaN(Number(clean))) {
      setResult(null);
      return;
    }

    const prefix = clean.substring(0, 3);
    const prefix2 = clean.substring(0, 2);

    if (["411", "412"].includes(prefix)) {
      setResult({
        zone: "fast",
        city: isMr ? "पुणे व परिसर" : "Pune & PMC/PCMC",
        duration: "२४ ते ३६ तास (थेट एक्सप्रेस डिलिव्हरी)",
        durationEn: "24 to 36 Hours (Direct Farm Express)",
        method: "शिवसमर्थ स्पेशल फार्म व्हॅन / एक्सप्रेस कार्गो",
        methodEn: "Shiv Samarth Farm Van / Express Cargo",
      });
    } else if (["400", "401"].includes(prefix)) {
      setResult({
        zone: "fast",
        city: isMr ? "मुंबई, ठाणे व नवी मुंबई" : "Mumbai, Thane & Navi Mumbai",
        duration: "२४ ते ४८ तास (नेक्स्ट-डे डिलिव्हरी)",
        durationEn: "24 to 48 Hours (Next-Day Delivery)",
        method: "कोकण एक्सप्रेस कार्गो थेट बागेतून",
        methodEn: "Konkan Express Cargo Direct from Orchard",
      });
    } else if (prefix2 === "41" || prefix2 === "42" || prefix2 === "43" || prefix2 === "44") {
      setResult({
        zone: "standard",
        city: isMr ? "महाराष्ट्र (नाशिक, कोल्हापूर, नागपूर, संभाजीनगर)" : "Rest of Maharashtra",
        duration: "४८ तास (दोन दिवस)",
        durationEn: "48 Hours (2 Days)",
        method: "सुरक्षित शॉकप्रूफ एअर / कार्गो डिलिव्हरी",
        methodEn: "Secure Shockproof Air / Express Cargo",
      });
    } else {
      setResult({
        zone: "national",
        city: isMr ? "अखिल भारतीय वितरण (National Metro)" : "All-India Metros (Bengaluru, Delhi, Hyderabad)",
        duration: "२ ते ३ दिवस",
        durationEn: "2 to 3 Days",
        method: "प्रीमियम एअर कार्गो विथ इन्सुलेटेड टेम्परेचर पॅकिंग",
        methodEn: "Premium Air Cargo with Insulated Eco-Packing",
      });
    }
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1.5px solid var(--line)",
        borderRadius: 20,
        padding: "26px 24px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "rgba(200, 154, 75, 0.15)",
            border: "1px solid var(--gold)",
            display: "grid",
            placeItems: "center",
            color: "var(--gold)",
          }}
        >
          <Truck size={18} />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--green)" }}>
            {isMr ? "पिनकोड डिलिव्हरी व वेग तपासा" : "Check Delivery Pincode & Transit Time"}
          </h4>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            {isMr ? "थेट नारिंग्रे बागेतून आपल्या घरापर्यंत पोहोचण्याची वेळ" : "Fresh dispatch transit time direct from Naringre orchard"}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <div style={{ position: "relative", flex: "1 1 200px" }}>
          <MapPin size={16} color="var(--gold)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            type="text"
            maxLength={6}
            placeholder={isMr ? "६-अंकी पिनकोड टाका (उदा. 411038)" : "Enter 6-digit Pincode (e.g. 411038)"}
            value={pincode}
            onChange={(e) => checkPincode(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 14px 10px 36px",
              borderRadius: 10,
              border: "1.5px solid var(--line)",
              background: "var(--bg)",
              color: "var(--text)",
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Quick Pincode Pills */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 16, fontSize: 12 }}>
        <span style={{ color: "var(--muted)" }}>{isMr ? "जलद पर्याय:" : "Quick select:"}</span>
        {[
          { code: "411038", label: "पुणे (Pune)" },
          { code: "400001", label: "मुंबई (Mumbai)" },
          { code: "400601", label: "ठाणे (Thane)" },
          { code: "422001", label: "नाशिक (Nashik)" },
          { code: "560001", label: "बंगळुरू (Bengaluru)" },
        ].map((item) => (
          <button
            key={item.code}
            type="button"
            onClick={() => checkPincode(item.code)}
            style={{
              background: pincode === item.code ? "var(--green)" : "rgba(200, 154, 75, 0.1)",
              color: pincode === item.code ? "#fff" : "var(--text)",
              border: "1px solid var(--line)",
              padding: "3px 9px",
              borderRadius: 99,
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {result && (
        <div
          style={{
            padding: "14px 16px",
            borderRadius: 12,
            background: result.zone === "fast" ? "rgba(22, 101, 52, 0.08)" : "rgba(200, 154, 75, 0.08)",
            border: `1.5px solid ${result.zone === "fast" ? "#86efac" : "var(--gold)"}`,
            marginTop: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <CheckCircle2 size={16} color={result.zone === "fast" ? "#16a34a" : "var(--gold)"} />
            <strong style={{ fontSize: 14, color: "var(--green)" }}>
              {isMr ? "✓ या पिनकोडवर थेट बागेतून डिलिव्हरी उपलब्ध आहे!" : "✓ Direct Farm Delivery Available!"} ({result.city})
            </strong>
          </div>
          <div style={{ fontSize: 13, color: "var(--text)", marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
            <div>
              <Clock size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4, color: "var(--gold)" }} />
              <strong>{isMr ? "अपेक्षित वेळ:" : "Expected Transit:"}</strong> {isMr ? result.duration : result.durationEn}
            </div>
            <div>
              <Truck size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: 4, color: "var(--gold)" }} />
              <strong>{isMr ? "पॅकिंग व वाहतूक:" : "Packing & Transit:"}</strong> {isMr ? result.method : result.methodEn}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
