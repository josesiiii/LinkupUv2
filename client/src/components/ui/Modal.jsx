// src/components/ui/Modal.jsx
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function Modal({ open, onClose, title, children, maxWidth = 480 }) {
  const { colors } = useTheme();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            style={{ background: colors.surface, border: `1px solid ${colors.border}`, maxWidth }}
          >
            {title && (
              <div
                className="flex items-center justify-between px-6 py-4 flex-shrink-0"
                style={{ borderBottom: `1px solid ${colors.border}` }}
              >
                <h3 className="text-base font-semibold" style={{ color: colors.textDark }}>
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full"
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: colors.textMuted }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            <div className="overflow-y-auto px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
