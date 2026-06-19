import { create } from "zustand";
import { resetSocket } from "../lib/socket";
import useSavedProfilesStore from "./savedProfilesStore";
import useStoryRingStore from "./storyRingStore";

const safeParse = (raw, fallback) => {
  if (!raw || raw === "undefined") return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

const persistAccounts = (accounts) => {
  localStorage.setItem("accounts", JSON.stringify(accounts));
};

const useAuthStore = create((set, get) => ({
  // Evaluador seguro para evitar que un string "undefined" rompa la app
  usuario: safeParse(localStorage.getItem("usuario"), null),

  token: localStorage.getItem("token") || null,

  // Sesiones múltiples guardadas en este dispositivo: [{ usuario, token }]
  accounts: safeParse(localStorage.getItem("accounts"), []),

  // Contadores de notificaciones por cuenta (se actualiza desde el Sidebar)
  accountBadges: {},
  setAccountBadges: (userId, badges) =>
    set((s) => ({ accountBadges: { ...s.accountBadges, [userId]: badges } })),

  setAuth: (usuario, token) => {
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("token", token);

    const accounts = get().accounts.filter((acc) => acc.usuario?._id !== usuario._id);
    accounts.push({ usuario, token });
    persistAccounts(accounts);

    set({ usuario, token, accounts });
  },

  // Cambia la cuenta activa sin requerir login, si ya existe una sesión guardada
  switchAccount: (userId) => {
    const account = get().accounts.find((acc) => acc.usuario?._id === userId);
    if (!account) return;

    localStorage.setItem("usuario", JSON.stringify(account.usuario));
    localStorage.setItem("token", account.token);

    resetSocket();
    useSavedProfilesStore.getState().reset();
    useStoryRingStore.getState().reset();
    set({ usuario: account.usuario, token: account.token });
  },

  // Elimina una cuenta del dispositivo (usado por "Cerrar sesión")
  removeAccount: (userId) => {
    const remaining = get().accounts.filter((acc) => acc.usuario?._id !== userId);
    persistAccounts(remaining);

    if (remaining.length > 0) {
      const next = remaining[remaining.length - 1];
      localStorage.setItem("usuario", JSON.stringify(next.usuario));
      localStorage.setItem("token", next.token);
      resetSocket();
      useSavedProfilesStore.getState().reset();
      useStoryRingStore.getState().reset();
      set({ usuario: next.usuario, token: next.token, accounts: remaining });
    } else {
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      resetSocket();
      useSavedProfilesStore.getState().reset();
      useStoryRingStore.getState().reset();
      set({ usuario: null, token: null, accounts: [] });
    }
  },

  // Aplica cambios parciales al usuario activo (ej. tras editar el perfil)
  updateUsuario: (partialUsuario) => {
    const current = get().usuario;
    if (!current) return;

    const merged = { ...current, ...partialUsuario };
    localStorage.setItem("usuario", JSON.stringify(merged));

    const accounts = get().accounts.map((acc) =>
      acc.usuario?._id === merged._id ? { ...acc, usuario: merged } : acc
    );
    persistAccounts(accounts);

    set({ usuario: merged, accounts });
  },

  logout: () => {
    const { usuario, removeAccount } = get();
    if (usuario?._id) {
      removeAccount(usuario._id);
    } else {
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
      resetSocket();
      useSavedProfilesStore.getState().reset();
      useStoryRingStore.getState().reset();
      set({ usuario: null, token: null, accounts: [] });
    }
  },
}));

export default useAuthStore;
