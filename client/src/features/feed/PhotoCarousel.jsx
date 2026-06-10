// src/features/feed/PhotoCarousel.jsx
import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import usePhotoCarousel from "../../hooks/usePhotoCarousel";

const optimizeUrl = (url) =>
  url?.replace("/upload/", "/upload/w_800,q_auto,f_auto/") || "";

export default function PhotoCarousel({ photos = [], profilePicture = "" }) {
  const fotos =
    photos.length > 0
      ? [...photos].sort((a, b) => a.order - b.order).map((p) => p.url)
      : profilePicture
      ? [profilePicture]
      : ["/placeholder.jpg"];

  const {
    current,
    setCurrent,
    reset,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = usePhotoCarousel(fotos);

  // Autoplay
  const handleNext = useCallback(() => {
    setCurrent((c) => (c + 1) % fotos.length);
  }, [fotos.length, setCurrent]);

  useEffect(() => {
    if (fotos.length <= 1) return;
    const t = setInterval(handleNext, 4000);
    return () => clearInterval(t);
  }, [handleNext, fotos.length]);

  const handlePrev = () =>
    setCurrent((c) => (c - 1 + fotos.length) % fotos.length);

  const handleNextBtn = () =>
    setCurrent((c) => (c + 1) % fotos.length);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        borderRadius: "inherit",
        perspective: "1000px",
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* 3D Carousel track */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {fotos.map((url, index) => {
          const total = fotos.length;
          let pos = ((index - current) % total + total) % total;
          if (pos > Math.floor(total / 2)) pos = pos - total;

          const isCenter = pos === 0;
          const isAdjacent = Math.abs(pos) === 1;
          const isVisible = Math.abs(pos) <= 1;

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                width: "78%",
                height: "92%",
                transform: `
                  translateX(${pos * 65}%)
                  scale(${isCenter ? 1 : isAdjacent ? 0.76 : 0.6})
                  rotateY(${pos * -12}deg)
                `,
                zIndex: isCenter ? 10 : isAdjacent ? 5 : 1,
                opacity: isCenter ? 1 : isAdjacent ? 0.38 : 0,
                filter: isCenter ? "blur(0px)" : "blur(3px)",
                visibility: isVisible ? "visible" : "hidden",
                transition: "all 500ms cubic-bezier(0.4,0,0.2,1)",
                borderRadius: 32,
                overflow: "hidden",
                boxShadow: isCenter
                  ? "0 24px 48px rgba(0,0,0,0.7)"
                  : "0 8px 24px rgba(0,0,0,0.4)",
                cursor: isAdjacent ? "pointer" : "default",
              }}
              onClick={() => {
                if (pos === -1) handlePrev();
                if (pos === 1) handleNextBtn();
              }}
            >
              <img
                src={optimizeUrl(url)}
                alt={`foto ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  userSelect: "none",
                  pointerEvents: "none",
                  borderRadius: 32,
                  border: "1.px solid rgba(255,255,255,0.08)",
                }}
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {/* Dots indicadores — solo visibles cuando hay varias fotos */}
      {fotos.length > 1 && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 4,
            padding: "0 16px",
            zIndex: 20,
          }}
        >
          {fotos.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                flex: 1,
                maxWidth: 36,
                height: 3,
                borderRadius: 2,
                background:
                  i === current ? "#fff" : "rgba(255,255,255,0.3)",
                transition: "background 200ms",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}

      {/* Gradiente inferior — oscurece para que la info sea legible */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "45%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
          zIndex: 11,
          borderRadius: "inherit",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}