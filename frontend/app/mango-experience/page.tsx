"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useStore } from "@/components/StoreProvider";
import { Sparkles, ArrowRight, ShieldCheck, Truck, RotateCcw, Check, ShoppingBag } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// CONFIGURATION & DATA
// ─────────────────────────────────────────────────────────────
const TOTAL_FRAMES = 240;
const FRAME_PATH = (n: number) => `/images/mango/${n}.webp`;

const SECTIONS = [
  {
    range: [0.0, 0.22],
    tag: "GI Tagged · Devgad & Ratnagiri",
    title: "Shiv Samarth Hapus",
    subtitle: "Pure Konkan sunshine. Hand-picked at peak ripeness.",
    align: "left" as const,
  },
  {
    range: [0.25, 0.48],
    tag: "Natural Aroma & Flavor",
    title: "Bursting With Fresh Mango.",
    subtitle: "Sun-drenched Alphonso mangoes, nurtured by laterite soil and sea breezes.",
    align: "right" as const,
  },
  {
    range: [0.51, 0.73],
    tag: "Nature's Energy Boost",
    title: "Vitamin-Rich Refreshment.",
    subtitle: "Packed with vitamins A & C, vital enzymes, and liquid gold vitality.",
    align: "left" as const,
  },
  {
    range: [0.76, 0.98],
    tag: "100% Authentic Origin",
    title: "Pure Fruit. Zero Concentrate.",
    subtitle: "Cold-packed within hours of harvest. No chemicals, no added sugar, zero preservatives.",
    align: "right" as const,
  },
];

const STATS = [
  { label: "Pure Pulp", val: "100%" },
  { label: "Added Sugar", val: "0g" },
  { label: "Preservatives", val: "Zero" },
  { label: "Artificial Color", val: "0%" },
];

