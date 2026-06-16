import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../store/authStore"
import api from "../api/axios"

export default function AuthCallback() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")

    if (!token) {
      navigate("/login?error=google_failed")
      return
    }

    // Limpiar el token de la URL
    window.history.replaceState({}, "", "/auth/callback")

    // Guardar token y cargar datos del usuario
    localStorage.setItem("token", token)

    api.get("/auth/me")
      .then((res) => {
        setAuth(res.data, token)
        navigate("/feed")
      })
      .catch(() => {
        localStorage.removeItem("token")
        navigate("/login?error=google_failed")
      })
  }, [])

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh", flexDirection: "column", gap: 16,
      fontFamily: "'Inter', sans-serif", background: "#ffffff"
    }}>
      <div style={{
        width: 36, height: 36,
        border: "3px solid #DADADA",
        borderTopColor: "#FF3D9E",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite"
      }} />
      <p style={{ color: "#444444", fontSize: 14, margin: 0 }}>Iniciando sesión...</p>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
