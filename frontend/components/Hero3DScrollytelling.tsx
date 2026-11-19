"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useStore } from "@/components/StoreProvider";
import { translations, Language } from "@/lib/translations";
import { ArrowRight, ChevronDown } from "lucide-react";

// The full 3D mango model with splash is active from frame 95 to 240
const START_FRAME = 95;
const END_FRAME = 240;
const TOTAL_FRAMES = END_FRAME - START_FRAME + 1; // 146 frames
const HERO_POSTER_FRAME = 120; // Gorgeous centerpiece 3D mango fruit with splash
const FRAME_PATH = (n: number) => `/images/mango/${n}.webp`;

export default function Hero3DScrollytelling() {
  const s = useStore();
  const lang = (s.lang === "mr" ? "mr" : "en") as Language;
  const t = translations[lang];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Indexed by relative frame offset 0 .. (TOTAL_FRAMES - 1)
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrameRef = useRef(HEROFRAME_OFFSET(HERO_POSTER_FRAME));
  const rafRef = useRef<number | null>(null);

  function HEROFRAME_OFFSET(frameNum: number) {
    return Math.max(0, Math.min(TOTAL_FRAMES - 1, frameNum - START_FRAME));
  }

  // useScroll on the track
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"],
  });

  // Render a specific frame with mobile-optimized portrait & desktop landscape centering
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Find nearest loaded frame within search window
      for (let offset = 1; offset < 35; offset++) {
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

    const isPortrait = ch > cw;
    let scale = Math.max(cw / iw, ch / ih);
    let targetCenterX = iw * 0.5;
    let targetCenterY = ih * 0.5;

    if (isPortrait) {
      // On mobile portrait screens, center directly on the 3D mango fruit (natural x ≈ 840px, y ≈ 520px)
      // and scale so the entire fruit and splash fit unobstructed
      scale = Math.max(cw / (iw * 0.68), ch / (ih * 1.08));
      targetCenterX = iw * 0.44;
      targetCenterY = ih * 0.48;
    }

    const dw = iw * scale;
    const dh = ih * scale;
    const dx = isPortrait ? cw / 2 - targetCenterX * scale : (cw - dw) / 2;
    const dy = isPortrait ? ch / 2 - targetCenterY * scale : (ch - dh) / 2;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, dx, dy, dw, dh);
  }, []);

  // Resize canvas for crisp Retina / high DPI displays
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5); // Cap at 2.5 for mobile GPU performance
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    renderFrame(currentFrameRef.current);
  }, [renderFrame]);

  // Preload frames in progressive tiers with priority on hero mango fruit
  useEffect(() => {
    const imgs: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES).fill(null);

    const loadSingle = (offsetIndex: number, isHero = false) => {
      const actualFrameNum = START_FRAME + offsetIndex;
      const img = new Image();
      img.src = FRAME_PATH(actualFrameNum);
      img.onload = () => {
        imgs[offsetIndex] = img;
        imagesRef.current[offsetIndex] = img;
        if (isHero || offsetIndex === currentFrameRef.current) {
          renderFrame(offsetIndex);
        }
      };
    };

    // Priority 1: Load the hero centerpiece frame immediately
    const heroOffset = HEROFRAME_OFFSET(HERO_POSTER_FRAME);
    loadSingle(heroOffset, true);

    // Priority 2: Immediate tier — frames around start and hero
    for (let i = 0; i < Math.min(25, TOTAL_FRAMES); i++) {
      loadSingle(i);
    }
    for (let i = Math.max(0, heroOffset - 10); i < Math.min(TOTAL_FRAMES, heroOffset + 15); i++) {
      if (!imgs[i]) loadSingle(i);
    }

    // Priority 3: Secondary tier — sample every 2nd frame across 95 to 240
    for (let i = 25; i < TOTAL_FRAMES; i += 2) {
      if (!imgs[i]) loadSingle(i);
    }

    // Priority 4: Tertiary tier — load the rest smoothly in background
    const timer = setTimeout(() => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (!imgs[i]) loadSingle(i);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [renderFrame]);

  // Window resize handler
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
  const s1Opacity = useTransform(scrollYProgress, [0.0, 0.05, 0.18, 0.24], [1, 1, 1, 0]);
  const s1Y = useTransform(scrollYProgress, [0.0, 0.05, 0.18, 0.24], [0, 0, 0, -25]);

  // Stage 2 Overlay Transform
  const s2Opacity = useTransform(scrollYProgress, [0.26, 0.33, 0.45, 0.52], [0, 1, 1, 0]);
  const s2Y = useTransform(scrollYProgress, [0.26, 0.33, 0.45, 0.52], [25, 0, 0, -25]);

  // Stage 3 Overlay Transform
  const s3Opacity = useTransform(scrollYProgress, [0.54, 0.61, 0.72, 0.78], [0, 1, 1, 0]);
  const s3Y = useTransform(scrollYProgress, [0.54, 0.61, 0.72, 0.78], [25, 0, 0, -25]);

  // Stage 4 Overlay Transform
  const s4Opacity = useTransform(scrollYProgress, [0.80, 0.86, 0.98, 1.0], [0, 1, 1, 0.2]);
  const s4Y = useTransform(scrollYProgress, [0.80, 0.86, 0.98, 1.0], [25, 0, 0, -15]);

  // Bottom scroll hint fades out after 12% scroll
  const hintOpacity = useTransform(scrollYProgress, [0.0, 0.12], [1, 0]);

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
        height: "240vh",
        position: "relative",
        background: "linear-gradient(180deg, #180c04 0%, #2b1506 50%, #180c04 100%)",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "100%",
          height: "100dvh",
          minHeight: "580px",
          overflow: "hidden",
          background: "linear-gradient(180deg, #180c04 0%, #2b1506 50%, #180c04 100%)",
        }}
      >
        {/* Instant Fallback Poster Image: Displays the 3D mango immediately with zero wait */}
        <img
          src={FRAME_PATH(HERO_POSTER_FRAME)}
          alt="Shiv Samarth 3D Alphonso Mango"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Soft vignette gradient for readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 10,
            background:
              "linear-gradient(180deg, rgba(24, 12, 4, 0.72) 0%, transparent 22%, transparent 75%, rgba(24, 12, 4, 0.92) 100%)",
          }}
        />

        {/* High-DPI 3D Mango Canvas */}
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

        {/* ── STAGE 1 OVERLAY ── */}
        <motion.div
          className="hero3d-stage left"
          style={{
            opacity: s1Opacity,
            y: s1Y,
            pointerEvents: "auto",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "5px 13px",
              borderRadius: 999,
              background: "rgba(18, 10, 4, 0.8)",
              border: "1px solid rgba(255, 183, 77, 0.45)",
              color: "#FFB74D",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
              backdropFilter: "blur(8px)",
            }}
          >
            ✦ {t.hero3D.s1Tag}
          </span>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#FFF5E6",
              textShadow: "0 4px 24px rgba(0,0,0,0.85)",
            }}
          >
            {t.hero3D.s1Title}
          </h1>
          <p
            style={{
              color: "rgba(255, 245, 230, 0.92)",
              textShadow: "0 2px 12px rgba(0,0,0,0.85)",
            }}
          >
            {t.hero3D.s1Sub}
          </p>

          <div className="hero3d-btn-row" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              onClick={() => scrollToSection("products-catalog")}
              className="btn gold"
            >
              {t.hero3D.skipBtn} <ArrowRight size={15} />
            </button>
            <button
              onClick={() => scrollToSection("founder-story")}
              className="btn secondary"
              style={{
                color: "#FFF5E6",
                borderColor: "rgba(255, 245, 230, 0.4)",
              }}
            >
              {t.hero3D.storyBtn}
            </button>
          </div>
        </motion.div>

        {/* ── STAGE 2 OVERLAY ── */}
        <motion.div
          className="hero3d-stage right"
          style={{
            opacity: s2Opacity,
            y: s2Y,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "5px 13px",
              borderRadius: 999,
              background: "rgba(18, 10, 4, 0.8)",
              border: "1px solid rgba(255, 183, 77, 0.45)",
              color: "#FFB74D",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
              backdropFilter: "blur(8px)",
            }}
          >
            ✦ {t.hero3D.s2Tag}
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#FFF5E6",
              textShadow: "0 4px 24px rgba(0,0,0,0.85)",
            }}
          >
            {t.hero3D.s2Title}
          </h2>
          <p
            style={{
              color: "rgba(255, 245, 230, 0.92)",
              textShadow: "0 2px 12px rgba(0,0,0,0.85)",
            }}
          >
            {t.hero3D.s2Sub}
          </p>
        </motion.div>

        {/* ── STAGE 3 OVERLAY ── */}
        <motion.div
          className="hero3d-stage left"
          style={{
            opacity: s3Opacity,
            y: s3Y,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "5px 13px",
              borderRadius: 999,
              background: "rgba(18, 10, 4, 0.8)",
              border: "1px solid rgba(255, 183, 77, 0.45)",
              color: "#FFB74D",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
              backdropFilter: "blur(8px)",
            }}
          >
            ✦ {t.hero3D.s3Tag}
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#FFF5E6",
              textShadow: "0 4px 24px rgba(0,0,0,0.85)",
            }}
          >
            {t.hero3D.s3Title}
          </h2>
          <p
            style={{
              color: "rgba(255, 245, 230, 0.92)",
              textShadow: "0 2px 12px rgba(0,0,0,0.85)",
            }}
          >
            {t.hero3D.s3Sub}
          </p>
        </motion.div>

        {/* ── STAGE 4 OVERLAY (With CTA) ── */}
        <motion.div
          className="hero3d-stage right"
          style={{
            opacity: s4Opacity,
            y: s4Y,
            pointerEvents: "auto",
          }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "5px 13px",
              borderRadius: 999,
              background: "rgba(18, 10, 4, 0.8)",
              border: "1px solid rgba(255, 183, 77, 0.45)",
              color: "#FFB74D",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: 10,
              backdropFilter: "blur(8px)",
            }}
          >
            ✦ {t.hero3D.s4Tag}
          </span>
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#FFF5E6",
              textShadow: "0 4px 24px rgba(0,0,0,0.85)",
            }}
          >
            {t.hero3D.s4Title}
          </h2>
          <p
            style={{
              color: "rgba(255, 245, 230, 0.92)",
              textShadow: "0 2px 12px rgba(0,0,0,0.85)",
            }}
          >
            {t.hero3D.s4Sub}
          </p>

          <div className="hero3d-btn-row">
            <button
              onClick={() => scrollToSection("products-catalog")}
              className="btn gold"
            >
              {t.hero3D.shopNow} <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>

        {/* Scroll Down Hint at Bottom */}
        <motion.div
          className="hero3d-hint"
          style={{
            opacity: hintOpacity,
          }}
        >
          <span
            style={{
              color: "rgba(255, 245, 230, 0.85)",
              fontSize: 11.5,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textShadow: "0 2px 8px rgba(0,0,0,0.85)",
            }}
          >
            {t.hero3D.scrollHint}
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown size={20} color="#FFB74D" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
