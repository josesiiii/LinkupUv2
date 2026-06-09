import { create } from "zustand";

const useAuthStore = create((set) => ({
  // Evaluador seguro para evitar que un string "undefined" rompa la app
  usuario: (() => {
    const saved = localStorage.getItem("usuario");
    if (!saved || saved === "undefined") return null;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  })(),

  token: localStorage.getItem("token") || null,

  setAuth: (usuario, token) => {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("token", token);
    set({ usuario, token });
  },

  logout: () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    set({ usuario: null, token: null });
  }
}));

export default useAuthStore;