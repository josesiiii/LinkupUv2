// src/components/ui/EmptyState.jsx
import { COLORS } from "../../styles/authTheme";

export default function EmptyState({ icon, title, subtitle }) {
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 12, padding: "64px 24px", textAlign: "center",
        background: "rgba(255,255,255,0.45)", backdropFilter: "blur(20px)",
        border: `1px solid ${COLORS.border}`, borderRadius: 32,
      }}
    >
      {icon && (
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.pinkLight, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.pink }}>
          {icon}
        </div>
      )}
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: COLORS.textDark, fontFamily: "'Syne', sans-serif" }}>{title}</h3>
      {subtitle && <p style={{ margin: 0, fontSize: 14, color: COLORS.textMuted, maxWidth: 360 }}>{subtitle}</p>}
    </div>
  );
}
