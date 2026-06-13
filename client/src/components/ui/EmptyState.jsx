// src/components/ui/EmptyState.jsx
import { useTheme } from "../../context/ThemeContext";

export default function EmptyState({ icon, title, subtitle }) {
  const { theme, colors } = useTheme();

  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 12, padding: "64px 24px", textAlign: "center",
        ...(theme === "dark"
          ? { background: colors.surface }
          : { background: "rgba(255,255,255,0.45)", backdropFilter: "blur(20px)" }),
        border: `1px solid ${colors.border}`, borderRadius: 24,
        boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
      }}
    >
      {icon && (
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: colors.pinkLight, display: "flex", alignItems: "center", justifyContent: "center", color: colors.pink }}>
          {icon}
        </div>
      )}
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: colors.textDark, fontFamily: "'Inter', sans-serif" }}>{title}</h3>
      {subtitle && <p style={{ margin: 0, fontSize: 14, color: colors.textMuted, maxWidth: 360 }}>{subtitle}</p>}
    </div>
  );
}
