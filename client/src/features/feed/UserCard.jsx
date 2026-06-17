// src/features/feed/UserCard.jsx
import { UserPlus, Heart, Check, Loader2 } from "lucide-react";
import PhotoCarousel from "./PhotoCarousel";
import { LIGHT_COLORS as COLORS } from "../../styles/authTheme";

const RADIUS = 32;

export default function UserCard({
  item, yo,
  connectingIds, connectedIds,
  savingIds, savedIds,
  onConectar, onGuardar, onDesguardar,
  fullscreen = false,
}) {
  const perfil = item.usuario || item;
  const id     = perfil._id;
  const score  = item.compatibilidad || 100;

  const interesesComunes = yo?.interests?.filter((i) =>
    perfil.interests?.includes(i)
  ) || [];

  const scoreColor =
    score >= 90 ? "#10B981" :
    score >= 70 ? "#FF6FB5" :
    score >= 50 ? "#F59E0B" : "#6B7280";

  return (
<div
  style={{
    position: "relative",
    background: "#000",
    border: "none",
    borderRadius: RADIUS,
    overflow: "visible",
        width: "100%",
        height: "100%",
        // En modo grid (no fullscreen) mantiene proporción 9/16
        ...(fullscreen ? {} : { aspectRatio: "9 / 16", maxHeight: 520 }),
        transition: "border-color 200ms",
      }}
    >
      {/* ── CARRUSEL: ocupa toda la tarjeta ── */}
      <div
        style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            borderRadius: "inherit",
            overflow: "visible",
        }}
>
        <PhotoCarousel
          photos={perfil.photos}
          profilePicture={perfil.profilePicture}
        />
      </div>

      {/* ── BADGE COMPATIBILIDAD ── */}
      <div style={{
        position: "absolute", top: 32, right: 32, zIndex: 20,
        background: `${scoreColor}22`,
        border: `1px solid ${scoreColor}55`,
        backdropFilter: "blur(8px)",
        color: scoreColor,
        padding: "4px 11px", borderRadius: 20,
        fontSize: 12, fontWeight: 700,
        letterSpacing: "0.02em",
      }}>
        {score}%
      </div>
      
      {/* ── NOMBRE ── */}
<div
  style={{
    position: "absolute",
    top: 28,
    left: 32,
    zIndex: 30,
    maxWidth: "70%",
  }}
>
  <h1
    style={{
      margin: 0,
      color: "#fff",
      fontSize: fullscreen ? "clamp(42px,6vw,72px)" : 32,
      fontWeight: 800,
      letterSpacing: "-0.05em",
      lineHeight: 0.9,
      textTransform: "uppercase",
      textShadow: "0 4px 20px rgba(0,0,0,0.45)",
    }}
  >
    {perfil.fullName || perfil.name || "Usuario"}
  </h1>
