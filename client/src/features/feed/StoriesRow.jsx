import { useEffect } from "react";
import useAuthStore from "../../store/authStore";
import useStories from "../../hooks/useStories";
import StoryCircle from "./StoryCircle";
import StoryViewer from "../../components/stories/StoryViewer";
import StoryUploader from "../../components/stories/StoryUploader";

export default function StoriesRow() {
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

  return (
    <>
      <div
        style={{
          display: "flex", gap: 16, overflowX: "auto",
          padding: "4px 16px 12px", flexShrink: 0, scrollbarWidth: "none"
        }}
        className="stories-row"
      >
        {/* Tu historia — misma dimensión/anillo que las ajenas vía StoryCircle */}
        <StoryCircle
          user={usuario}
          seen={false}
          onClick={handleOwnClick}
          size="md"
          isOwn
          onViewMyStory={handleOwnClick}
          onUploadStory={openUploader}
        />

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
