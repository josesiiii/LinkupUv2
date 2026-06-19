// src/pages/ProfilePage.jsx
import { useState, useRef, useEffect } from "react";
import { Pencil, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import AvatarEditButton from "../components/profile/AvatarEditButton";
import EditProfileModal from "../components/profile/EditProfileModal";
import GalleryEditor from "../components/profile/GalleryEditor";
import StoryViewer from "../components/stories/StoryViewer";
import StoryUploader from "../components/stories/StoryUploader";
import ImageCropModal from "../components/ui/ImageCropModal";
import StoryRingAvatar from "../components/ui/StoryRingAvatar";
import useAuthStore from "../store/authStore";
import { useTheme } from "../context/ThemeContext";
import useStories from "../hooks/useStories";
import api from "../api/axios";

const otherPerson = (conn, myId) =>
  conn.from?._id === myId ? conn.to : conn.from;

const Chip = ({ children, tone = "pink", colors }) => (
  <span
    style={{
      display: "inline-block", padding: "6px 14px", borderRadius: 100,
      fontSize: 13, fontWeight: 500,
      background: tone === "pink" ? colors.pinkLight : colors.surfaceAlt,
      color: colors.textDark,
    }}
  >
    {children}
  </span>
);

const InfoCard = ({ label, value, theme, colors }) => (
  <div
    style={{
      ...(theme === "dark"
        ? { background: colors.surface }
        : { background: "rgba(255,255,255,0.5)" }),
      border: `1px solid ${colors.border}`,
      borderRadius: 20, padding: "16px 20px",
      boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
    }}
  >
    <p style={{ margin: "0 0 4px 0", fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
    <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: colors.textDark }}>{value || "—"}</p>
  </div>
);

export default function ProfilePage() {
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const updateUsuario = useAuthStore((state) => state.updateUsuario);
  const { theme, colors } = useTheme();
  const [editOpen, setEditOpen] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerCropSrc, setBannerCropSrc] = useState(null);
  const bannerInputRef = useRef(null);
  const [amigos, setAmigos] = useState([]);
  const [loadingAmigos, setLoadingAmigos] = useState(true);

  useEffect(() => {
    api.get("/connections/accepted")
      .then((res) => {
        const lista = (res.data || []).map((c) => otherPerson(c, usuario?._id)).filter(Boolean);
        setAmigos(lista);
      })
      .catch(() => {})
      .finally(() => setLoadingAmigos(false));
  }, [usuario?._id]);

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const reader = new FileReader();
    reader.onload = () => setBannerCropSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleBannerCropSave = async (blob) => {
    setBannerUploading(true);
    try {
      const file = new File([blob], "banner.jpg", { type: "image/jpeg" });
      const form = new FormData();
      form.append("image", file);
      const res = await api.post("/users/profile-banner", form);
      updateUsuario({ profileBanner: res.data.profileBanner });
    } catch {
      alert("No se pudo subir el banner.");
    } finally {
      setBannerUploading(false);
      setBannerCropSrc(null);
    }
  };

  const {
    viewerOpen, activeAuthorIndex, activeStoryIndex,
    uploaderOpen, ownStories,
    fetchOwnStories,
    openUploader, closeUploader,
    closeViewer, handleUpload, handleView, handleDelete,
    setActiveAuthorIndex, setActiveStoryIndex, setViewerOpen
  } = useStories();

  const openOwnViewer = async () => {
    if (!usuario?._id) return;
    const stories = await fetchOwnStories(usuario._id);
    if (stories?.length > 0) {
      setViewerOpen(true);
    } else {
      openUploader();
    }
  };

  const handleAvatarClick = () => {
    if (usuario?.hasActiveStory) {
      openOwnViewer();
    } else {
      openUploader();
    }
  };

  const cardStyle = theme === "dark"
    ? { background: colors.surface }
    : { background: "rgba(255,255,255,0.45)", backdropFilter: "blur(20px)" };

  return (
    <AppLayout>
      <ImageCropModal
        image={bannerCropSrc}
        aspectRatio={16 / 9}
        cropShape="rect"
        title="Editar banner"
        onSave={handleBannerCropSave}
        onClose={() => setBannerCropSrc(null)}
      />

      <div style={{ maxWidth: "90%", margin: "0 auto", padding: "0 24px 64px" }}>

        {/* Banner */}
        <div
          onClick={() => !bannerUploading && bannerInputRef.current?.click()}
          style={{
            position: "relative", height: 160, borderRadius: 24, marginBottom: 16,
            background: usuario?.profileBanner
              ? `url(${usuario.profileBanner}) center/cover`
              : `linear-gradient(135deg, ${colors.pinkLight}, #e0d4ff)`,
            cursor: bannerUploading ? "wait" : "pointer",
            border: `1px solid ${colors.border}`,
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 200ms",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.25)"; e.currentTarget.children[0].style.opacity = "1"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0)"; e.currentTarget.children[0].style.opacity = "0"; }}
          >
            <div style={{ opacity: 0, display: "flex", alignItems: "center", gap: 8, color: "#fff", fontWeight: 600, fontSize: 14, transition: "opacity 200ms" }}>
              <Camera size={18} /> {bannerUploading ? "Subiendo..." : "Cambiar banner"}
            </div>
          </div>
          <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleBannerChange} />
        </div>

        {/* Header */}
        <div
          style={{
            position: "relative",
            display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap",
            ...cardStyle,
            border: `1px solid ${colors.border}`, borderRadius: 24, padding: 32, marginBottom: 24,
            boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
          }}
        >
          <button
            onClick={() => setEditOpen(true)}
            style={{
              position: "absolute", top: 16, right: 16,
              width: 36, height: 36, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `1px solid ${colors.border}`, background: colors.surfaceAlt,
              color: colors.textDark, cursor: "pointer",
            }}
            aria-label="Editar perfil"
          >
            <Pencil size={16} />
          </button>

          <div style={{ position: "relative", flexShrink: 0 }}>
            <StoryRingAvatar
              userId={usuario?._id}
              name={usuario?.fullName}
              src={usuario?.profilePicture}
              size={96}
              shape="squircle"
              fallbackHasStory={usuario?.hasActiveStory}
              onClick={handleAvatarClick}
            />
            <AvatarEditButton hasPhoto={!!usuario?.profilePicture} />
          </div>

          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: "0 0 4px 0", fontSize: 28, fontWeight: 700, color: colors.textDark, fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>
              {usuario?.fullName || "Usuario"}
            </h1>
            <p style={{ margin: "0 0 10px 0", fontSize: 14, color: colors.textMid }}>{usuario?.email}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {usuario?.institution && <Chip colors={colors}>{usuario.institution}</Chip>}
              {usuario?.currentCampus && <Chip tone="lilac" colors={colors}>{usuario.currentCampus}</Chip>}
            </div>
          </div>
        </div>

        {/* Bio */}
        {usuario?.bio && (
          <div
            style={{
              ...cardStyle,
              border: `1px solid ${colors.border}`, borderRadius: 24, padding: 24, marginBottom: 24,
              boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
            }}
          >
            <p style={{ margin: "0 0 8px 0", fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Sobre mí</p>
            <p style={{ margin: 0, fontSize: 15, color: colors.textDark, lineHeight: 1.6 }}>{usuario.bio}</p>
          </div>
        )}

        {/* Datos académicos */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
          <InfoCard label="Carrera" value={usuario?.career} theme={theme} colors={colors} />
          <InfoCard label="Facultad" value={usuario?.faculty} theme={theme} colors={colors} />
          <InfoCard label="Semestre" value={usuario?.semester} theme={theme} colors={colors} />
          <InfoCard label="Ciudad" value={usuario?.city} theme={theme} colors={colors} />
        </div>

        {/* Intereses */}
        {usuario?.interests?.length > 0 && (
          <div
            style={{
              ...cardStyle,
              border: `1px solid ${colors.border}`, borderRadius: 24, padding: 24, marginBottom: 24,
              boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
            }}
          >
            <p style={{ margin: "0 0 12px 0", fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Intereses</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {usuario.interests.map((interest) => <Chip key={interest} colors={colors}>{interest}</Chip>)}
            </div>
          </div>
        )}

        {/* Objetivos */}
        {usuario?.objectives?.length > 0 && (
          <div
            style={{
              ...cardStyle,
              border: `1px solid ${colors.border}`, borderRadius: 24, padding: 24, marginBottom: 24,
              boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
            }}
          >
            <p style={{ margin: "0 0 12px 0", fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Objetivos</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {usuario.objectives.map((objective) => <Chip key={objective} tone="lilac" colors={colors}>{objective}</Chip>)}
            </div>
          </div>
        )}

        {/* Galería */}
        <div
          style={{
            ...cardStyle,
            border: `1px solid ${colors.border}`, borderRadius: 24, padding: 24, marginBottom: 24,
            boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
          }}
        >
          <p style={{ margin: "0 0 12px 0", fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Galería</p>
          <GalleryEditor />
        </div>

        {/* Amigos */}
        <div
          style={{
            ...cardStyle,
            border: `1px solid ${colors.border}`, borderRadius: 24, padding: 24,
            boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Amigos</p>
            {!loadingAmigos && (
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: colors.pinkLight, color: colors.pink }}>
                {amigos.length}
              </span>
            )}
          </div>

          {loadingAmigos ? (
            <p style={{ fontSize: 13, color: colors.textMuted, margin: 0 }}>Cargando...</p>
          ) : amigos.length === 0 ? (
            <p style={{ fontSize: 13, color: colors.textMuted, margin: 0 }}>Aún no tienes conexiones.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
              {amigos.map((amigo) => (
                <button
                  key={amigo._id}
                  onClick={() => navigate(`/users/${amigo._id}`)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                    padding: "14px 10px", borderRadius: 16,
                    border: `1px solid ${colors.border}`,
                    background: theme === "dark" ? colors.surfaceAlt : "rgba(255,255,255,0.6)",
                    cursor: "pointer", transition: "all 150ms", textAlign: "center",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.pink; e.currentTarget.style.background = colors.pinkLight; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.background = theme === "dark" ? colors.surfaceAlt : "rgba(255,255,255,0.6)"; }}
                >
                  {amigo.profilePicture ? (
                    <img src={amigo.profilePicture} alt={amigo.fullName} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: colors.pinkLight, display: "flex", alignItems: "center", justifyContent: "center", color: colors.pink, fontWeight: 700, fontSize: 18 }}>
                      {(amigo.fullName || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div style={{ minWidth: 0, width: "100%" }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: colors.textDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {amigo.fullName}
                    </p>
                    {amigo.career && (
                      <p style={{ margin: "2px 0 0 0", fontSize: 11, color: colors.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {amigo.career}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} usuario={usuario} />

      <StoryViewer
        open={viewerOpen}
        onClose={closeViewer}
        storiesFeed={[]}
        ownStories={ownStories}
        activeAuthorIndex={0}
        activeStoryIndex={activeStoryIndex}
        setActiveAuthorIndex={setActiveAuthorIndex}
        setActiveStoryIndex={setActiveStoryIndex}
        onView={handleView}
        onDelete={handleDelete}
      />

      <StoryUploader
        open={uploaderOpen}
        onClose={closeUploader}
        onUpload={handleUpload}
      />
    </AppLayout>
  );
}