</div>

      {/* ── INFO OVERLAY ── */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        zIndex: 20,
        padding: fullscreen ? "24px 22px 22px" : "20px 18px 18px",
        paddingTop: fullscreen ? 96 : 72,
        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0) 100%)",
        pointerEvents: "none",
      }}>

        {/* Carrera + semestre (nombre ya está en header del feed) */}
        <p style={{
          fontSize: fullscreen ? 14 : 13,
          color: "rgba(255,255,255,0.75)",
          margin: "0 0 8px",
          lineHeight: 1.4,
          textShadow: "0 1px 4px rgba(0,0,0,0.5)",
        }}>
          {perfil.career || "Carrera no especificada"}
          {perfil.semester ? ` · ${perfil.semester}°` : ""}
          {perfil.institution
            ? <><br /><span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{perfil.institution}</span></>
            : null}
        </p>

        {/* Bio */}
        {perfil.bio && fullscreen && (
          <p style={{
            fontSize: 13, color: "rgba(255,255,255,0.6)",
            margin: "0 0 10px", lineHeight: 1.5,
            fontStyle: "italic",
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
          }}>
            "{perfil.bio}"
          </p>
        )}

        {/* Intereses comunes */}
        {interesesComunes.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
            {interesesComunes.slice(0, fullscreen ? 4 : 3).map((int, i) => (
              <span key={i} style={{
                background: "rgba(255,61,158,0.18)",
                border: "1px solid rgba(255,61,158,0.4)",
                backdropFilter: "blur(6px)",
                color: "#fff",
                padding: "2px 8px", borderRadius: 6,
                fontSize: 11, fontWeight: 500,
              }}>
                ✓ {int}
              </span>
            ))}
          </div>
        )}

        {/* Intereses generales */}
        {perfil.interests?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 14 }}>
            {perfil.interests.slice(0, fullscreen ? 5 : 4).map((int, i) => (
              <span key={i} style={{
                background: "rgba(255,255,255,0.09)",
                border: "1px solid rgba(255,255,255,0.13)",
                backdropFilter: "blur(6px)",
                color: "rgba(255,255,255,0.75)",
                padding: "2px 8px", borderRadius: 6,
                fontSize: 11,
              }}>
                {int}
              </span>
            ))}
            {perfil.interests.length > (fullscreen ? 5 : 4) && (
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", padding: "2px 4px" }}>
                +{perfil.interests.length - (fullscreen ? 5 : 4)}
              </span>
            )}
          </div>
        )}

        {/* ── BOTONES ── */}
        <div style={{
          display: "flex", gap: 10,
          pointerEvents: "all",
        }}>
          {/* Conectar */}
          <button
            disabled={connectingIds.includes(id) || connectedIds.includes(id)}
            onClick={() => onConectar(id)}
            className={connectedIds.includes(id) ? "" : "hover:scale-105 active:scale-95"}
            style={{
              flex: 1,
              height: fullscreen ? 48 : 42,
              borderRadius: 999,
              background: connectedIds.includes(id)
                ? "rgba(255,255,255,0.06)"
                : COLORS.gradient,
              border: connectedIds.includes(id)
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid transparent",
              backdropFilter: "blur(12px)",
              color: connectedIds.includes(id) ? "rgba(255,255,255,0.35)" : "#fff",
              fontSize: fullscreen ? 14 : 13,
              fontWeight: 600,
              cursor: connectedIds.includes(id) ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              transition: "all 150ms",
            }}
          >
            {connectingIds.includes(id)
              ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
              : connectedIds.includes(id)
              ? <><Check size={14} color="#10B981" /> Enviada</>
              : <><UserPlus size={15} /> Conectar</>}
          </button>

          {/* Guardar / Quitar guardado */}
          <button
            disabled={savingIds.includes(id)}
            onClick={() => savedIds.includes(id) ? onDesguardar?.(id) : onGuardar(id)}
            className="hover:scale-105 active:scale-95"
            style={{
              height: fullscreen ? 48 : 42,
              padding: "0 18px",
              borderRadius: 999,
              background: savedIds.includes(id)
                ? "rgba(255,61,158,0.18)"
                : "rgba(255,255,255,0.09)",
              border: savedIds.includes(id)
                ? "1px solid #FF3D9E"
                : "1px solid rgba(255,255,255,0.13)",
              backdropFilter: "blur(12px)",
              color: savedIds.includes(id) ? "#FF3D9E" : "rgba(255,255,255,0.85)",
              fontSize: fullscreen ? 14 : 13,
              fontWeight: 600,
              cursor: savingIds.includes(id) ? "wait" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              transition: "all 150ms",
              flexShrink: 0,
            }}
          >
            {savingIds.includes(id)
              ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
              : (
                <>
                  <Heart
                    size={16}
                    fill={savedIds.includes(id) ? COLORS.pink : "none"}
                    style={{ transform: savedIds.includes(id) ? "scale(1.25)" : "scale(1)", transition: "transform 200ms" }}
                  />
                  {savedIds.includes(id) ? "Guardado" : "Guardar"}
                </>
              )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}