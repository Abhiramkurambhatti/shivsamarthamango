"use client";

import Link from "next/link";
import { useStore } from "@/components/StoreProvider";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function Cart() {
  const s = useStore();
  const isMr = s.lang === "mr";

  return (
    <main className="container" style={{ paddingBottom: 60 }}>
      <div className="page-title">
        <div className="eyebrow">{isMr ? "आपली निवड" : "Your Selection"}</div>
        <h1 style={{ fontSize: "clamp(32px, 4.5vw, 48px)", margin: "10px 0 16px", color: "var(--green)" }}>
          {isMr ? "खरेदी कार्ट" : "Shopping Cart"}
        </h1>
      </div>

      <div className="content-card">
        {!s.cart.length ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <ShoppingBag size={48} color="var(--gold)" style={{ margin: "0 auto 16px" }} />
            <h3 className="serif" style={{ fontSize: 22, margin: "0 0 10px" }}>
              {isMr ? "आपली कार्ट रिकामी आहे." : "Your cart is empty."}
            </h3>
            <p className="muted" style={{ marginBottom: 24 }}>
              {isMr
                ? "आमच्या देवगड बागेतील ताजी पेटी कार्टमध्ये जोडा."
                : "Add fresh Alphonso mango petis from our orchard to get started."}
            </p>
            <Link className="btn gold" href="/shop">
              {isMr ? "आंबे खरेदी करा" : "Explore Mangoes"} <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            {s.cart.map((i) => (
              <div className="cartrow" key={i.cartKey || i.id}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <b style={{ fontSize: 16 }}>{i.name}</b>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 6,
                        background: "rgba(200, 154, 75, 0.15)",
                        border: "1px solid rgba(200, 154, 75, 0.4)",
                        color: "var(--green)",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {i.unitLabel || (i.unit === "dozen" ? (isMr ? "१ डझन" : "1 Dozen") : i.unit === "grams" ? (isMr ? "५०० ग्रॅम" : "500g") : i.unit === "kg" ? (isMr ? "१ किलो" : "1 Kg") : (isMr ? `${i.weight} किलो पेटी` : `${i.weight}kg box`))}
                    </span>
                  </div>
                  <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                    {isMr ? "दर:" : "Rate:"} ₹{i.price.toLocaleString("en-IN")} / {i.unit === "dozen" ? (isMr ? "डझन" : "dozen") : i.unit === "grams" ? (isMr ? "५०० ग्रॅम" : "500g") : i.unit === "kg" ? (isMr ? "किलो" : "kg") : (isMr ? "पेटी" : "box")}
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button className="iconbtn" onClick={() => s.change(i.cartKey || i.id, i.qty - 1)}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{i.qty}</span>
                  <button className="iconbtn" onClick={() => s.change(i.cartKey || i.id, i.qty + 1)}>+</button>
                </div>

                <div className="line-total" style={{ textAlign: "right" }}>
                  <b style={{ fontSize: 16, color: "var(--green)" }}>
                    ₹{(i.price * i.qty).toLocaleString("en-IN")}
                  </b>
                  <button
                    onClick={() => s.remove(i.cartKey || i.id)}
                    style={{ display: "block", border: 0, background: "none", color: "var(--red)", fontSize: 12, cursor: "pointer", marginTop: 4, marginLeft: "auto" }}
                  >
                    {isMr ? "काढून टाका" : "Remove"}
                  </button>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", borderTop: "1px solid var(--line)", marginTop: 12 }}>
              <b style={{ fontSize: 18 }}>{isMr ? "एकूण रक्कम (Subtotal)" : "Subtotal"}</b>
              <b style={{ fontSize: 24, color: "var(--green)" }}>₹{s.total.toLocaleString("en-IN")}</b>
            </div>

            <p className="muted" style={{ fontSize: 13, marginBottom: 20 }}>
              {isMr
                ? "सर्व पेटी थेट देवगड नारिंग्रे बागेतून सुरक्षित पॅकिंगसह पाठवली जाते."
                : "All boxes are dispatched directly from our Naringre orchard with authentic protective packing."}
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link className="btn gold" href="/checkout">
                {isMr ? "ऑर्डर पूर्ण करा (Checkout)" : "Continue to Checkout"} <ArrowRight size={16} />
              </Link>
              <Link className="btn secondary" href="/shop">
                {isMr ? "अधिक आंबे जोडा" : "Continue Shopping"}
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
