// src/pages/PublicProfilePage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageCircle, UserPlus, UserCheck, ArrowLeft, Users, UserCheck2, X, UserMinus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import AppLayout from "../components/layout/AppLayout";
import useAuthStore from "../store/authStore";
import { useTheme } from "../context/ThemeContext";
import useStories from "../hooks/useStories";
import StoryViewer from "../components/stories/StoryViewer";
import StoryRingAvatar from "../components/ui/StoryRingAvatar";
import PhotoCarousel from "../features/feed/PhotoCarousel";
import api from "../api/axios";

const Chip = ({ children, colors, tone = "pink" }) => (
  <span style={{
    display: "inline-block", padding: "6px 14px", borderRadius: 100, fontSize: 13, fontWeight: 500,
    background: tone === "pink" ? colors.pinkLight : colors.surfaceAlt, color: colors.textDark,
  }}>
    {children}
  </span>
);

export default function PublicProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colors, theme } = useTheme();
  const usuario = useAuthStore((state) => state.usuario);

  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [connectionId, setConnectionId] = useState(null);
  const [socialInfo, setSocialInfo] = useState({ totalConnections: 0, mutualFriends: [] });
  const [mutualModal, setMutualModal] = useState(false);

  const {
    viewerOpen, activeAuthorIndex, activeStoryIndex,
    storiesFeed, closeViewer, handleView, handleDelete,
    setActiveAuthorIndex, setActiveStoryIndex, setViewerOpen,
    fetchFeed,
  } = useStories();

  const isOwn = usuario?._id === id;

  useEffect(() => {
    if (!id) return;
    if (isOwn) { navigate("/profile", { replace: true }); return; }

    setLoading(true);
    Promise.all([
      api.get(`/users/${id}`),
      api.get("/connections/accepted").catch(() => ({ data: [] })),
      api.get(`/connections/social-info/${id}`).catch(() => ({ data: { totalConnections: 0, mutualFriends: [] } })),
    ])
      .then(([userRes, connRes, socialRes]) => {
        setPerfil(userRes.data);
        const connection = (connRes.data || []).find((c) => {
          const other = c.from?._id === usuario?._id ? c.to : c.from;
          return other?._id === id;
        });
        setConnectionStatus(connection ? "connected" : "none");
        setConnectionId(connection?._id || null);
        setSocialInfo(socialRes.data || { totalConnections: 0, mutualFriends: [] });
      })
      .catch(() => setPerfil(null))
      .finally(() => setLoading(false));
  }, [id, isOwn, usuario?._id, navigate]);

  const handleOpenStory = async () => {
    await fetchFeed();
    const idx = storiesFeed.findIndex((g) => g.author?._id === id);
    if (idx >= 0) {
      setActiveAuthorIndex(idx);
      setActiveStoryIndex(0);
      setViewerOpen(true);
    }
  };

  const handleConnect = async () => {
    try {
      await api.post("/connections", { to: id });
      setConnectionStatus("pending");
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo enviar la solicitud.");
    }
  };

  const handleDisconnect = async () => {
    if (!connectionId) return;
    if (!window.confirm("¿Eliminar esta conexión?")) return;
    try {
      await api.delete(`/connections/${connectionId}`);
      setConnectionStatus("none");
      setConnectionId(null);
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo eliminar la conexión.");
    }
  };

  const cardStyle = theme === "dark"
    ? { background: colors.surface }
    : { background: "rgba(255,255,255,0.45)", backdropFilter: "blur(20px)" };

  if (loading) return (
    <AppLayout>
      <div style={{ maxWidth: "90%", margin: "0 auto", padding: "24px 24px 64px" }}>
        <p style={{ color: colors.textMuted, fontSize: 14 }}>Cargando perfil...</p>
      </div>
    </AppLayout>
  );

  if (!perfil) return (
    <AppLayout>
      <div style={{ maxWidth: "90%", margin: "0 auto", padding: "24px 24px 64px" }}>
        <p style={{ color: colors.textMuted, fontSize: 14 }}>No se encontró el perfil.</p>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div style={{ maxWidth: "90%", margin: "0 auto", padding: "20px 24px 64px" }}>

        {/* Banner */}
        <div style={{
          height: 160, borderRadius: 24, marginBottom: 16,
          background: perfil.profileBanner
            ? `url(${perfil.profileBanner}) center/cover`
            : `linear-gradient(135deg, ${colors.pinkLight}, #e0d4ff)`,
          border: `1px solid ${colors.border}`,
          position: "relative",
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.3)", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
          >
            <ArrowLeft size={18} />
          </button>
        </div>

        {/* Header */}
        <div className="pub-profile-header" style={{ ...cardStyle, border: `1px solid ${colors.border}`, borderRadius: 24, padding: 32, marginBottom: 24, boxShadow: "0 1px 10px rgba(0,0,0,0.05)", position: "relative", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>

          {/* Avatar — circular, con anillo de historia sincronizado (Feed/Chat/Perfil) */}
          <div style={{ flexShrink: 0 }}>
            <StoryRingAvatar
              userId={perfil._id}
              name={perfil.fullName}
              src={perfil.profilePicture}
              size={96}
              shape="circle"
              fallbackHasStory={perfil.hasActiveStory}
              onClick={perfil.hasActiveStory ? handleOpenStory : undefined}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: "0 0 4px 0", fontSize: 26, fontWeight: 700, color: colors.textDark, letterSpacing: "-0.02em" }}>
              {perfil.fullName}
            </h1>
            {perfil.bio && <p style={{ margin: "0 0 12px 0", fontSize: 14, color: colors.textMuted, lineHeight: 1.5 }}>{perfil.bio}</p>}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {perfil.institution && <Chip colors={colors}>{perfil.institution}</Chip>}
              {perfil.currentCampus && <Chip tone="lilac" colors={colors}>{perfil.currentCampus}</Chip>}
            </div>
          </div>

          {/* Actions */}
          <div className="pub-profile-actions" style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
            {connectionStatus === "connected" ? (
              <>
                <button
                  onClick={() => navigate(`/chat?with=${perfil._id}`)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 12, border: "none", background: "#FF3D9E", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14 }}
                >
                  <MessageCircle size={16} /> Mensaje
                </button>
                <button
                  onClick={handleDisconnect}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 12, border: `1px solid ${colors.border}`, background: "transparent", color: colors.textMuted, cursor: "pointer", fontWeight: 600, fontSize: 14 }}
                >
                  <UserMinus size={16} /> Eliminar conexión
                </button>
              </>
            ) : connectionStatus === "pending" ? (
              <button disabled style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 12, border: `1px solid ${colors.border}`, background: "transparent", color: colors.textMuted, fontWeight: 600, fontSize: 14, cursor: "default" }}>
                <UserCheck size={16} /> Solicitud enviada
              </button>
            ) : (
              <button
                onClick={handleConnect}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 12, border: "none", background: "#FF3D9E", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14 }}
              >
                <UserPlus size={16} /> Conectar
              </button>
            )}
          </div>
        </div>

        {/* Info Social */}
        <div style={{ ...cardStyle, border: `1px solid ${colors.border}`, borderRadius: 20, padding: "14px 24px", marginBottom: 24, boxShadow: "0 1px 10px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Users size={16} style={{ color: colors.textMuted }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: colors.textDark }}>{socialInfo.totalConnections}</span>
            <span style={{ fontSize: 14, color: colors.textMuted }}>conexiones</span>
          </div>
          {socialInfo.mutualFriends.length > 0 && (
            <>
              <span style={{ color: colors.border }}>·</span>
              <button
                onClick={() => setMutualModal(true)}
                style={{ display: "flex", alignItems: "center", gap: 8, border: "none", background: "transparent", cursor: "pointer", padding: 0 }}
              >
                <UserCheck2 size={16} style={{ color: colors.pink }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: colors.pink }}>{socialInfo.mutualFriends.length}</span>
                <span style={{ fontSize: 14, color: colors.textMuted }}>amigos en común</span>
              </button>
            </>
          )}
        </div>

        {/* Intereses */}
        {perfil.interests?.length > 0 && (
          <div style={{ ...cardStyle, border: `1px solid ${colors.border}`, borderRadius: 24, padding: 24, marginBottom: 24, boxShadow: "0 1px 10px rgba(0,0,0,0.05)" }}>
            <p style={{ margin: "0 0 12px 0", fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Intereses</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {perfil.interests.map((i) => <Chip key={i} colors={colors}>{i}</Chip>)}
            </div>
          </div>
        )}

        {/* Galería compacta — carrusel inmersivo del Feed en variante compacta, solo visual */}
        {perfil.photos?.length > 0 && (
          <div style={{ ...cardStyle, border: `1px solid ${colors.border}`, borderRadius: 24, padding: 24, marginBottom: 24, boxShadow: "0 1px 10px rgba(0,0,0,0.05)" }}>
            <p style={{ margin: "0 0 12px 0", fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Fotos</p>
            <div style={{ width: "100%", maxWidth: 320, margin: "0 auto" }}>
              <PhotoCarousel photos={perfil.photos} compact aspectRatio="4 / 5" />
            </div>
          </div>
        )}

        {/* Académico */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 }}>
          {[
            { label: "Carrera", value: perfil.career },
            { label: "Facultad", value: perfil.faculty },
            { label: "Semestre", value: perfil.semester },
            { label: "Ciudad", value: perfil.city },
          ].filter((f) => f.value).map((f) => (
            <div key={f.label} style={{ ...cardStyle, border: `1px solid ${colors.border}`, borderRadius: 20, padding: "16px 20px", boxShadow: "0 1px 10px rgba(0,0,0,0.05)" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</p>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: colors.textDark }}>{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      <StoryViewer
        open={viewerOpen}
        onClose={closeViewer}
        storiesFeed={storiesFeed}
        ownStories={[]}
        activeAuthorIndex={activeAuthorIndex}
        activeStoryIndex={activeStoryIndex}
        setActiveAuthorIndex={setActiveAuthorIndex}
        setActiveStoryIndex={setActiveStoryIndex}
        onView={handleView}
        onDelete={handleDelete}
      />

      <style>{`
        @media (max-width: 480px) {
          .pub-profile-header { padding: 20px !important; flex-direction: column; align-items: flex-start !important; }
          .pub-profile-actions { width: 100%; }
          .pub-profile-actions button { flex: 1; justify-content: center; }
        }
      `}</style>

      {/* Modal amigos en común */}
      <AnimatePresence>
        {mutualModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMutualModal(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 24, padding: 28, width: "100%", maxWidth: 400, maxHeight: "80vh", overflowY: "auto" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: colors.textDark }}>Amigos en común</h3>
                <button onClick={() => setMutualModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: colors.textMuted, display: "flex" }}>
                  <X size={20} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {socialInfo.mutualFriends.map((amigo) => (
                  <button
                    key={amigo._id}
                    onClick={() => { setMutualModal(false); navigate(`/users/${amigo._id}`); }}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 14, border: `1px solid ${colors.border}`, background: "transparent", cursor: "pointer", textAlign: "left", transition: "all 150ms" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.pink; e.currentTarget.style.background = colors.pinkLight; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.background = "transparent"; }}
                  >
                    {amigo.profilePicture ? (
                      <img src={amigo.profilePicture} alt={amigo.fullName} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: colors.pinkLight, display: "flex", alignItems: "center", justifyContent: "center", color: colors.pink, fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                        {(amigo.fullName || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: colors.textDark }}>{amigo.fullName}</p>
                      {amigo.career && <p style={{ margin: "2px 0 0 0", fontSize: 12, color: colors.textMuted }}>{amigo.career}</p>}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
