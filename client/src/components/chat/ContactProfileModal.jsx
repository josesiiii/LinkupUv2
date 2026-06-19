// src/components/chat/ContactProfileModal.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, MessageCircle, ExternalLink } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import api from "../../api/axios";
import { formatPresence } from "./utils";
import StoryRingAvatar from "../ui/StoryRingAvatar";

export default function ContactProfileModal({ open, onClose, userId, presence, onOpenStory }) {
  const { colors, theme } = useTheme();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !userId) return;
    setLoading(true);
    api.get(`/users/${userId}`)
      .then((r) => setPerfil(r.data))
      .catch(() => setPerfil(null))
      .finally(() => setLoading(false));
  }, [open, userId]);

  if (!open) return null;

  const presenceText = presence ? formatPresence(presence) : "⚫ Desconectado";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%", maxWidth: 420, borderRadius: 24, overflow: "hidden",
              background: colors.surface, border: `1px solid ${colors.border}`,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            {/* Banner */}
            <div style={{
              height: 100, background: perfil?.profileBanner
                ? `url(${perfil.profileBanner}) center/cover`
                : `linear-gradient(135deg, ${colors.pinkLight}, #e0d4ff)`,
              position: "relative",
            }}>
              <button
                onClick={onClose}
                style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.3)", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Avatar superpuesto */}
            <div style={{ padding: "0 20px 20px", position: "relative" }}>
              <div style={{ marginTop: -40, marginBottom: 12 }}>
                <StoryRingAvatar
                  userId={perfil?._id}
                  name={perfil?.fullName}
                  src={perfil?.profilePicture}
                  size={80}
                  shape="circle"
                  fallbackHasStory={perfil?.hasActiveStory}
                  onClick={perfil?.hasActiveStory ? () => { onClose(); onOpenStory?.(userId); } : undefined}
                />
              </div>

              {loading && <p style={{ color: colors.textMuted, fontSize: 14, margin: 0 }}>Cargando perfil...</p>}

              {perfil && (
                <>
                  <h3 style={{ margin: "0 0 2px 0", fontSize: 20, fontWeight: 700, color: colors.textDark }}>{perfil.fullName}</h3>
                  <p style={{ margin: "0 0 12px 0", fontSize: 13, color: colors.textMuted }}>{presenceText}</p>

                  {perfil.bio && (
                    <p style={{ margin: "0 0 14px 0", fontSize: 14, color: colors.textDark, lineHeight: 1.5 }}>{perfil.bio}</p>
                  )}

                  {/* Info académica */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                    {perfil.faculty && <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 100, background: colors.surfaceAlt, color: colors.textDark }}>{perfil.faculty}</span>}
                    {perfil.currentCampus && <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 100, background: colors.surfaceAlt, color: colors.textDark }}>{perfil.currentCampus}</span>}
                    {perfil.career && <span style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 100, background: colors.surfaceAlt, color: colors.textDark }}>{perfil.career}</span>}
                  </div>

                  {/* Intereses */}
                  {perfil.interests?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                      {perfil.interests.slice(0, 5).map((i) => (
                        <span key={i} style={{ fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 100, background: colors.pinkLight, color: colors.pink }}>{i}</span>
                      ))}
                    </div>
                  )}

                  {/* Botones */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => { onClose(); navigate(`/users/${perfil._id}`); }}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderRadius: 12, border: `1px solid ${colors.border}`, background: "transparent", color: colors.textDark, cursor: "pointer", fontWeight: 600, fontSize: 13 }}
                    >
                      <ExternalLink size={15} /> Ver perfil completo
                    </button>
                    <button
                      onClick={() => { onClose(); navigate(`/chat?with=${perfil._id}`); }}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderRadius: 12, border: "none", background: "#FF3D9E", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 13 }}
                    >
                      <MessageCircle size={15} /> Mensaje
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
