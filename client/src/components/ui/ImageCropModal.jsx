import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { getCroppedImg } from "../../utils/cropImage";

export default function ImageCropModal({
  image,
  aspectRatio = 1,
  cropShape = "rect",
  title = "Editar imagen",
  onSave,
  onClose,
}) {
  const { colors } = useTheme();
  const [crop, setCrop]   = useState({ x: 0, y: 0 });
  const [zoom, setZoom]   = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const blob = await getCroppedImg(image, croppedAreaPixels, 0.95);
      await onSave(blob);
    } finally {
      setSaving(false);
    }
  };

  const clampZoom = (v) => Math.min(3, Math.max(1, v));

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          key="crop-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.78)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            key="crop-modal"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            style={{
              width: "92vw", maxWidth: 560,
              maxHeight: "90vh",
              borderRadius: 24,
              background: colors.surface,
              display: "flex", flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 24px 80px rgba(0,0,0,0.45)",
            }}
          >
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 20px",
              borderBottom: `1px solid ${colors.border}`,
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: colors.textDark }}>
                {title}
              </span>
              <button
                onClick={onClose}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: "none", background: colors.surfaceAlt,
                  color: colors.textMuted, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 150ms",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = colors.border}
                onMouseLeave={(e) => e.currentTarget.style.background = colors.surfaceAlt}
              >
                <X size={16} />
              </button>
            </div>

            {/* Crop area */}
            <div style={{
              position: "relative",
              flex: 1,
              minHeight: 340,
              background: "#111",
            }}>
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                cropShape={cropShape}
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: { borderRadius: 0 },
                  cropAreaStyle: {
                    border: cropShape === "round"
                      ? "2px solid rgba(255,255,255,0.85)"
                      : "2px solid rgba(255,255,255,0.85)",
                    boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
                  },
                }}
              />
            </div>

            {/* Zoom controls */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "14px 20px",
              borderTop: `1px solid ${colors.border}`,
              flexShrink: 0,
            }}>
              <button
                onClick={() => setZoom(clampZoom(zoom - 0.1))}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: `1px solid ${colors.border}`,
                  background: "transparent", color: colors.textMuted,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ZoomOut size={15} />
              </button>

              <input
                type="range"
                min={1} max={3} step={0.02}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                style={{
                  flex: 1, height: 4, appearance: "none", WebkitAppearance: "none",
                  borderRadius: 99, cursor: "pointer",
                  background: `linear-gradient(to right, #FF3D9E ${((zoom - 1) / 2) * 100}%, ${colors.border} ${((zoom - 1) / 2) * 100}%)`,
                  outline: "none",
                }}
              />

              <button
                onClick={() => setZoom(clampZoom(zoom + 0.1))}
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: `1px solid ${colors.border}`,
                  background: "transparent", color: colors.textMuted,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ZoomIn size={15} />
              </button>
            </div>

            {/* Footer actions */}
            <div style={{
              display: "flex", gap: 10,
              padding: "0 20px 20px",
              flexShrink: 0,
            }}>
              <button
                onClick={onClose}
                disabled={saving}
                style={{
                  flex: 1, padding: "13px 0", borderRadius: 14,
                  border: `1px solid ${colors.border}`,
                  background: "transparent", color: colors.textDark,
                  fontWeight: 600, fontSize: 14, cursor: "pointer",
                }}
              >
                Descartar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  flex: 2, padding: "13px 0", borderRadius: 14,
                  border: "none",
                  background: saving ? colors.border : "linear-gradient(135deg, #FF3D9E 0%, #E0317F 100%)",
                  color: saving ? colors.textMuted : "#fff",
                  fontWeight: 700, fontSize: 14,
                  cursor: saving ? "not-allowed" : "pointer",
                  transition: "background 200ms",
                }}
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
