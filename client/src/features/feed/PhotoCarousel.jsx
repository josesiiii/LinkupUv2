// src/features/feed/PhotoCarousel.jsx
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import usePhotoCarousel from "../../hooks/usePhotoCarousel";

const RADIUS = 32;

const optimizeUrl = (url) =>
  url?.replace("/upload/", "/upload/w_800,q_auto,f_auto/") || "";

export default function PhotoCarousel({ photos = [], profilePicture = "", compact = false, aspectRatio = "9 / 16" }) {
  const fotos =
    photos.length > 0
      ? [...photos].sort((a, b) => a.order - b.order).map((p) => p.url)
      : profilePicture
      ? [profilePicture]
      : ["/placeholder.jpg"];

  const {
    current,
    setCurrent,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = usePhotoCarousel(fotos);

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
        aspectRatio,
        overflow: "hidden",
        borderRadius: RADIUS,
        perspective: "1200px",
        touchAction: "pan-y",
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Carrusel inmersivo a sangre completa */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          borderRadius: RADIUS,
        }}
      >
        {fotos.map((url, index) => {
          const total = fotos.length;
          let pos = ((index - current) % total + total) % total;
          if (pos > Math.floor(total / 2)) pos = pos - total;

          const isCenter = pos === 0;
          const isAdjacent = Math.abs(pos) === 1;
          const isVisible = Math.abs(pos) <= 1;
          if (!isVisible) return null;

          return (
            <motion.div
              key={index}
              animate={{
                x: isCenter ? "0%" : pos < 0 ? "-72%" : "72%",
                scale: isCenter ? 1 : 0.85,
                opacity: isCenter ? 1 : 0.55,
                rotateY: isCenter ? 0 : pos * -8,
                filter: isCenter ? "blur(0px)" : "blur(6px)",
              }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                zIndex: isCenter ? 10 : 5,
                borderRadius: RADIUS,
                overflow: "hidden",
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
                }}
                draggable={false}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Dots indicadores — solo visibles cuando hay varias fotos (oculto en modo compacto) */}
      {!compact && fotos.length > 1 && (
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
                background: i === current ? "#FF3D9E" : "rgba(255,255,255,0.3)",
                transition: "background 200ms",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}

      {/* Flechas de navegación — solo visibles cuando hay varias fotos (oculto en modo compacto) */}
      {!compact && fotos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            aria-label="Foto anterior"
            style={{
              position: "absolute",
              top: "50%",
              left: 12,
              transform: "translateY(-50%)",
              zIndex: 21,
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: "rgba(0,0,0,0.35)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleNextBtn(); }}
            aria-label="Foto siguiente"
            style={{
              position: "absolute",
              top: "50%",
              right: 12,
              transform: "translateY(-50%)",
              zIndex: 21,
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "none",
              background: "rgba(0,0,0,0.35)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
            }}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Gradiente inferior — oscurece para que la info sea legible (oculto en modo compacto, no hay info superpuesta) */}
      {!compact && (
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
      )}
    </div>
  );
}
