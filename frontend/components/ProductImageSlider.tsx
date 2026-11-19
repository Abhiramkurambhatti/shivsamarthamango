"use client";

import { useState, useRef, TouchEvent } from "react";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

interface ProductImageSliderProps {
  images?: string[];
  fallbackImage: string;
  alt: string;
  aspectRatio?: string;
  showCounter?: boolean;
}

export default function ProductImageSlider({
  images = [],
  fallbackImage,
  alt,
  aspectRatio = "4 / 3",
  showCounter = true,
}: ProductImageSliderProps) {
  // Ensure we have a valid, non-empty list of photos
  const rawList = Array.isArray(images) && images.length > 0 ? images : [fallbackImage];
  const photoList = rawList.filter((img) => typeof img === "string" && img.trim().length > 0);
  const slideList = photoList.length > 0 ? photoList : [fallbackImage || "/images/devgad-hapus.jpg"];

  const [currentIdx, setCurrentIdx] = useState(0);

  // Touch Swipe tracking
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIdx((prev) => (prev === 0 ? slideList.length - 1 : prev - 1));
  };

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIdx((prev) => (prev === slideList.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIdx(idx);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40; // 40px swipe threshold

    if (distance > minSwipeDistance) {
      // Swiped left -> next photo
      setCurrentIdx((prev) => (prev === slideList.length - 1 ? 0 : prev + 1));
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev photo
      setCurrentIdx((prev) => (prev === 0 ? slideList.length - 1 : prev - 1));
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const hasMultiple = slideList.length > 1;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: aspectRatio,
        overflow: "hidden",
        background: "#f4ede2",
        userSelect: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="product-slider-container"
    >
      {/* Slide Images Container */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          transform: `translateX(-${currentIdx * 100}%)`,
          transition: "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        {slideList.map((src, idx) => (
          <div
            key={idx}
            style={{
              minWidth: "100%",
              width: "100%",
              height: "100%",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <img
              src={src}
              alt={`${alt} - Photo ${idx + 1}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
                filter: "contrast(1.03) saturate(1.06) brightness(1.01)",
              }}
              loading={idx === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Subtle Bottom Shadow Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(15, 28, 21, 0.5) 0%, rgba(15, 28, 21, 0) 40%)",
          pointerEvents: "none",
        }}
      />

      {/* Navigation Arrows (visible when multiple photos exist) */}
      {hasMultiple && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={prevSlide}
            style={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              background: "rgba(23, 43, 32, 0.72)",
              backdropFilter: "blur(6px)",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              zIndex: 5,
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              padding: 0,
            }}
            className="slider-arrow"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            aria-label="Next image"
            onClick={nextSlide}
            style={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              background: "rgba(23, 43, 32, 0.72)",
              backdropFilter: "blur(6px)",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              zIndex: 5,
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
              padding: 0,
            }}
            className="slider-arrow"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {hasMultiple && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 5,
            zIndex: 6,
            background: "rgba(0, 0, 0, 0.35)",
            backdropFilter: "blur(4px)",
            padding: "3px 8px",
            borderRadius: 99,
          }}
        >
          {slideList.map((_, dotIdx) => {
            const isActive = currentIdx === dotIdx;
            return (
              <button
                key={dotIdx}
                type="button"
                aria-label={`Go to slide ${dotIdx + 1}`}
                onClick={(e) => goToSlide(dotIdx, e)}
                style={{
                  width: isActive ? 16 : 6,
                  height: 6,
                  borderRadius: 99,
                  border: "none",
                  background: isActive ? "#ffd27d" : "rgba(255, 255, 255, 0.6)",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.25s ease",
                }}
              />
            );
          })}
        </div>
      )}

      {/* Multi-Photo Counter Badge */}
      {hasMultiple && showCounter && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(23, 43, 32, 0.85)",
            color: "#ecd599",
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 7px",
            borderRadius: 6,
            backdropFilter: "blur(6px)",
            border: "1px solid rgba(200, 154, 75, 0.4)",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            zIndex: 4,
          }}
        >
          <Camera size={11} />
          <span>
            {currentIdx + 1}/{slideList.length}
          </span>
        </div>
      )}
    </div>
  );
}
