import { create } from "zustand";
import api from "../api/axios";

// Fuente única de verdad para perfiles guardados — rehidratada siempre desde el
// backend (nunca confía en localStorage), siguiendo el mismo patrón de authStore.js.
const useSavedProfilesStore = create((set, get) => ({
  savedIds: [],
  loadedForUserId: null,
  loading: false,
  error: "",

  fetchSaved: async (myUserId, { force = false } = {}) => {
    if (!myUserId) return;
    if (!force && get().loadedForUserId === myUserId) return;
    set({ loading: true, error: "" });
    try {
      const res = await api.get("/savedprofiles");
      const ids = (res.data || []).map((g) => g.savedUser?._id || g.savedUser);
      set({ savedIds: ids, loadedForUserId: myUserId, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Error al cargar guardados", loading: false });
    }
  },

  isSaved: (userId) => get().savedIds.includes(userId),

  save: async (userId) => {
    const had = get().savedIds.includes(userId);
    if (!had) set((s) => ({ savedIds: [...s.savedIds, userId] }));
    try {
      await api.post("/savedprofiles", { savedUser: userId });
    } catch (err) {
      if (!had) set((s) => ({ savedIds: s.savedIds.filter((id) => id !== userId) }));
      throw err;
    }
  },

  unsave: async (userId) => {
    const had = get().savedIds.includes(userId);
    if (had) set((s) => ({ savedIds: s.savedIds.filter((id) => id !== userId) }));
    try {
      await api.delete(`/savedprofiles/${userId}`);
    } catch (err) {
      if (had) set((s) => ({ savedIds: [...s.savedIds, userId] }));
      throw err;
    }
  },

  reset: () => set({ savedIds: [], loadedForUserId: null, loading: false, error: "" }),
}));

export default useSavedProfilesStore;
