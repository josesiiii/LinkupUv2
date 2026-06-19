import { useEffect, useState } from "react";
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
    uploaderOpen, ownStories,
    fetchFeed, fetchOwnStories, setViewerOpen,
    openViewer, closeViewer,
    openUploader, closeUploader,
    handleUpload, handleView, handleDelete,
    setActiveAuthorIndex, setActiveStoryIndex
  } = useStories();

  const [viewingOwn, setViewingOwn] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleViewMyStory = async () => {
    if (!usuario?.hasActiveStory) return;
    const stories = await fetchOwnStories(usuario._id);
    if (stories?.length > 0) {
      setViewingOwn(true);
      setViewerOpen(true);
    }
  };

  const closeViewerAndReset = () => {
    closeViewer();
    setViewingOwn(false);
  };

  const handleOwnClick = () => {
    if (usuario?.hasActiveStory) {
      handleViewMyStory();
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
        {/* Tu historia */}
        <StoryCircle
          user={usuario}
          seen={false}
          onClick={handleOwnClick}
          size="md"
          isOwn
          onViewMyStory={handleViewMyStory}
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
        onClose={closeViewerAndReset}
        storiesFeed={viewingOwn ? [] : storiesFeed}
        ownStories={viewingOwn ? ownStories : []}
        activeAuthorIndex={viewingOwn ? 0 : activeAuthorIndex}
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
