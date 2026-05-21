import { useEffect } from "react";
import {

  useState

} from "react";

import {

  useNavigate,

  Link

} from "react-router-dom";

import api from "../api/axios";

import useAuthStore from "../store/authStore";

function LoginPage() {

  const navigate = useNavigate();

  const setAuth =
    useAuthStore(
      (state) => state.setAuth
    );
    const token =
  useAuthStore(
    (state) => state.token
  );

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

    useEffect(() => {

  if (token) {

    navigate("/feed");

  }

}, [token]);

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await api.post(
        "/auth/login",
        {
          email,
          password
        }
      );

      setAuth(
        res.data.usuario,
        res.data.token
      );

      navigate("/feed");

    } catch (error) {

      setError(
        error.response?.data?.message ||
        "Error al iniciar sesión"
      );

    }

  };

  return (

    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">

      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-2xl w-[400px] space-y-4 shadow-xl"
      >

        <h1 className="text-3xl font-bold text-center">
          LinkUp 🚀
        </h1>

        <input
          type="email"
          placeholder="Correo institucional"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-800 outline-none"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full p-3 rounded-lg bg-zinc-800 outline-none"
        />

        {error && (

          <p className="text-red-500 text-sm">
            {error}
          </p>

        )}

        <button
          className="w-full bg-emerald-500 hover:bg-emerald-600 transition p-3 rounded-lg font-semibold"
        >
          Iniciar sesión
        </button>

        <p className="text-center text-zinc-400">

          ¿No tienes cuenta?{" "}

          <Link
            to="/register"
            className="text-emerald-400"
          >
            Regístrate
          </Link>

        </p>

      </form>

    </div>

  );

}

export default LoginPage;