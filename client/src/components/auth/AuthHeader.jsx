// src/components/auth/AuthHeader.jsx
import { Link } from "react-router-dom";
import Logo from "../ui/Logo";
import { LIGHT_COLORS as COLORS } from "../../styles/authTheme";

export default function AuthHeader() {
  return (
    <Link
      to="/"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        textDecoration: "none",
        transition: "opacity 180ms ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      title="Volver al inicio"
    >
      <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.textMuted, lineHeight: 1 }}>‹</span>
      <Logo size={28} showText={false} />
    </Link>
  );
}
