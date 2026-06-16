// src/pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import AvatarEditButton from "../components/profile/AvatarEditButton";
import EditProfileModal from "../components/profile/EditProfileModal";
import GalleryEditor from "../components/profile/GalleryEditor";
import StoryViewer from "../components/stories/StoryViewer";
import StoryUploader from "../components/stories/StoryUploader";
import useAuthStore from "../store/authStore";
import { useTheme } from "../context/ThemeContext";
import useStories from "../hooks/useStories";

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

const GRADIENT = "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)";

export default function ProfilePage() {
  const usuario = useAuthStore((state) => state.usuario);
  const { theme, colors } = useTheme();
  const [editOpen, setEditOpen] = useState(false);

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
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 64px" }}>

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
            <div
              onClick={handleAvatarClick}
              style={{
                cursor: "pointer",
                borderRadius: 24, overflow: "hidden",
                padding: usuario?.hasActiveStory ? 3 : 0,
                background: usuario?.hasActiveStory ? GRADIENT : "transparent",
                display: "inline-block"
              }}
            >
              <div style={{ borderRadius: 20, overflow: "hidden", padding: usuario?.hasActiveStory ? 2 : 0, background: usuario?.hasActiveStory ? colors.surface : "transparent" }}>
                {usuario?.profilePicture ? (
                  <img
                    src={usuario.profilePicture}
                    alt={usuario?.fullName}
                    style={{ width: 96, height: 96, borderRadius: 20, objectFit: "cover", border: usuario?.hasActiveStory ? "none" : `2px solid ${colors.border}`, display: "block" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 96, height: 96, borderRadius: 20, background: colors.gradient,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: 700, fontSize: 36,
                    }}
                  >
                    {usuario?.fullName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
              </div>
            </div>
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
            border: `1px solid ${colors.border}`, borderRadius: 24, padding: 24,
            boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
          }}
        >
          <p style={{ margin: "0 0 12px 0", fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Galería</p>
          <GalleryEditor />
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
