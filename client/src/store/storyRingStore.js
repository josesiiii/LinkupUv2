import { create } from "zustand";
import api from "../api/axios";

const STALE_MS = 60_000;

// Fuente única de verdad para "¿este usuario tiene historia activa / ya la vi?"
// Consumida por Feed, Chat, Conexiones, Guardados y Perfil ajeno para que el
// anillo se mantenga consistente sin depender de refetches independientes.
const useStoryRingStore = create((set, get) => ({
  rings: {}, // { [userId]: { hasActiveStory, seen, loadedAt } }

  // Hidratación masiva desde la respuesta agrupada de GET /stories/feed
  hydrateFromFeed: (storiesFeed = []) => {
    set((s) => {
      const rings = { ...s.rings };
      storiesFeed.forEach((group) => {
        const authorId = group.author?._id;
        if (!authorId) return;
        rings[authorId] = {
          hasActiveStory: true,
          seen: group.stories.every((st) => st.seen),
          loadedAt: Date.now(),
        };
      });
      return { rings };
    });
  },

  // Actualización optimista instantánea — se llama justo tras registrar una vista.
  setSeen: (userId, seen) => {
    if (!userId) return;
    set((s) => ({
      rings: {
        ...s.rings,
        [userId]: { ...s.rings[userId], hasActiveStory: true, seen, loadedAt: Date.now() },
      },
    }));
  },

  // Fetch perezoso para superficies que no cargaron el feed de stories esta
  // sesión (ej. perfil ajeno por link directo).
  ensureLoaded: async (userId) => {
    if (!userId) return null;
    const existing = get().rings[userId];
    if (existing && Date.now() - existing.loadedAt < STALE_MS) return existing;
    try {
      const res = await api.get(`/stories/user/${userId}`);
      const stories = Array.isArray(res.data) ? res.data : [];
      const ring = {
        hasActiveStory: stories.length > 0,
        seen: stories.length > 0 && stories.every((s) => s.seen),
        loadedAt: Date.now(),
      };
      set((s) => ({ rings: { ...s.rings, [userId]: ring } }));
      return ring;
    } catch {
      const fallback = { hasActiveStory: false, seen: false, loadedAt: Date.now() };
      set((s) => ({ rings: { ...s.rings, [userId]: fallback } }));
      return fallback;
    }
  },

  reset: () => set({ rings: {} }),
}));

export default useStoryRingStore;
