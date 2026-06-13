// src/styles/authTheme.js
// Paletas claro/oscuro del nuevo sistema de diseño LinkUp: negro/blanco + acento #FF3D9E.

export const LIGHT_COLORS = {
  pink: "#FF3D9E",
  pinkHover: "#E0317F",
  lavender: "#FF6FB5",
  lilac: "#EEEEEE",
  cream: "#FFFFFF",
  blush: "#EEEEEE",
  textDark: "#000000",
  textMid: "#444444",
  textMuted: "#777777",
  border: "#DADADA",
  pinkShadow: "rgba(255,61,158,0.25)",
  pinkLight: "rgba(255,61,158,0.08)",
  gradient: "linear-gradient(135deg, #FF3D9E 0%, #FF6FB5 100%)",
  surface: "#FFFFFF",
  surfaceAlt: "#EEEEEE",
  bg: "#FFFFFF",
};

export const DARK_COLORS = {
  pink: "#FF3D9E",
  pinkHover: "#FF5CAD",
  lavender: "#FF6FB5",
  lilac: "#292929",
  cream: "#000000",
  blush: "#292929",
  textDark: "#FFFFFF",
  textMid: "#CCCCCC",
  textMuted: "#999999",
  border: "#444444",
  pinkShadow: "rgba(255,61,158,0.35)",
  pinkLight: "rgba(255,61,158,0.14)",
  gradient: "linear-gradient(135deg, #FF3D9E 0%, #FF6FB5 100%)",
  surface: "#292929",
  surfaceAlt: "#000000",
  bg: "#000000",
};

// Export estático de compatibilidad (modo claro)
export const COLORS = LIGHT_COLORS;

export const getInputBase = (colors) => ({
  width: "100%",
  height: 48,
  background: colors.surface,
  border: `1.5px solid ${colors.border}`,
  borderRadius: 12,
  padding: "0 16px",
  fontSize: 14,
  color: colors.textDark,
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Inter', sans-serif",
  transition: "border-color 200ms, box-shadow 200ms, background 200ms",
});

export const getLabelStyle = (colors) => ({
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: colors.textDark,
  marginBottom: 7,
  fontFamily: "'Inter', sans-serif",
});

export const getFocusIn = (colors) => (e) => {
  e.currentTarget.style.borderColor = colors.pink;
  e.currentTarget.style.boxShadow = `0 0 0 4px ${colors.pinkLight}`;
};

export const getFocusOut = (colors) => (e) => {
  e.currentTarget.style.borderColor = colors.border;
  e.currentTarget.style.boxShadow = "none";
};

// Exports estáticos de compatibilidad (modo claro)
export const inputBase = getInputBase(LIGHT_COLORS);
export const labelStyle = getLabelStyle(LIGHT_COLORS);
export const focusIn = getFocusIn(LIGHT_COLORS);
export const focusOut = getFocusOut(LIGHT_COLORS);
