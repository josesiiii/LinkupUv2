import { useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, EyeOff, CheckCircle } from "lucide-react"
import api from "../api/axios"
import Logo from "../components/ui/Logo"
import { LIGHT_COLORS as COLORS, getInputBase, getFocusIn, getFocusOut } from "../styles/authTheme"

const inputBase = getInputBase(COLORS)
const focusIn = getFocusIn(COLORS)
const focusOut = getFocusOut(COLORS)

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return
    }

    if (newPassword !== confirm) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      await api.post("/auth/reset-password", { token, newPassword })
      setSuccess(true)
      setTimeout(() => navigate("/login"), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "El enlace expiró o no es válido")
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <p style={{ fontSize: 16, color: COLORS.textMid, marginBottom: 16 }}>
            Enlace inválido. Solicita uno nuevo desde el login.
          </p>
          <Link to="/login" style={{ color: COLORS.pink, fontWeight: 600, textDecoration: "none" }}>
            Ir al inicio de sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#ffffff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', sans-serif", padding: "24px"
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%", maxWidth: 440,
          background: "#ffffff",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 24, padding: "40px",
          boxShadow: "0 1px 10px rgba(0,0,0,0.05)"
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <Logo size={44} showText textSize="1.3rem" textColor={COLORS.textDark} />
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center" }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "rgba(255,61,158,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              <CheckCircle size={28} color={COLORS.pink} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.textDark, margin: "0 0 10px 0", letterSpacing: "-0.02em" }}>
              ¡Contraseña actualizada!
            </h2>
            <p style={{ fontSize: 14, color: COLORS.textMid, lineHeight: 1.6, margin: 0 }}>
              Redirigiendo al inicio de sesión...
            </p>
          </motion.div>
        ) : (
          <>
            <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.pink, letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 8px 0", textAlign: "center" }}>
              Nueva contraseña
            </p>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: COLORS.textDark, letterSpacing: "-0.03em", margin: "0 0 6px 0", textAlign: "center" }}>
              Restablece tu contraseña
            </h2>
            <p style={{ fontSize: 14, color: COLORS.textMid, margin: "0 0 24px 0", textAlign: "center" }}>
              Elige una contraseña nueva y segura.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.textDark, marginBottom: 7 }}>
                  Nueva contraseña
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ ...inputBase, paddingRight: 52 }}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
                  >
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.textDark, marginBottom: 7 }}>
                  Confirmar contraseña
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repite la contraseña"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    style={{ ...inputBase, paddingRight: 52 }}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer", display: "flex", alignItems: "center", padding: 0 }}
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <p style={{ fontSize: 12, color: "#cc0040", margin: 0, padding: "8px 12px", background: "#fff0f5", borderRadius: 10, border: "1px solid #ffc0d8" }}>
                  {error}
                </p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { y: -2, boxShadow: `0 10px 28px ${COLORS.pinkShadow}` } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                style={{
                  width: "100%", height: 52, borderRadius: 12,
                  background: COLORS.pink, border: "none",
                  color: "#fff", fontSize: 15, fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginTop: 4
                }}
              >
                {loading
                  ? <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  : "Guardar contraseña"
                }
              </motion.button>
            </form>

            <p style={{ textAlign: "center", fontSize: 14, color: COLORS.textMid, margin: "18px 0 0 0" }}>
              <Link
                to="/login"
                style={{ color: COLORS.pink, fontWeight: 600, textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                Volver al inicio de sesión
              </Link>
            </p>
          </>
        )}
      </motion.div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } * { box-sizing: border-box; }`}</style>
    </div>
  )
}
