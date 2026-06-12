// src/components/auth/AuthHeader.jsx
import { Link } from "react-router-dom";
import { COLORS } from "../../styles/authTheme";

// Encabezado compartido por Login y Register: "‹ LinkUp" → vuelve a la Home
export default function AuthHeader() {
  return (
    <Link
      to="/"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        textDecoration: "none",
        color: COLORS.textDark,
        fontWeight: 800,
        fontSize: 19,
        letterSpacing: "-0.02em",
        fontFamily: "'Syne', sans-serif",
        transition: "opacity 180ms ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
    >
      <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>‹</span>
      LinkUp
    </Link>
  );
}
