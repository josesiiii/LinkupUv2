// src/components/ui/Logo.jsx
// Componente de marca reutilizable: logo + wordmark "LinkUp"
export default function Logo({ size = 32, showText = true, textColor = "#000000", textSize = "1.05rem" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <img
        src="/Logo.webp"
        alt="LinkUp"
        style={{ width: size, height: size, objectFit: "contain", borderRadius: size * 0.28, flexShrink: 0 }}
      />
      {showText && (
        <span
          style={{
            fontSize: textSize,
            fontWeight: 700,
            color: textColor,
            letterSpacing: "-0.02em",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          LinkUp
        </span>
      )}
    </div>
  );
}
