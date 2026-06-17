// src/pages/FeedPage.jsx
import { useState, useCallback } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "../components/layout/AppLayout";
import useAuthStore from "../store/authStore";
import useFeed from "../hooks/useFeed";
import UserCard from "../features/feed/UserCard";
import StoriesRow from "../features/feed/StoriesRow";
import FeedFilterBar from "../features/feed/FeedFilterBar";
import { useTheme } from "../context/ThemeContext";

const FILTERS_KEY = "feedFiltersV2";

function loadMyUniversity() {
  try {
    const raw = localStorage.getItem(FILTERS_KEY);
    return raw ? JSON.parse(raw) : false;
  } catch {
    return false;
  }
}

export default function FeedPage() {
  const { colors } = useTheme();
  const usuario = useAuthStore((state) => state.usuario);
  const [myUniversity, setMyUniversity] = useState(loadMyUniversity);

  const {
    usuarios, loading, error,
    connectingIds, connectedIds,
    savingIds, savedIds,
    handleConectar, handleGuardar, handleDesguardar,
  } = useFeed({ myUniversity });

  const [activeIndex, setActiveIndex] = useState(0);

  const handleFilterChange = (val) => {
    setMyUniversity(val);
    localStorage.setItem(FILTERS_KEY, JSON.stringify(val));
    setActiveIndex(0);
  };

  const goPrev = useCallback(() => {
    setActiveIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((i) => Math.min(usuarios.length - 1, i + 1));
  }, [usuarios.length]);

  const handleDotClick = (i) => {
    if (i !== activeIndex) setActiveIndex(i);
  };

  return (
    <AppLayout>
      <div className="feed-fullscreen" style={{
        color: colors.textDark,
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}>

        {loading && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: colors.textMuted }}>
            <Loader2 size={20} style={{ animation: "spin 1s linear infinite", color: colors.pink }} />
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
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: colors.textMuted }}>
            <div style={{ fontSize: 48 }}>🔍</div>
            <p style={{ fontSize: 15, margin: 0, color: colors.textDark }}>No hay usuarios compatibles en tu campus.</p>
            <p style={{ fontSize: 13, color: colors.textMuted, margin: 0 }}>Completa tu perfil para mejorar la compatibilidad</p>
          </div>
        )}

        {!loading && !error && (
          <FeedFilterBar
            myUniversity={myUniversity}
            onChange={handleFilterChange}
          />
        )}

        {!loading && !error && usuarios.length > 0 && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>

            <StoriesRow yo={usuario} />

            {usuarios.length > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: 5, padding: "6px 0 2px", flexShrink: 0, zIndex: 10 }}>
                {usuarios.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => handleDotClick(i)}
                    style={{
                      width: i === activeIndex ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: i === activeIndex ? colors.pink : colors.border,
                      transition: "all 300ms",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            )}

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
                    border: "1px solid #DADADA",
                    backdropFilter: "blur(10px)",
                    color: "#000000",
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
                    border: "1px solid #DADADA",
                    backdropFilter: "blur(10px)",
                    color: "#000000",
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
                      width: "min(520px, 92vw)",
                      height: "100%",
                      top: 0,
                      zIndex: isCenter ? 10 : 5,
                      cursor: !isCenter ? "pointer" : "default",
                      borderRadius: 32,
                      overflow: "visible",
                      boxShadow: "0 24px 48px rgba(0,0,0,0.18)",
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
                        onDesguardar={handleDesguardar}
                        fullscreen
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ── Navegación entre perfiles ── */}
            {usuarios.length > 1 && (
              <div style={{
                flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", maxWidth: 520, margin: "0 auto",
                padding: "10px 16px 16px",
              }}>
                <button
                  onClick={goPrev}
                  disabled={activeIndex === 0}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 20px", borderRadius: 999,
                    background: colors.pinkLight, color: colors.textDark,
                    border: "none", fontSize: 13, fontWeight: 600,
                    cursor: activeIndex === 0 ? "default" : "pointer",
                    opacity: activeIndex === 0 ? 0.4 : 1,
                    transition: "all 150ms",
                  }}
                >
                  <ChevronLeft size={16} />
                  Anterior
                </button>

                <span style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted }}>
                  {activeIndex + 1} / {usuarios.length}
                </span>

                <button
                  onClick={goNext}
                  disabled={activeIndex === usuarios.length - 1}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "10px 20px", borderRadius: 999,
                    background: colors.pinkLight, color: colors.textDark,
                    border: "none", fontSize: 13, fontWeight: 600,
                    cursor: activeIndex === usuarios.length - 1 ? "default" : "pointer",
                    opacity: activeIndex === usuarios.length - 1 ? 0.4 : 1,
                    transition: "all 150ms",
                  }}
                >
                  Siguiente
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}

        <style>{`
          @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
          .feed-fullscreen { height: 100dvh; }
          @media (max-width: 767px) {
            .feed-fullscreen { height: calc(100dvh - 64px); }
          }
        `}</style>
      </div>
    </AppLayout>
  );
}
