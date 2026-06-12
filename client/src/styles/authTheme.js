// src/styles/authTheme.js
// Paleta y estilos compartidos por Login y Register, alineados con la Landing Page.
export const COLORS = {
  pink: "#f1adc2",
  pinkHover: "#e892b0",
  lavender: "#d8b4fe",
  lilac: "#c4b5fd",
  cream: "#fdf2f8",
  blush: "#fde4ec",
  textDark: "#3c2f41",
  textMid: "#5e4e63",
  textMuted: "#786b7d",
  border: "rgba(241,173,194,0.3)",
  pinkShadow: "rgba(241,173,194,0.35)",
  pinkLight: "rgba(241,173,194,0.15)",
  gradient: "linear-gradient(135deg, #f1adc2 0%, #d8b4fe 60%, #c4b5fd 100%)",
};

export const inputBase = {
  width: "100%",
  height: 52,
  background: "rgba(255,255,255,0.6)",
  border: `1.5px solid ${COLORS.border}`,
  borderRadius: 14,
  padding: "0 16px",
  fontSize: 14,
  color: COLORS.textDark,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'DM Sans', 'Inter', sans-serif",
  transition: "border-color 250ms, box-shadow 250ms",
};

export const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: COLORS.textDark,
  marginBottom: 7,
};

export const focusIn = (e) => {
  e.currentTarget.style.borderColor = COLORS.pink;
  e.currentTarget.style.boxShadow = `0 0 0 4px ${COLORS.pinkLight}`;
};

export const focusOut = (e) => {
  e.currentTarget.style.borderColor = COLORS.border;
  e.currentTarget.style.boxShadow = "none";
};
