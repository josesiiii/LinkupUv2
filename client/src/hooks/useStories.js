import { useState, useCallback } from "react";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import useStoryRingStore from "../store/storyRingStore";

export default function useStories() {
  const updateUsuario = useAuthStore((s) => s.updateUsuario);

  const [storiesFeed, setStoriesFeed]             = useState([]);
  const [loading, setLoading]                     = useState(false);
  const [viewerOpen, setViewerOpen]               = useState(false);
  const [activeAuthorIndex, setActiveAuthorIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex]   = useState(0);
  const [uploaderOpen, setUploaderOpen]           = useState(false);
  const [ownStories, setOwnStories]               = useState([]);

  const fetchFeed = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/stories/feed");
      const feed = Array.isArray(res.data) ? res.data : [];
      setStoriesFeed(feed);
      useStoryRingStore.getState().hydrateFromFeed(feed);
    } catch {
      setStoriesFeed([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOwnStories = useCallback(async (userId) => {
    try {
      const res = await api.get(`/stories/user/${userId}`);
      setOwnStories(Array.isArray(res.data) ? res.data : []);
      return res.data;
    } catch {
      setOwnStories([]);
      return [];
    }
  }, []);

  const openViewer = useCallback((authorIndex) => {
    setActiveAuthorIndex(authorIndex);
    setActiveStoryIndex(0);
    setViewerOpen(true);
  }, []);

  const closeViewer = useCallback(() => {
    setViewerOpen(false);
  }, []);

  const goNext = useCallback(() => {
    setStoriesFeed((feed) => {
      const currentAuthor = feed[activeAuthorIndex];
      if (!currentAuthor) return feed;

      if (activeStoryIndex < currentAuthor.stories.length - 1) {
        setActiveStoryIndex((i) => i + 1);
      } else if (activeAuthorIndex < feed.length - 1) {
        setActiveAuthorIndex((i) => i + 1);
        setActiveStoryIndex(0);
      } else {
        setViewerOpen(false);
      }
      return feed;
    });
  }, [activeAuthorIndex, activeStoryIndex]);

  const goPrev = useCallback(() => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex((i) => i - 1);
    } else if (activeAuthorIndex > 0) {
      setActiveAuthorIndex((i) => i - 1);
      setActiveStoryIndex(0);
    }
  }, [activeAuthorIndex, activeStoryIndex]);

  const openUploader = useCallback(() => setUploaderOpen(true), []);
  const closeUploader = useCallback(() => setUploaderOpen(false), []);

  const handleUpload = useCallback(async (file) => {
    const formData = new FormData();
    formData.append("media", file);
    const res = await api.post("/stories", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    updateUsuario({ hasActiveStory: true });
    await fetchFeed();
    return res.data;
  }, [fetchFeed, updateUsuario]);

  const handleView = useCallback(async (storyId) => {
    // Actualización optimista local + propagación instantánea al store
    // compartido, para que el anillo cambie a gris sin esperar un refetch.
    let allSeenForAuthor = null;
    let authorId = null;

    setStoriesFeed((feed) => {
      const next = feed.map((group) => {
        const hasTarget = group.stories.some((s) => s._id === storyId);
        if (!hasTarget) return group;
        authorId = group.author?._id;
        const stories = group.stories.map((s) => (s._id === storyId ? { ...s, seen: true } : s));
        allSeenForAuthor = stories.every((s) => s.seen);
        return { ...group, stories };
      });
      return next;
    });

    if (authorId && allSeenForAuthor !== null) {
      useStoryRingStore.getState().setSeen(authorId, allSeenForAuthor);
    }

    try {
      await api.post(`/stories/${storyId}/view`);
    } catch {
      // ignorar — no crítico
    }
  }, []);

  const handleDelete = useCallback(async (storyId) => {
    await api.delete(`/stories/${storyId}`);
    await fetchFeed();
  }, [fetchFeed]);

  return {
    storiesFeed, loading,
    viewerOpen, activeAuthorIndex, activeStoryIndex,
    uploaderOpen, ownStories,
    fetchFeed, fetchOwnStories,
    openViewer, closeViewer, setViewerOpen,
    goNext, goPrev,
    openUploader, closeUploader,
    handleUpload, handleView, handleDelete,
    setActiveAuthorIndex, setActiveStoryIndex
  };
}
