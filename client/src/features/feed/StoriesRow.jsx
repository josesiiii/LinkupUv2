import { useEffect } from "react";
import { Plus } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import useAuthStore from "../../store/authStore";
import useStories from "../../hooks/useStories";
import StoryCircle from "./StoryCircle";
import StoryViewer from "../../components/stories/StoryViewer";
import StoryUploader from "../../components/stories/StoryUploader";

const GRADIENT = "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)";

export default function StoriesRow() {
  const { colors } = useTheme();
  const usuario = useAuthStore((s) => s.usuario);

  const {
    storiesFeed, loading,
    viewerOpen, activeAuthorIndex, activeStoryIndex,
    uploaderOpen,
    fetchFeed,
    openViewer, closeViewer,
    openUploader, closeUploader,
    handleUpload, handleView, handleDelete,
    setActiveAuthorIndex, setActiveStoryIndex
  } = useStories();

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleOwnClick = () => {
    if (usuario?.hasActiveStory) {
      const ownIndex = storiesFeed.findIndex(
        (g) => g.author?._id === usuario?._id
      );
      if (ownIndex !== -1) {
        openViewer(ownIndex);
      } else {
        openUploader();
      }
    } else {
      openUploader();
    }
  };

  const firstName = (usuario?.fullName || "Tú").split(" ")[0];

  return (
    <>
      <div
        style={{
          display: "flex", gap: 16, overflowX: "auto",
          padding: "4px 16px 12px", flexShrink: 0, scrollbarWidth: "none"
        }}
        className="stories-row"
      >
        {/* Tu historia */}
        <button
          onClick={handleOwnClick}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, padding: 0
          }}
        >
          <div style={{ position: "relative", width: 64, height: 64 }}>
            {}
            {usuario?.hasActiveStory ? (
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: GRADIENT, padding: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: colors.surface, padding: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {usuario?.profilePicture ? (
                    <img src={usuario.profilePicture} alt="Tu historia" style={{ width: 54, height: 54, borderRadius: "50%", objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ width: 54, height: 54, borderRadius: "50%", background: colors.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: colors.textDark }}>
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              usuario?.profilePicture ? (
                <img src={usuario.profilePicture} alt="Tu historia" style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: `2px solid ${colors.border}` }} />
              ) : (
                <div style={{ width: 64, height: 64, borderRadius: "50%", border: `2px solid ${colors.border}`, background: colors.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: colors.textDark }}>
                  {firstName.charAt(0).toUpperCase()}
                </div>
              )
            )}
            {/* Botón + */}
            {!usuario?.hasActiveStory && (
              <div style={{ position: "absolute", bottom: -2, right: -2, width: 22, height: 22, borderRadius: "50%", background: "#FF3D9E", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${colors.surface}` }}>
                <Plus size={13} />
              </div>
            )}
          </div>
          <span style={{ fontSize: 11, color: colors.textMuted, maxWidth: 64, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Tu historia
          </span>
        </button>

        {/* Stories de conexiones */}
        {!loading && storiesFeed.map((group, index) => (
          <StoryCircle
            key={group.author?._id}
            user={group.author}
            seen={group.stories.every((s) => s.seen)}
            onClick={() => openViewer(index)}
            size="md"
          />
        ))}

        <style>{`.stories-row::-webkit-scrollbar { display: none; }`}</style>
      </div>

      <StoryViewer
        open={viewerOpen}
        onClose={closeViewer}
        storiesFeed={storiesFeed}
        activeAuthorIndex={activeAuthorIndex}
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
    </>
  );
}
