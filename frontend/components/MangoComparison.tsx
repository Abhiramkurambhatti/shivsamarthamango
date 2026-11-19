"use client";

import { Check, X, ShieldCheck, Sparkles, Award } from "lucide-react";
import { useStore } from "./StoreProvider";

export default function MangoComparison() {
  const s = useStore();
  const isMr = s.lang === "mr";

  const rows = [
    {
      featureMr: "भौगोलिक मूळ व माती (Terroir)",
      featureEn: "Geographic Origin & Terroir",
      devgadMr: "सिंधुदुर्ग देवगड नारिंग्रे (समुद्रकिनारा + लाल कातळ माती)",
      devgadEn: "Devgad Naringre (Coastal Arabian Sea + Red Laterite Katal Soil)",
      ratnagiriMr: "रत्नागिरी किनारी पट्टा",
      ratnagiriEn: "Ratnagiri Coastal Belt",
      marketMr: "अज्ञात किंवा कर्नाटक/स्थानिक संकरित",
      marketEn: "Unknown / Commercial Hybrid / Mixed Origins",
    },
    {
      featureMr: "पिकवण्याची पद्धत (Ripening)",
      featureEn: "Ripening Method",
      devgadMr: "१००% पारंपरिक भाताच्या गवताची आडी (कार्बाईडमुक्त)",
      devgadEn: "100% Traditional Rice Straw Bed (Zero Carbide)",
      ratnagiriMr: "पारंपरिक गवत आडी",
      ratnagiriEn: "Traditional Straw Bed",
      marketMr: "कॅल्शियम कार्बाईड किंवा इथिलीन गॅस चेंबर्स",
      marketEn: "Calcium Carbide Powder or Harsh Chemical Gas Chambers",
    },
    {
      featureMr: "फळाची साल (Skin Thickness)",
      featureEn: "Skin Thickness",
      devgadMr: "अतिशय पातळ व रेशमी (बोटाने सहज सोलली जाते)",
      devgadEn: "Paper-thin, delicate skin (Peels smoothly like silk)",
      ratnagiriMr: "मध्यम पातळ",
      ratnagiriEn: "Medium Thin",
      marketMr: "जाड, कडक किंवा डागयुक्त",
      marketEn: "Thick, hard, or chemically spotted",
    },
    {
      featureMr: "सुगंध व दरवळ (Natural Aroma)",
      featureEn: "Natural Fragrance",
      devgadMr: "पेटी उघडताच संपूर्ण खोली दरवळून सोडणारा नैसर्गिक सुगंध",
      devgadEn: "Pervasive intoxicating natural aroma fills the entire room",
      ratnagiriMr: "मधुर सुगंध",
      ratnagiriEn: "Sweet Aroma",
      marketMr: "कमी किंवा रासायनिक दुर्गंध",
      marketEn: "Faint or faint chemical odor",
    },
    {
      featureMr: "गराची चव व पोत (Pulp & Texture)",
      featureEn: "Pulp Richness & Fiber",
      devgadMr: "केशरी सुवर्ण गर, १००% बिनधाग्यांचा, तोंडात विरघळणारा",
      devgadEn: "Golden saffron pulp, 100% fiber-free, melts on palate",
      ratnagiriMr: "गोड, रसाळ, हलका धागा असू शकतो",
      ratnagiriEn: "Sweet and juicy, light occasional fiber",
      marketMr: "पाणचट, आंबट किंवा दात अडकवणारे धागे",
      marketEn: "Watery, sour centers, or fibrous textures",
    },
    {
      featureMr: "GI-Tag सत्यता प्रमाणपत्र",
      featureEn: "Government GI-Tag Seal",
      devgadMr: "✓ अधिकृत GI टॅग प्रमाणित (Devgad Alphonso Registered)",
      devgadEn: "✓ Certified GI-Tag Authenticity with orchard trace",
      ratnagiriMr: "काही बागायतदारांकडे उपलब्ध",
      ratnagiriEn: "Available with selective growers",
      marketMr: "❌ कोणताही पुरावा नाही (बनावट स्टिकर्सचा धोका)",
      marketEn: "❌ No proof (Frequent duplicate stickers in markets)",
    },
  ];

  return (
    <section className="section" style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
      <div className="container">
        <div className="section-head-center">
          <div className="eyebrow">
            <Award size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
            {isMr ? "अस्सल पारख व सत्यता" : "Terroir & Authenticity Guide"}
          </div>
          <h2>{isMr ? "देवगड हापूस इतर आंब्यांपेक्षा श्रेष्ठ का आहे?" : "Why Devgad Alphonso Outshines All Others"}</h2>
          <p>
            {isMr
              ? "बाजारात 'देवगड' नावाखाली अनेकदा बनावट आंबे विकले जातात. अस्सल देवगड हापूस कसा ओळखावा हे प्रत्यक्ष गुणधर्मांवरून समजून घ्या."
              : "Understand how genuine coastal Devgad Alphonso naturally stands apart from common commercial produce."}
          </p>
        </div>

        <div style={{ overflowX: "auto", marginTop: 32 }}>
          <table
            style={{
              width: "100%",
              minWidth: 700,
              borderCollapse: "separate",
              borderSpacing: 0,
              borderRadius: 18,
              overflow: "hidden",
              border: "1.5px solid var(--line)",
              background: "var(--bg)",
            }}
          >
            <thead>
              <tr style={{ background: "#172b20", color: "#f8f3ea" }}>
                <th style={{ padding: "18px 20px", textAlign: "left", fontSize: 14, fontWeight: 700, width: "24%" }}>
                  {isMr ? "तुलनेचे निकष" : "Comparison Criteria"}
                </th>
                <th
                  style={{
                    padding: "18px 20px",
                    textAlign: "left",
                    fontSize: 15,
                    fontWeight: 800,
                    color: "var(--gold)",
                    background: "#214638",
                    width: "36%",
                    borderLeft: "2px solid var(--gold)",
                    borderRight: "2px solid var(--gold)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <ShieldCheck size={18} />
                    <span>॥ शिवसमर्थ ॥ देवगड हापूस</span>
                  </div>
                  <small style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.7)", display: "block", marginTop: 2 }}>
                    {isMr ? "नारिंग्रे समुद्रकिनारी २० एकर बाग" : "Naringre Coastal 20-Acre Orchard"}
                  </small>
                </th>
                <th style={{ padding: "18px 20px", textAlign: "left", fontSize: 13, fontWeight: 600, width: "20%" }}>
                  {isMr ? "रत्नागिरी हापूस" : "Ratnagiri Alphonso"}
                </th>
                <th style={{ padding: "18px 20px", textAlign: "left", fontSize: 13, fontWeight: 600, width: "20%", color: "#f87171" }}>
                  {isMr ? "सामान्य बाजारू आंबे" : "Commercial Market Mangoes"}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderTop: "1px solid var(--line)",
                    background: idx % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)",
                  }}
                >
                  <td style={{ padding: "16px 20px", fontWeight: 700, fontSize: 13, color: "var(--green)" }}>
                    {isMr ? row.featureMr : row.featureEn}
                  </td>
                  <td
                    style={{
                      padding: "16px 20px",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text)",
                      background: "rgba(200, 154, 75, 0.08)",
                      borderLeft: "2px solid var(--gold)",
                      borderRight: "2px solid var(--gold)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <Check size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{isMr ? row.devgadMr : row.devgadEn}</span>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: "var(--muted)" }}>
                    {isMr ? row.ratnagiriMr : row.ratnagiriEn}
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: 13, color: "#ef4444" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <X size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{isMr ? row.marketMr : row.marketEn}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
