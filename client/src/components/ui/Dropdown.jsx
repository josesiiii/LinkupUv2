// src/components/ui/Dropdown.jsx
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

/**
 * Generic dropdown/menu.
 * - trigger: render-prop receiving { open, toggle } to render the trigger element
 * - items: array of { label, icon: Component, onClick, danger?, disabled?, render? }
 *          if `render` is provided it's used instead of the default item layout
 * - align: "left" | "right" (panel horizontal anchor)
 * - panelClassName / panelStyle: extra styling for the panel
 */
export default function Dropdown({ trigger, items = [], align = "left", panelStyle = {}, panelClassName = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { colors } = useTheme();

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {trigger({ open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) })}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-2 rounded-xl overflow-hidden shadow-xl ${panelClassName}`}
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              minWidth: 180,
              [align === "right" ? "right" : "left"]: 0,
              ...panelStyle,
            }}
          >
            {items.map((item, i) =>
              item.render ? (
                <div key={i}>{item.render({ close: () => setOpen(false) })}</div>
              ) : (
                <button
                  key={i}
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm w-full text-left"
                  style={{
                    color: item.danger ? "#e0556f" : colors.textDark,
                    background: "transparent",
                    border: "none",
                    cursor: item.disabled ? "not-allowed" : "pointer",
                    opacity: item.disabled ? 0.5 : 1,
                  }}
                >
                  {item.icon && <item.icon className="h-4 w-4 flex-shrink-0" />}
                  <span className="truncate">{item.label}</span>
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