// ─────────────────────────────────────────────────────────────
// TOP NAVBAR
// ─────────────────────────────────────────────────────────────
function ExperienceNavbar({ scrolled }: { scrolled: boolean }) {
  const store = useStore();

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        background: scrolled ? "rgba(12, 8, 4, 0.85)" : "linear-gradient(180deg, rgba(12,8,4,0.7) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(18px)" : "blur(4px)",
        borderBottom: scrolled ? "1px solid rgba(255, 183, 77, 0.15)" : "1px solid transparent",
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "0 24px",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FFB74D 0%, #F57C00 100%)",
              display: "grid",
              placeItems: "center",
              fontSize: 18,
              boxShadow: "0 0 16px rgba(245, 124, 0, 0.4)",
            }}
          >
            🥭
          </div>
          <div>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: "-0.01em",
                color: "#FFF5E6",
                display: "block",
                lineHeight: 1.1,
              }}
            >
              SHIV SAMARTH
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: "#FFB74D",
                textTransform: "uppercase",
              }}
            >
              Hapus · Devgad
            </span>
          </div>
        </Link>

        {/* Center Pill */}
        <div
          style={{
            display: "none",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 183, 77, 0.25)",
            fontSize: 11,
            fontWeight: 700,
            color: "#FFD54F",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
          className="desktop-pill"
        >
          <Sparkles size={13} color="#FFB74D" />
          <span>Interactive 3D Experience</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            href="/shop"
            style={{
              color: "rgba(255, 245, 230, 0.75)",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: 8,
              transition: "color 0.2s",
            }}
          >
            Explore Shop
          </Link>

          <Link
            href="/cart"
            style={{
              position: "relative",
              color: "#FFF5E6",
              padding: "8px",
              display: "grid",
              placeItems: "center",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              textDecoration: "none",
            }}
            aria-label="View Cart"
          >
            <ShoppingBag size={16} />
            {store.count > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  background: "#F57C00",
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 800,
                  borderRadius: "50%",
                  width: 17,
                  height: 17,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {store.count}
              </span>
            )}
          </Link>

          <a
            href="#buynow"
            style={{
              background: "linear-gradient(135deg, #FFB74D 0%, #F57C00 100%)",
              color: "#1A0F07",
              fontWeight: 800,
              fontSize: 13,
              padding: "9px 20px",
              borderRadius: 999,
              textDecoration: "none",
              boxShadow: "0 4px 18px rgba(245, 124, 0, 0.35)",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
          >
            Order Peti <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────
// CANVAS 3D ENGINE
// ─────────────────────────────────────────────────────────────
function Mango3DCanvas({
  scrollProgress,
}: {
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [loadPct, setLoadPct] = useState(0);
  const [ready, setReady] = useState(false);

  // Draw frame with responsive centered cover fit
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retrieve exact or nearest loaded frame
    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < 25; offset++) {
        const prev = imagesRef.current[frameIndex - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[frameIndex + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // Cover calculation
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // Responsive canvas resize (devicePixelRatio aware)
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    renderFrame(currentFrameRef.current);
  }, [renderFrame]);

  // Preload frames in progressive priority tiers
  useEffect(() => {
    let loadedCount = 0;
    const imgs: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);

    const loadSingle = (index: number, onDone?: () => void) => {
      const img = new Image();
      img.src = FRAME_PATH(index + 1);
      img.onload = () => {
        imgs[index] = img;
        imagesRef.current[index] = img;
        loadedCount++;
        setLoadPct(Math.round((loadedCount / TOTAL_FRAMES) * 100));

        if (index === 0) {
          renderFrame(0);
          setReady(true);
        }
        if (onDone) onDone();
      };
      img.onerror = () => {
        loadedCount++;
        if (onDone) onDone();
      };
    };

    // Tier 1: First 15 frames immediately
    for (let i = 0; i < Math.min(15, TOTAL_FRAMES); i++) {
      loadSingle(i);
    }

    // Tier 2: Sample every 4th frame for early scrub responsiveness
    const step = 4;
    for (let i = 15; i < TOTAL_FRAMES; i += step) {
      loadSingle(i);
    }

    // Tier 3: Fill in all remaining frames with light interval
    const timeout = setTimeout(() => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!imgs[i]) {
          loadSingle(i);
        }
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [renderFrame]);

  // Window resize listener
  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Connect scrollProgress to RAF canvas frame draw
  useEffect(() => {
    const unsub = scrollProgress.on("change", (latest) => {
      const target = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(latest * (TOTAL_FRAMES - 1)))
      );
      if (target === currentFrameRef.current) return;
      currentFrameRef.current = target;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        renderFrame(target);
      });
    });

    return () => {
      unsub();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollProgress, renderFrame]);

  return (
    <>
      {/* Subtle loader pill */}
      <AnimatePresence>
        {!ready && (
          <motion.div
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 40,
              background: "#0c0804",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              style={{ fontSize: 52 }}
            >
              🥭
            </motion.div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  color: "#FFB74D",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Loading 3D Visuals
              </p>
              <div
                style={{
                  width: 200,
                  height: 4,
                  borderRadius: 99,
                  background: "rgba(255,255,255,0.1)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{
                    height: "100%",
                    width: `${loadPct}%`,
                    background: "linear-gradient(90deg, #FFB74D, #F57C00)",
                    borderRadius: 99,
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          imageRendering: "auto",
          WebkitBackfaceVisibility: "hidden",
          transform: "translateZ(0)",
        }}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// INDIVIDUAL TEXT OVERLAY COMPONENT
// ─────────────────────────────────────────────────────────────
function TextSection({
  section,
  scrollYProgress,
}: {
  section: (typeof SECTIONS)[0];
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const [start, end] = section.range;
  const pad = (end - start) * 0.22;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + pad, end - pad, end],
    [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollYProgress,
    [start, start + pad, end - pad, end],
    [40, 0, 0, -40]
  );

  const isLeft = section.align === "left";

  return (
    <motion.div
      style={{
        opacity,
        y,
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        ...(isLeft ? { left: "min(6vw, 64px)" } : { right: "min(6vw, 64px)" }),
        maxWidth: 520,
        textAlign: isLeft ? "left" : "right",
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      {/* Category Pill */}
      <span
        style={{
          display: "inline-block",
          padding: "6px 14px",
          borderRadius: 999,
          background: "rgba(12, 8, 4, 0.65)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 183, 77, 0.4)",
          color: "#FFD54F",
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginBottom: 16,
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        {section.tag}
      </span>

      {/* Main Title */}
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
          fontWeight: 800,
          color: "#FFF5E6",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          margin: 0,
          textShadow: "0 4px 30px rgba(0,0,0,0.85), 0 2px 10px rgba(0,0,0,0.6)",
        }}
      >
        {section.title}
      </h2>

      {/* Subtitle */}
      {section.subtitle && (
        <p
          style={{
            marginTop: 14,
            fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
            color: "rgba(255, 245, 230, 0.88)",
            lineHeight: 1.55,
            fontWeight: 400,
            textShadow: "0 2px 14px rgba(0,0,0,0.9)",
          }}
        >
          {section.subtitle}
        </p>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// STATS BAR
// ─────────────────────────────────────────────────────────────
function StatsBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 16,
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 183, 77, 0.2)",
        borderRadius: 24,
        padding: "36px 28px",
        maxWidth: 880,
        margin: "0 auto",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
      }}
    >
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          style={{
            textAlign: "center",
            borderLeft: i > 0 ? "1px solid rgba(255, 183, 77, 0.12)" : "none",
            padding: "0 12px",
          }}
        >
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
              fontWeight: 800,
              background: "linear-gradient(135deg, #FFE082 0%, #FFB74D 50%, #F57C00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
            }}
          >
            {stat.val}
          </div>
          <div
            style={{
              color: "rgba(255, 245, 230, 0.6)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginTop: 6,
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// DETAILS SECTION
// ─────────────────────────────────────────────────────────────
function DetailsSection() {
  return (
    <section style={{ padding: "100px 24px", position: "relative", zIndex: 10 }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 60,
          alignItems: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <span
            style={{
              color: "#FFB74D",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              display: "inline-block",
              marginBottom: 12,
            }}
          >
            The King of Fruits
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
              fontWeight: 800,
              color: "#FFF5E6",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Devgad Alphonso: <br />
            Nature&apos;s Liquid Gold
          </h2>
          <p
            style={{
              marginTop: 22,
              color: "rgba(255, 245, 230, 0.72)",
              fontSize: 16,
              lineHeight: 1.8,
            }}
          >
            Our Devgad Hapus is grown on the sun-bathed coastal slopes of Maharashtra.
            Famous for its saffron-gold skin, non-fibrous silken pulp, and intoxicating
            aroma, each mango is hand-harvested from mature trees rooted in rich laterite
            rock. We cold-pack our harvest within hours of picking to lock in every enzyme,
            vitamin, and drop of natural sweetness.
          </p>

          <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["GI Tag Devgad", "Cold Packed", "100% Tree Ripened", "Zero Carbides"].map((badge) => (
              <span
                key={badge}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  background: "rgba(255, 183, 77, 0.08)",
                  border: "1px solid rgba(255, 183, 77, 0.3)",
                  color: "#FFE082",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                ✦ {badge}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Visual Card */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          style={{
            position: "relative",
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(245, 124, 0, 0.15)",
            border: "1px solid rgba(255, 183, 77, 0.2)",
          }}
        >
          <img
            src="/images/mango/115.webp"
            alt="Devgad Hapus 3D Render Frame"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              aspectRatio: "16/9",
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
              padding: "16px 20px",
              borderRadius: 18,
              background: "rgba(12, 8, 4, 0.8)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255, 183, 77, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ color: "#FFB74D", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                3D Volumetric Sequence
              </div>
              <div style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>
                230 High-Resolution Frames
              </div>
            </div>
            <span
              style={{
                background: "linear-gradient(135deg, #FFB74D, #F57C00)",
                color: "#1A0F07",
                fontWeight: 800,
                fontSize: 11,
                padding: "6px 12px",
                borderRadius: 999,
              }}
            >
              360° SPIN
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// FRESHNESS SECTION
// ─────────────────────────────────────────────────────────────
function FreshnessSection() {
  const cards = [
    {
      icon: "🌳",
      title: "Orchard Harvested",
      desc: "Hand-picked at peak maturity from certified GI-tagged orchards in Devgad.",
    },
    {
      icon: "❄️",
      title: "Cold-Chain Preserved",
      desc: "Maintained at optimal humidity and cool temperature. Never heated, never processed.",
    },
    {
      icon: "📦",
      title: "Traditional Peti Packing",
      desc: "Packed in breathable hay inside sturdy corrugated boxes for pristine doorstep arrival.",
    },
  ];

  return (
    <section style={{ padding: "80px 24px", position: "relative", zIndex: 10 }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <span
            style={{
              color: "#FFB74D",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Farm to Doorstep
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
              fontWeight: 800,
              color: "#FFF5E6",
              marginTop: 10,
            }}
          >
            Harvested Under the Konkan Sun. <br />
            <span
              style={{
                background: "linear-gradient(135deg, #FFE082, #FFB74D, #F57C00)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Delivered Fresh to Your Home.
            </span>
          </h2>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            marginTop: 50,
          }}
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              style={{
                background: "rgba(255, 255, 255, 0.025)",
                border: "1px solid rgba(255, 183, 77, 0.16)",
                borderRadius: 24,
                padding: "36px 28px",
                textAlign: "left",
                backdropFilter: "blur(12px)",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 16 }}>{card.icon}</div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#FFF5E6",
                  marginBottom: 10,
                }}
              >
                {card.title}
              </h3>
              <p style={{ color: "rgba(255, 245, 230, 0.65)", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// BUY NOW SECTION
// ─────────────────────────────────────────────────────────────
function BuyNowSection() {
  const store = useStore();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    // Add Devgad Alphonso peti to store cart
    store.add({
      id: "devgad-peti-3d",
      title: "Devgad Hapus Alphonso (5 kg Peti)",
      price: 2400,
      image: "/images/mango/115.webp",
      grade: "Grade A Export Quality",
      unit: "5 kg peti (approx. 2 dozen)",
      weight: "5 kg",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2400);
  };

  return (
    <section id="buynow" style={{ padding: "100px 24px", position: "relative", zIndex: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: 960,
          margin: "0 auto",
          background: "linear-gradient(135deg, rgba(255, 183, 77, 0.08) 0%, rgba(12, 8, 4, 0.7) 100%)",
          border: "1px solid rgba(255, 183, 77, 0.25)",
          borderRadius: 32,
          padding: "clamp(32px, 6vw, 64px)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 48,
            alignItems: "center",
          }}
        >
          {/* Product details */}
          <div>
            <span
              style={{
                color: "#FFB74D",
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              2026 Season Booking Open
            </span>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                fontWeight: 800,
                color: "#FFF5E6",
                marginTop: 8,
                marginBottom: 12,
              }}
            >
              Devgad Hapus Alphonso
            </h2>

            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 48,
                  fontWeight: 800,
                  color: "#FFE082",
                }}
              >
                ₹2,400
              </span>
              <span style={{ color: "rgba(255, 245, 230, 0.6)", fontSize: 15 }}>
                per 5 kg premium wooden peti
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
              {[
                "GI Tagged authentic Devgad origin",
                "Naturally straw-ripened without chemical carbide",
                "Chilled eco-packaging with protective padding",
              ].map((feat) => (
                <div key={feat} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: "rgba(255, 183, 77, 0.15)",
                      display: "grid",
                      placeItems: "center",
                      color: "#FFB74D",
                      fontSize: 12,
                    }}
                  >
                    ✓
                  </div>
                  <span style={{ color: "rgba(255, 245, 230, 0.8)", fontSize: 14 }}>{feat}</span>
                </div>
              ))}
            </div>

            <div
              style={{
                padding: "16px 20px",
                borderRadius: 16,
                background: "rgba(255, 183, 77, 0.06)",
                border: "1px solid rgba(255, 183, 77, 0.18)",
              }}
            >
              <div style={{ color: "#FFD54F", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                <Truck size={15} /> Express Metro Delivery
              </div>
              <p style={{ color: "rgba(255, 245, 230, 0.65)", fontSize: 13, margin: "4px 0 0" }}>
                Next-day delivery available across Mumbai, Pune &amp; major cities. Each peti is verified before dispatch.
              </p>
            </div>
          </div>

          {/* Action Callouts */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              style={{
                width: "100%",
                padding: "18px 24px",
                borderRadius: 16,
                background: added ? "#2E7D32" : "linear-gradient(135deg, #FFB74D 0%, #F57C00 100%)",
                color: added ? "#fff" : "#1A0F07",
                fontSize: 17,
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                boxShadow: added ? "0 8px 30px rgba(46, 125, 50, 0.4)" : "0 8px 30px rgba(245, 124, 0, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background 0.3s, color 0.3s",
              }}
            >
              {added ? (
                <>
                  <Check size={18} /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add Peti to Cart — ₹2,400
                </>
              )}
            </motion.button>

            <Link href="/checkout" style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  borderRadius: 16,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 183, 77, 0.35)",
                  color: "#FFF5E6",
                  fontSize: 15,
                  fontWeight: 700,
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                Proceed to Direct Checkout →
              </motion.div>
            </Link>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
                color: "rgba(255, 245, 230, 0.5)",
                fontSize: 12,
                marginTop: 6,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <ShieldCheck size={14} color="#FFB74D" /> 100% Guaranteed Fresh
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <RotateCcw size={14} color="#FFB74D" /> Hassle-Free Replacement
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// CUSTOM LUXURY FOOTER
// ─────────────────────────────────────────────────────────────
function ExperienceFooter() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 10,
        background: "#080503",
        borderTop: "1px solid rgba(255, 183, 77, 0.12)",
        padding: "60px 24px 30px",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>🥭</span>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 700,
                color: "#FFF5E6",
              }}
            >
              Shiv Samarth Hapus
            </span>
          </div>
          <p style={{ color: "rgba(255, 245, 230, 0.5)", fontSize: 13, margin: 0, maxWidth: 360 }}>
            GI-Tagged Devgad Alphonso Mangoes. From our generational orchards in the Konkan to your doorstep.
          </p>
        </div>

        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link
            href="/shop"
            style={{ color: "rgba(255, 245, 230, 0.7)", fontSize: 14, textDecoration: "none" }}
          >
            Shop Mangoes
          </Link>
          <Link
            href="/story"
            style={{ color: "rgba(255, 245, 230, 0.7)", fontSize: 14, textDecoration: "none" }}
          >
            Our Story
          </Link>
          <Link
            href="/"
            style={{
              color: "#FFB74D",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            ← Back to Main Website
          </Link>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1180,
          margin: "36px auto 0",
          paddingTop: 20,
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          textAlign: "center",
          color: "rgba(255, 245, 230, 0.3)",
          fontSize: 12,
        }}
      >
        © 2026 Shiv Samarth Hapus. All rights reserved.
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOT COMPONENT
// ─────────────────────────────────────────────────────────────
export default function MangoExperiencePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Global scroll listener for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // useScroll on sticky scroll track
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div
      style={{
        background: "#0c0804",
        color: "#FFF5E6",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <ExperienceNavbar scrolled={scrolled} />

      {/* ── STICKY SCROLL CONTAINER ──
          450vh allows for plenty of smooth scrolling room.
          Sticky child is 100vh high and pinned to top: 0.
      */}
      <div
        ref={scrollContainerRef}
        style={{
          height: "450vh",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            overflow: "hidden",
            background: "#0c0804",
          }}
        >
          {/* Top & Bottom Cinematic Vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 10,
              background:
                "linear-gradient(180deg, rgba(12,8,4,0.65) 0%, transparent 18%, transparent 82%, rgba(12,8,4,0.85) 100%)",
            }}
          />

          {/* 3D Canvas Visuals */}
          <Mango3DCanvas scrollProgress={scrollYProgress} />

          {/* Four Dynamic Text Overlays */}
          {SECTIONS.map((section, idx) => (
            <TextSection
              key={idx}
              section={section}
              scrollYProgress={scrollYProgress}
            />
          ))}

          {/* Scroll Down Hint (fades out early) */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 30,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 25,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              color: "rgba(255, 245, 230, 0.6)",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 700,
              opacity: useTransform(scrollYProgress, [0, 0.08], [1, 0]),
              pointerEvents: "none",
            }}
          >
            <span>Scroll to Rotate 3D</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              ↓
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── BELOW-FOLD CONTENT ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          background: "linear-gradient(180deg, #0c0804 0%, #120b06 50%, #080503 100%)",
        }}
      >
        <section style={{ padding: "80px 24px 40px" }}>
          <StatsBar />
        </section>

        <DetailsSection />
        <FreshnessSection />
        <BuyNowSection />
        <ExperienceFooter />
      </div>
    </div>
  );
}
