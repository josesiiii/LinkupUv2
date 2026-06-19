// src/components/ui/PortalDropdown.jsx
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

/**
 * Dropdown controlado que renderiza su panel vía portal en document.body,
 * para evitar el recorte que sufre Dropdown.jsx dentro de contenedores con
 * overflow (ej. la fila de stories con scroll horizontal).
 *
 * - open / onClose: control externo de visibilidad
 * - anchorRef: ref del elemento disparador, usado para calcular la posición
 * - items: array de { label, icon: Component, onClick, danger? }
 * - align: "left" | "right" (anclaje horizontal del panel respecto al trigger)
 */
export default function PortalDropdown({ open, onClose, anchorRef, items = [], align = "left" }) {
  const { colors } = useTheme();
  const panelRef = useRef(null);
  const [coords, setCoords] = useState(null);

  useLayoutEffect(() => {
    if (!open || !anchorRef?.current) return;

    const updatePosition = () => {
      const rect = anchorRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        left: align === "right" ? rect.right : rect.left,
        align,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, anchorRef, align]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        anchorRef?.current && !anchorRef.current.contains(e.target)
      ) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose, anchorRef]);

  if (!open || !coords) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.15 }}
        style={{
          position: "fixed",
          top: coords.top,
          [coords.align === "right" ? "right" : "left"]: coords.align === "right" ? window.innerWidth - coords.left : coords.left,
          zIndex: 1000,
          minWidth: 190,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
          background: colors.surface,
          border: `1px solid ${colors.border}`,
        }}
      >
        {items.map((item, i) => (
          <button
            key={i}
            disabled={item.disabled}
            onClick={() => { item.onClick?.(); onClose?.(); }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: "11px 14px",
              fontSize: 14, textAlign: "left",
              color: item.danger ? "#e0556f" : colors.textDark,
              background: "transparent", border: "none",
              cursor: item.disabled ? "not-allowed" : "pointer",
              opacity: item.disabled ? 0.5 : 1,
            }}
          >
            {item.icon && <item.icon size={16} style={{ flexShrink: 0 }} />}
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
          </button>
        ))}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
