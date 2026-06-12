// src/pages/FeedPage.jsx
import { useState, useCallback, useEffect, useRef } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import AppLayout from "../components/layout/AppLayout";
import useAuthStore from "../store/authStore";
import useFeed from "../hooks/useFeed";
import UserCard from "../features/feed/UserCard";
import { COLORS } from "../styles/authTheme";

// ── Nombre animado estilo HORIZON ──
function AnimatedName({ name }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !name) return;
    const chars = containerRef.current.querySelectorAll(".name-char");

    gsap.killTweensOf(chars);
    gsap.set(chars, { y: 80, opacity: 0, skewX: 15 });

    gsap.to(chars, {
      y: 0,
      opacity: 1,
      skewX: 0,
      duration: 0.8,
      stagger: 0.04,
      ease: "power4.out",
    });
  }, [name]);

  if (!name) return null;

  return (
    <h2
      ref={containerRef}
      style={{
        fontSize: "clamp(26px, 4vw, 38px)",
        fontWeight: 800,
        margin: 0,
        letterSpacing: "-0.01em",
        lineHeight: 1.2,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "0 1px",
        fontFamily: "'Syne', sans-serif",
        background: COLORS.gradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        padding: "4px 16px 8px",
      }}
    >
      {name.split("").map((char, i) => (
        <span
          key={i}
          className="name-char"
          style={{
            display: "inline-block",
            marginRight: char === " " ? "0.3em" : 0,
            willChange: "transform, opacity",
          }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </h2>
  );
}

export default function FeedPage() {
  const usuario = useAuthStore((state) => state.usuario);
  const {
    usuarios, loading, error,
    connectingIds, connectedIds,
    savingIds, savedIds,
    handleConectar, handleGuardar,
  } = useFeed();

  const [activeIndex, setActiveIndex] = useState(0);
  // Clave para re-montar AnimatedName al cambiar de persona
  const [nameKey, setNameKey] = useState(0);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => {
      const next = Math.max(0, i - 1);
      if (next !== i) setNameKey((k) => k + 1);
      return next;
    });
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((i) => {
      const next = Math.min(usuarios.length - 1, i + 1);
      if (next !== i) setNameKey((k) => k + 1);
      return next;
    });
  }, [usuarios.length]);

  const handleDotClick = (i) => {
    if (i !== activeIndex) {
      setActiveIndex(i);
      setNameKey((k) => k + 1);
    }
  };

  const perfilActivo = usuarios[activeIndex]
    ? (usuarios[activeIndex].usuario || usuarios[activeIndex])
    : null;

  return (
    <AppLayout>
      <div style={{
        height: "calc(100dvh - 96px)",
        color: COLORS.textDark,
        fontFamily: "'DM Sans', 'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}>

        {/* ── ESTADOS ── */}
        {loading && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: COLORS.textMuted }}>
            <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: COLORS.pink }} />
            <span style={{ fontSize: 14 }}>Calculando compatibilidad...</span>
          </div>
        )}

        {error && !loading && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
            <div style={{ background: "#fff0f5", border: "1px solid #ffc0d8", padding: 20, borderRadius: 16, color: "#cc0040", fontSize: 14, maxWidth: 400, textAlign: "center" }}>
              {error}
            </div>
          </div>
        )}

        {!loading && !error && usuarios.length === 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: COLORS.textMuted }}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <p style={{ fontSize: 15, margin: 0, color: COLORS.textDark }}>No hay usuarios compatibles en tu campus.</p>
            <p style={{ fontSize: 13, color: COLORS.textMuted, margin: 0 }}>Completa tu perfil para mejorar la compatibilidad</p>
          </div>
        )}

        {/* ── FEED FULLSCREEN ── */}
        {!loading && !error && usuarios.length > 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>

            {/* Nombre animado — sin overflow hidden para que GSAP no corte los chars */}
            <div style={{
              padding: "14px 0 4px",
              textAlign: "center",
              flexShrink: 0,
              zIndex: 10,
            }}>
              {/* nameKey fuerza re-render → re-dispara el useEffect de GSAP */}
              <AnimatedName
                key={nameKey}
                name={perfilActivo?.fullName}
              />

              {/* Dots */}
              {usuarios.length > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 5, marginTop: 8 }}>
                  {usuarios.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => handleDotClick(i)}
                      style={{
                        width: i === activeIndex ? 20 : 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: i === activeIndex ? COLORS.pink : COLORS.border,
                        transition: "all 300ms",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* ── CARRUSEL HORIZONTAL ── */}
            <div style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              perspective: "1200px",
            }}>

              {activeIndex > 0 && (
                <button
                  onClick={goPrev}
                  style={{
                    position: "absolute", left: 12, zIndex: 50,
                    width: 44, height: 44, borderRadius: "50%",
                    background: "rgba(255,255,255,0.65)",
                    border: `1px solid ${COLORS.border}`,
                    backdropFilter: "blur(10px)",
                    color: COLORS.textDark,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 150ms",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.9)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.65)"}
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              {activeIndex < usuarios.length - 1 && (
                <button
                  onClick={goNext}
                  style={{
                    position: "absolute", right: 12, zIndex: 50,
                    width: 44, height: 44, borderRadius: "50%",
                    background: "rgba(255,255,255,0.65)",
                    border: `1px solid ${COLORS.border}`,
                    backdropFilter: "blur(10px)",
                    color: COLORS.textDark,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "all 150ms",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.9)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.65)"}
                >
                  <ChevronRight size={20} />
                </button>
              )}

              <div style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
              }}>
              {usuarios.map((item, index) => {
                if (!item) return null;
                const perfil = item.usuario || item;
                const offset = index - activeIndex;
                if (Math.abs(offset) > 1) return null;
                const isCenter = offset === 0;

                return (
                  <motion.div
                    key={perfil._id}
                    animate={{
                      x: isCenter ? "-50%" : offset < 0 ? "calc(-50% - 75vw)" : "calc(-50% + 75vw)",
                      scale: isCenter ? 1 : 0.85,
                      opacity: isCenter ? 1 : 0.6,
                      rotateY: isCenter ? 0 : offset * -6,
                      filter: isCenter ? "blur(0px)" : "blur(3px)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                      position: "absolute",
                      left: "50%",
                      width: "min(460px, 85vw)",
                      height: "100%",
                      top: 0,
                      zIndex: isCenter ? 10 : 5,
                      cursor: !isCenter ? "pointer" : "default",
                      borderRadius: 32,
                      overflow: "hidden",
                      boxShadow: "0 24px 48px rgba(60,47,65,0.18)",
                    }}
                    onClick={() => !isCenter && handleDotClick(index)}
                  >
                      <UserCard
                        item={item}
                        yo={usuario}
                        connectingIds={connectingIds}
                        connectedIds={connectedIds}
                        savingIds={savingIds}
                        savedIds={savedIds}
                        onConectar={handleConectar}
                        onGuardar={handleGuardar}
                        fullscreen
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div style={{ flexShrink: 0, height: 16 }} />
          </div>
        )}

        <style>{`
          @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        `}</style>
      </div>
    </AppLayout>
  );
}
