"use client";

import { Star, ShieldCheck, HeartHandshake, Quote } from "lucide-react";
import { useStore } from "./StoreProvider";

interface Review {
  name: string;
  locationMr: string;
  locationEn: string;
  rating: number;
  petiMr: string;
  petiEn: string;
  commentMr: string;
  commentEn: string;
  date: string;
}

const REVIEWS: Review[] = [
  {
    name: "अमित जोशी (Amit Joshi)",
    locationMr: "कोथरूड, पुणे",
    locationEn: "Kothrud, Pune",
    rating: 5,
    petiMr: "२ डझन देवगड फॅमिली पेटी",
    petiEn: "2 Dozen Devgad Family Peti",
    commentMr:
      "गेली कित्येक वर्षे पुण्यात आंबे खातोय, पण शिवसमर्थ हापूसची पेटी उघडल्यावर जो सुगंध घरात पसरला तो अविस्मरणीय होता! गराची चव एकदम गोड आणि एकही धागा नाही. मुले तर खूप खुश झाली.",
    commentEn:
      "Ordered 2 dozen petis to Kothrud, Pune. The natural aroma filled our whole living room the moment we opened the box! 100% genuine Devgad sweetness with zero fiber.",
    date: "May 2026",
  },
  {
    name: "डॉ. सुप्रिया कुलकर्णी (Dr. Supriya Kulkarni)",
    locationMr: "दादर, मुंबई",
    locationEn: "Dadar, Mumbai",
    rating: 5,
    petiMr: "४ डझन उत्सव लाकडी पेटी",
    petiEn: "4 Dozen Wooden Heritage Peti",
    commentMr:
      "कार्बाईडमुक्त नैसर्गिक आडीत पिकवलेला आंबा असा असतो हे पहिल्यांदाच कळले. मुंबईत सहसा भेसळयुक्त आंबे मिळतात. शिवसमर्थ फार्मचे आंबे थेट बागेतून आले आणि दर्जा अप्रतिम होता.",
    commentEn:
      "As a doctor, zero-carbide natural ripening was my top priority. Shiv Samarth's GI-tagged Devgad Alphonso delivered pure traditional taste safely.",
    date: "April 2026",
  },
  {
    name: "राजेश पाटील (Rajesh Patil)",
    locationMr: "वाशी, नवी मुंबई",
    locationEn: "Vashi, Navi Mumbai",
    rating: 5,
    petiMr: "१ डझन सप्रेम भेट बॉक्स",
    petiEn: "1 Dozen Gift Peti",
    commentMr:
      "नातेवाईकांना भेट देण्यासाठी ३ पेट्या मागवल्या होत्या. व्हॉट्सॲपवर १-क्लिकमध्ये ऑर्डर झाली आणि दुसऱ्याच दिवशी सकाळी पोहोचल्या. पॅकिंग आणि आकाराची प्रत अतिशय उच्च दर्जाची होती.",
    commentEn:
      "Sent 3 gift petis to relatives. Easy 1-click WhatsApp booking and received next morning in perfect condition with traditional straw packing.",
    date: "May 2026",
  },
  {
    name: "सचिन देशपांडे (Sachin Deshpande)",
    locationMr: "इंदिरानगर, बंगळुरू (NRI Family)",
    locationEn: "Indiranagar, Bengaluru",
    rating: 5,
    petiMr: "२ डझन एक्सप्रेस एअर कार्गो",
    petiEn: "2 Dozen Air Cargo Peti",
    commentMr:
      "बंगळुरूमध्ये अस्सल कोकणचा हापूस मिळणे दुरापास्त होते. देवगड नारिंग्रे बागेतून अवघ्या ४८ तासांत सुस्थितीत आंबे पोहोचले. मूळ कोकणची आठवण ताजी झाली!",
    commentEn:
      "Living in Bengaluru, finding authentic Konkan Alphonso was tough. Delivered in 48 hours in immaculate condition with fresh seaside sweetness.",
    date: "May 2026",
  },
];

export default function CustomerReviews() {
  const s = useStore();
  const isMr = s.lang === "mr";

  return (
    <section className="section" style={{ background: "var(--bg)", borderBottom: "1px solid var(--line)" }}>
      <div className="container">
        <div className="section-head-center">
          <div className="eyebrow">
            <HeartHandshake size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
            {isMr ? "खवय्यांचे प्रेम व विश्वास" : "Customer Love & Verified Reviews"}
          </div>
          <h2>{isMr ? "महाराष्ट्रातील हजारो घरांमध्ये शिवसमर्थची गोडी" : "Cherished by Families Across India"}</h2>
          <p>
            {isMr
              ? "पुणे, मुंबई, ठाणे आणि देशभर वितरित झालेल्या अस्सल देवगड हापूसबद्दल आमच्या आदरणीय ग्राहकांचे प्रामाणिक अनुभव."
              : "Read real experiences from families who tasted 100% authentic, pesticide-free Devgad Alphonso straight from our orchard."}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 22,
            marginTop: 36,
          }}
        >
          {REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--surface)",
                borderRadius: 20,
                padding: "26px 22px",
                border: "1.5px solid var(--line)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#c89a4b" color="#c89a4b" />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: "rgba(22, 101, 52, 0.1)",
                      color: "#166534",
                      padding: "3px 10px",
                      borderRadius: 99,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <ShieldCheck size={12} color="#16a34a" /> {isMr ? "प्रमाणित खरेदीदार" : "Verified Buyer"}
                  </span>
                </div>

                <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--text)", margin: "0 0 16px", fontStyle: "italic" }}>
                  "{isMr ? rev.commentMr : rev.commentEn}"
                </p>
              </div>

              <div style={{ borderTop: "1px solid var(--line)", paddingTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--green)" }}>{rev.name}</h4>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{isMr ? rev.locationMr : rev.locationEn}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "var(--gold)", fontWeight: 600 }}>{rev.date}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--gold)", fontWeight: 600, marginTop: 4 }}>
                  📦 {isMr ? rev.petiMr : rev.petiEn}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
