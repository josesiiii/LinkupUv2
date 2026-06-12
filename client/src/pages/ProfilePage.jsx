// src/pages/ProfilePage.jsx
import AppLayout from "../components/layout/AppLayout";
import useAuthStore from "../store/authStore";
import { COLORS } from "../styles/authTheme";

const Chip = ({ children, tone = "pink" }) => (
  <span
    style={{
      display: "inline-block", padding: "6px 14px", borderRadius: 100,
      fontSize: 13, fontWeight: 500,
      background: tone === "pink" ? COLORS.pinkLight : "rgba(196,181,253,0.18)",
      color: COLORS.textDark,
    }}
  >
    {children}
  </span>
);

const InfoCard = ({ label, value }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.5)", border: `1px solid ${COLORS.border}`,
      borderRadius: 20, padding: "16px 20px",
    }}
  >
    <p style={{ margin: "0 0 4px 0", fontSize: 12, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: COLORS.textDark }}>{value || "—"}</p>
  </div>
);

export default function ProfilePage() {
  const usuario = useAuthStore((state) => state.usuario);

  return (
    <AppLayout>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 64px" }}>

        {/* Header */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
            background: "rgba(255,255,255,0.45)", backdropFilter: "blur(20px)",
            border: `1px solid ${COLORS.border}`, borderRadius: 32, padding: 32, marginBottom: 24,
          }}
        >
          {usuario?.profilePicture ? (
            <img
              src={usuario.profilePicture}
              alt={usuario?.fullName}
              style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: `2px solid ${COLORS.border}`, flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 96, height: 96, borderRadius: "50%", background: COLORS.gradient,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: COLORS.textDark, fontWeight: 800, fontSize: 36, flexShrink: 0,
              }}
            >
              {usuario?.fullName?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}

          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: "0 0 4px 0", fontSize: 28, fontWeight: 800, color: COLORS.textDark, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}>
              {usuario?.fullName || "Usuario"}
            </h1>
            <p style={{ margin: "0 0 10px 0", fontSize: 14, color: COLORS.textMid }}>{usuario?.email}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {usuario?.institution && <Chip>{usuario.institution}</Chip>}
              {usuario?.currentCampus && <Chip tone="lilac">{usuario.currentCampus}</Chip>}
            </div>
          </div>
        </div>

        {/* Bio */}
        {usuario?.bio && (
          <div
            style={{
              background: "rgba(255,255,255,0.45)", backdropFilter: "blur(20px)",
              border: `1px solid ${COLORS.border}`, borderRadius: 24, padding: 24, marginBottom: 24,
            }}
          >
            <p style={{ margin: "0 0 8px 0", fontSize: 12, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Sobre mí</p>
            <p style={{ margin: 0, fontSize: 15, color: COLORS.textDark, lineHeight: 1.6 }}>{usuario.bio}</p>
          </div>
        )}

        {/* Datos académicos */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
          <InfoCard label="Carrera" value={usuario?.career} />
          <InfoCard label="Facultad" value={usuario?.faculty} />
          <InfoCard label="Semestre" value={usuario?.semester} />
          <InfoCard label="Ciudad" value={usuario?.city} />
        </div>

        {/* Intereses */}
        {usuario?.interests?.length > 0 && (
          <div
            style={{
              background: "rgba(255,255,255,0.45)", backdropFilter: "blur(20px)",
              border: `1px solid ${COLORS.border}`, borderRadius: 24, padding: 24, marginBottom: 24,
            }}
          >
            <p style={{ margin: "0 0 12px 0", fontSize: 12, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Intereses</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {usuario.interests.map((interest) => <Chip key={interest}>{interest}</Chip>)}
            </div>
          </div>
        )}

        {/* Objetivos */}
        {usuario?.objectives?.length > 0 && (
          <div
            style={{
              background: "rgba(255,255,255,0.45)", backdropFilter: "blur(20px)",
              border: `1px solid ${COLORS.border}`, borderRadius: 24, padding: 24,
            }}
          >
            <p style={{ margin: "0 0 12px 0", fontSize: 12, fontWeight: 600, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Objetivos</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {usuario.objectives.map((objective) => <Chip key={objective} tone="lilac">{objective}</Chip>)}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
