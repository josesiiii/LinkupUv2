// src/components/ui/AcademicSelect.jsx
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function AcademicSelect({
  options = [],
  value = "",
  onChange,
  placeholder = "Selecciona una opción",
  disabled = false,
}) {
  const { colors: C } = useTheme();
  const [open, setOpen]     = useState(false);
  const [query, setQuery]   = useState("");
  const containerRef        = useRef(null);
  const searchRef           = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 60);
  }, [open]);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  const select = (opt) => {
    onChange(opt);
    setOpen(false);
    setQuery("");
  };

  const showSearch = options.length > 6;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>

      {/* ── Trigger ─────────────────────────────────────────────── */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        style={{
          width: "100%",
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          background: C.surface,
          border: `1.5px solid ${open ? C.pink : C.border}`,
          borderRadius: 12,
          padding: "0 14px 0 16px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          boxShadow: open ? `0 0 0 4px ${C.pinkLight}` : "none",
          transition: "border-color 200ms, box-shadow 200ms",
          fontFamily: "'Inter', sans-serif",
          boxSizing: "border-box",
          userSelect: "none",
        }}
      >
        <span style={{
          flex: 1,
          fontSize: 14,
          color: value ? C.textDark : C.textMuted,
          textAlign: "left",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {value || placeholder}
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", flexShrink: 0, color: open ? C.pink : C.textMuted }}
        >
          <ChevronDown size={15} />
        </motion.span>
      </button>

      {/* ── Dropdown ────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.17, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              background: C.surface,
              border: `1.5px solid ${C.border}`,
              borderRadius: 14,
              boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
              zIndex: 9999,
              overflow: "hidden",
            }}
          >
            {/* Barra de búsqueda */}
            {showSearch && (
              <div style={{
                padding: "8px 8px 6px",
                borderBottom: `1px solid ${C.border}`,
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: C.surfaceAlt,
                  borderRadius: 9, padding: "6px 11px",
                }}>
                  <Search size={13} color={C.textMuted} strokeWidth={2.2} />
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Buscar..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                      flex: 1, border: "none", background: "transparent",
                      outline: "none", fontSize: 13, color: C.textDark,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Lista de opciones */}
            <div style={{ maxHeight: 224, overflowY: "auto", padding: "4px" }}>
              {filtered.length === 0 ? (
                <div style={{
                  padding: "14px", textAlign: "center",
                  fontSize: 13, color: C.textMuted,
                }}>
                  Sin resultados
                </div>
              ) : (
                filtered.map((opt) => {
                  const sel = value === opt;
                  return (
                    <motion.button
                      key={opt}
                      type="button"
                      onClick={() => select(opt)}
                      whileHover={{ background: C.pinkLight }}
                      style={{
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        padding: "8px 11px",
                        borderRadius: 9,
                        border: "none",
                        background: sel ? C.pinkLight : "transparent",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13.5,
                        fontWeight: sel ? 600 : 400,
                        color: sel ? C.pink : C.textDark,
                        transition: "background 100ms",
                        gap: 8,
                      }}
                    >
                      <span style={{ lineHeight: 1.4, flex: 1 }}>{opt}</span>
                      {sel && (
                        <motion.span
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          style={{ display: "flex", flexShrink: 0, color: C.pink }}
                        >
                          <Check size={13} strokeWidth={2.5} />
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
