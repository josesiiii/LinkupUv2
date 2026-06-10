// src/pages/FeedPage.jsx
import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import useAuthStore from "../store/authStore";
import useFeed from "../hooks/useFeed";
import UserCard from "../features/feed/UserCard";

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
        background: "linear-gradient(135deg, #f472b6 0%, #c084fc 50%, #a855f7 100%)",
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
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h2>
  );
}

export default function FeedPage() {
  const navigate = useNavigate();
  const { usuario, logout } = useAuthStore();
  const {
    usuarios, loading, error,
    connectingIds, connectedIds,
    savingIds, savedIds,
    handleConectar, handleGuardar,
  } = useFeed();

  const [activeIndex, setActiveIndex] = useState(0);
  // Clave para re-montar AnimatedName al cambiar de persona
  const [nameKey, setNameKey] = useState(0);

  const handleLogout = () => { logout(); navigate("/login"); };

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
    <div style={{
      width: "100vw",
      height: "100dvh",
      background: "#080808",
      color: "#fff",
      fontFamily: "'Inter', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 24px",
        borderBottom: "1px solid #141414",
        background: "#0a0a0a",
        zIndex: 100,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <path d="M6 4h10c3.3 0 6 2.7 6 6s-2.7 6-6 6h-2l6 8H16l-5.5-8H10v8H6V4z M10 8v4h6a2 2 0 000-4h-6z" fill="white" />
          </svg>
          <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.01em" }}>
            LinkUp <span style={{ color: "#444" }}>– U</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "#141414", border: "1px solid #222",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}>
              {usuario?.profilePicture
                ? <img src={usuario.profilePicture} style={{ width: 30, height: 30, objectFit: "cover" }} alt="avatar" />
                : <User size={14} color="#888" />}
            </div>
            <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500 }}>
              {usuario?.fullName || usuario?.email || "Estudiante"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "transparent", border: "1px solid #222",
              borderRadius: 8, padding: "6px 12px", color: "#888",
              fontSize: 13, cursor: "pointer", transition: "all 150ms",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.color = "#ef4444"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "#888"; }}
          >
            <LogOut size={13} /> Log out
          </button>
        </div>
      </nav>

      {/* ── ESTADOS ── */}
      {loading && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "#555" }}>
          <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 14 }}>Calculando compatibilidad...</span>
        </div>
      )}

      {error && !loading && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid #ef4444", padding: 20, borderRadius: 12, color: "#ef4444", fontSize: 14, maxWidth: 400, textAlign: "center" }}>
            {error}
          </div>
        </div>
      )}

      {!loading && !error && usuarios.length === 0 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "#444" }}>
          <div style={{ fontSize: 48 }}>🔍</div>
          <p style={{ fontSize: 15, margin: 0 }}>No hay usuarios compatibles en tu campus.</p>
          <p style={{ fontSize: 13, color: "#333", margin: 0 }}>Completa tu perfil para mejorar la compatibilidad</p>
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
                      backgroundColor: i === activeIndex ? "#c084fc" : "#222",
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
            overflow: "visible",
            perspective: "1200px",
          }}>

            {activeIndex > 0 && (
              <button
                onClick={goPrev}
                style={{
                  position: "absolute", left: 12, zIndex: 50,
                  width: 44, height: 44, borderRadius: "50%",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 150ms",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
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
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                  color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 150ms",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
              >
                <ChevronRight size={20} />
              </button>
            )}

            <div style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
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
                      x: isCenter ? "0%" : offset < 0 ? "calc(-50vw - 30px)" : "calc(50vw + 30px)",
                      scale: isCenter ? 1 : 0.88,
                      opacity: isCenter ? 1 : 0.45,
                      rotateY: isCenter ? 0 : offset * -8,
                      filter: isCenter ? "blur(0px)" : "blur(2px)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                      position: "absolute",
                      width: "40%",
                      height: "100%",
                      zIndex: isCenter ? 10 : 5,
                      cursor: !isCenter ? "pointer" : "default",
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
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}