"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useStore } from "@/components/StoreProvider";
import { translations, Language } from "@/lib/translations";
import { ArrowRight, ChevronDown } from "lucide-react";

const TOTAL_FRAMES = 240;
const FRAME_PATH = (n: number) => `/images/mango/${n}.webp`;

export default function Hero3DScrollytelling() {
  const s = useStore();
  const lang = (s.lang === "mr" ? "mr" : "en") as Language;
  const t = translations[lang];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // useScroll on this track
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"],
  });

  // Render a specific frame with centered cover fit
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // Resize canvas for high DPI
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

  // Preload frames in progressive tiers
  useEffect(() => {
    const imgs: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);

    const loadSingle = (index: number) => {
      const img = new Image();
      img.src = FRAME_PATH(index + 1);
      img.onload = () => {
        imgs[index] = img;
        imagesRef.current[index] = img;
        if (index === 0) {
          renderFrame(0);
        }
      };
    };

    // Immediate tier: first 20 frames
    for (let i = 0; i < Math.min(20, TOTAL_FRAMES); i++) {
      loadSingle(i);
    }

    // Secondary tier: sample frames across the timeline
    for (let i = 20; i < TOTAL_FRAMES; i += 3) {
      loadSingle(i);
    }

    // Tertiary tier: load the rest
    const timer = setTimeout(() => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!imgs[i]) loadSingle(i);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [renderFrame]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // Connect scrollProgress to RAF frame rendering
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (latest) => {
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
  }, [scrollYProgress, renderFrame]);

  // Stage 1 Overlay Transform
  const s1Opacity = useTransform(scrollYProgress, [0.0, 0.05, 0.20, 0.26], [1, 1, 1, 0]);
  const s1Y = useTransform(scrollYProgress, [0.0, 0.05, 0.20, 0.26], [0, 0, 0, -30]);

  // Stage 2 Overlay Transform
  const s2Opacity = useTransform(scrollYProgress, [0.28, 0.35, 0.48, 0.54], [0, 1, 1, 0]);
  const s2Y = useTransform(scrollYProgress, [0.28, 0.35, 0.48, 0.54], [30, 0, 0, -30]);

  // Stage 3 Overlay Transform
  const s3Opacity = useTransform(scrollYProgress, [0.56, 0.62, 0.74, 0.80], [0, 1, 1, 0]);
  const s3Y = useTransform(scrollYProgress, [0.56, 0.62, 0.74, 0.80], [30, 0, 0, -30]);

  // Stage 4 Overlay Transform
  const s4Opacity = useTransform(scrollYProgress, [0.82, 0.88, 0.98, 1.0], [0, 1, 1, 0.2]);
  const s4Y = useTransform(scrollYProgress, [0.82, 0.88, 0.98, 1.0], [30, 0, 0, -15]);

  // Bottom scroll hint fades out after 15% scroll
  const hintOpacity = useTransform(scrollYProgress, [0.0, 0.14], [1, 0]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      style={{
        height: "280vh",
        position: "relative",
        background: "#0c0804",
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
        {/* Instant fallback poster image: ensures no black void or waiting */}
        <img
          src="/images/mango/1.webp"
          alt="Shiv Samarth 3D Alphonso Mango"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            pointerEvents: "none",
          }}
        />

        {/* Soft radial and vertical gradients for typography contrast */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 10,
            background:
              "linear-gradient(180deg, rgba(12,8,4,0.65) 0%, transparent 22%, transparent 78%, rgba(12,8,4,0.92) 100%)",
          }}
        />

        {/* High-DPI 3D Canvas */}
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
            transform: "translateZ(0)",
            zIndex: 5,
          }}
        />

        {/* ── STAGE 1 OVERLAY (Left Aligned) ── */}
        <motion.div
          style={{
            opacity: s1Opacity,
            y: s1Y,
            position: "absolute",
            top: "50%",
            left: "min(6vw, 64px)",
            transform: "translateY(-50%)",
            maxWidth: 580,
            zIndex: 20,
            pointerEvents: "auto",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(12, 8, 4, 0.75)",
              border: "1px solid rgba(255, 183, 77, 0.4)",
              color: "#FFB74D",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 14,
              backdropFilter: "blur(10px)",
            }}
          >
            ✦ {t.hero3D.s1Tag}
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.4rem, 4.5vw, 4rem)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "#FFF5E6",
              margin: "0 0 14px",
              textShadow: "0 4px 28px rgba(0,0,0,0.9)",
            }}
          >
            {t.hero3D.s1Title}
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 1.8vw, 1.25rem)",
              color: "rgba(255, 245, 230, 0.9)",
              lineHeight: 1.55,
              margin: "0 0 24px",
              textShadow: "0 2px 14px rgba(0,0,0,0.9)",
            }}
          >
            {t.hero3D.s1Sub}
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => scrollToSection("products-catalog")}
              className="btn gold"
              style={{ padding: "12px 24px", fontSize: 14 }}
            >
              {t.hero3D.skipBtn} <ArrowRight size={16} />
            </button>
            <button
              onClick={() => scrollToSection("founder-story")}
              className="btn secondary"
              style={{
                color: "#FFF5E6",
                borderColor: "rgba(255, 245, 230, 0.4)",
                padding: "12px 22px",
                fontSize: 14,
              }}
            >
              {t.hero3D.storyBtn}
            </button>
          </div>
        </motion.div>

        {/* ── STAGE 2 OVERLAY (Right Aligned) ── */}
        <motion.div
          style={{
            opacity: s2Opacity,
            y: s2Y,
            position: "absolute",
            top: "50%",
            right: "min(6vw, 64px)",
            transform: "translateY(-50%)",
            maxWidth: 540,
            textAlign: "right",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(12, 8, 4, 0.75)",
              border: "1px solid rgba(255, 183, 77, 0.4)",
              color: "#FFB74D",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 14,
              backdropFilter: "blur(10px)",
            }}
          >
            ✦ {t.hero3D.s2Tag}
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#FFF5E6",
              margin: "0 0 14px",
              textShadow: "0 4px 28px rgba(0,0,0,0.9)",
            }}
          >
            {t.hero3D.s2Title}
          </h2>
          <p
            style={{
              fontSize: "clamp(1rem, 1.7vw, 1.2rem)",
              color: "rgba(255, 245, 230, 0.9)",
              lineHeight: 1.55,
              margin: 0,
              textShadow: "0 2px 14px rgba(0,0,0,0.9)",
            }}
          >
            {t.hero3D.s2Sub}
          </p>
        </motion.div>

        {/* ── STAGE 3 OVERLAY (Left Aligned) ── */}
        <motion.div
          style={{
            opacity: s3Opacity,
            y: s3Y,
            position: "absolute",
            top: "50%",
            left: "min(6vw, 64px)",
            transform: "translateY(-50%)",
            maxWidth: 540,
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(12, 8, 4, 0.75)",
              border: "1px solid rgba(255, 183, 77, 0.4)",
              color: "#FFB74D",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 14,
              backdropFilter: "blur(10px)",
            }}
          >
            ✦ {t.hero3D.s3Tag}
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#FFF5E6",
              margin: "0 0 14px",
              textShadow: "0 4px 28px rgba(0,0,0,0.9)",
            }}
          >
            {t.hero3D.s3Title}
          </h2>
          <p
            style={{
              fontSize: "clamp(1rem, 1.7vw, 1.2rem)",
              color: "rgba(255, 245, 230, 0.9)",
              lineHeight: 1.55,
              margin: 0,
              textShadow: "0 2px 14px rgba(0,0,0,0.9)",
            }}
          >
            {t.hero3D.s3Sub}
          </p>
        </motion.div>

        {/* ── STAGE 4 OVERLAY (Right Aligned + CTA) ── */}
        <motion.div
          style={{
            opacity: s4Opacity,
            y: s4Y,
            position: "absolute",
            top: "50%",
            right: "min(6vw, 64px)",
            transform: "translateY(-50%)",
            maxWidth: 560,
            textAlign: "right",
            zIndex: 20,
            pointerEvents: "auto",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(12, 8, 4, 0.75)",
              border: "1px solid rgba(255, 183, 77, 0.4)",
              color: "#FFB74D",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 14,
              backdropFilter: "blur(10px)",
            }}
          >
            ✦ {t.hero3D.s4Tag}
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2.2rem, 4vw, 3.6rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#FFF5E6",
              margin: "0 0 14px",
              textShadow: "0 4px 28px rgba(0,0,0,0.9)",
            }}
          >
            {t.hero3D.s4Title}
          </h2>
          <p
            style={{
              fontSize: "clamp(1rem, 1.7vw, 1.2rem)",
              color: "rgba(255, 245, 230, 0.9)",
              lineHeight: 1.55,
              margin: "0 0 20px",
              textShadow: "0 2px 14px rgba(0,0,0,0.9)",
            }}
          >
            {t.hero3D.s4Sub}
          </p>

          <button
            onClick={() => scrollToSection("products-catalog")}
            className="btn gold"
            style={{ padding: "14px 28px", fontSize: 15 }}
          >
            {t.hero3D.shopNow} <ArrowRight size={17} />
          </button>
        </motion.div>

        {/* Scroll Down Hint at bottom */}
        <motion.div
          style={{
            opacity: hintOpacity,
            position: "absolute",
            bottom: 28,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            zIndex: 25,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              color: "rgba(255, 245, 230, 0.8)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            {t.hero3D.scrollHint}
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <ChevronDown size={22} color="#FFB74D" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
