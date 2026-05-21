import { create } from "zustand";

const useAuthStore = create((set) => ({

  usuario: JSON.parse(
    localStorage.getItem("usuario")
  ) || null,

  token:
    localStorage.getItem("token") || null,

  setAuth: (usuario, token) => {

    localStorage.setItem(
      "usuario",
      JSON.stringify(usuario)
    );

    localStorage.setItem(
      "token",
      token
    );

    set({
      usuario,
      token
    });

  },

  logout: () => {

    localStorage.removeItem(
      "usuario"
    );

    localStorage.removeItem(
      "token"
    );

    set({
      usuario: null,
      token: null
    });

  }

}));

export default useAuthStore;