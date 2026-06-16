import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Mail } from "lucide-react"
import api from "../api/axios"
import RecaptchaField from "../components/RecaptchaField"
import Logo from "../components/ui/Logo"
import { LIGHT_COLORS as COLORS, getInputBase, getFocusIn, getFocusOut } from "../styles/authTheme"

const inputBase = getInputBase(COLORS)
const focusIn = getFocusIn(COLORS)
const focusOut = getFocusOut(COLORS)

export default function ForgotPassword() {
  const recaptchaRef = useRef(null)
  const [email, setEmail] = useState("")
  const [recaptchaToken, setRecaptchaToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Ingresa tu correo electrónico")
      return
    }

    if (!recaptchaToken) {
      setError("Por favor completa el reCAPTCHA")
      return
    }

    setError("")
    setLoading(true)

    try {
      await api.post("/auth/forgot-password", { email: email.trim(), recaptchaToken })
      setSuccess(true)
    } catch (err) {
      recaptchaRef.current?.reset()
      setRecaptchaToken(null)
      setError(err.response?.data?.message || "Ocurrió un error. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
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
              <Mail size={24} color={COLORS.pink} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.textDark, margin: "0 0 10px 0", letterSpacing: "-0.02em" }}>
              Revisa tu correo
            </h2>
            <p style={{ fontSize: 14, color: COLORS.textMid, lineHeight: 1.6, margin: "0 0 24px 0" }}>
              Si ese correo está registrado, recibirás un enlace para restablecer tu contraseña en los próximos minutos.
            </p>
            <Link
              to="/login"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 14, fontWeight: 600, color: COLORS.pink, textDecoration: "none"
              }}
            >
              <ArrowLeft size={14} /> Volver al inicio de sesión
            </Link>
          </motion.div>
        ) : (
          <>
            <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.pink, letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 8px 0", textAlign: "center" }}>
              Recuperar acceso
            </p>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: COLORS.textDark, letterSpacing: "-0.03em", margin: "0 0 6px 0", textAlign: "center" }}>
              ¿Olvidaste tu contraseña?
            </h2>
            <p style={{ fontSize: 14, color: COLORS.textMid, margin: "0 0 24px 0", textAlign: "center", lineHeight: 1.6 }}>
              Ingresa tu correo y te enviaremos un enlace para restablecerla.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.textDark, marginBottom: 7 }}>
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="tu@correo.edu.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={inputBase}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>

              <RecaptchaField ref={recaptchaRef} onChange={setRecaptchaToken} />

              {error && (
                <p style={{ fontSize: 12, color: "#cc0040", margin: 0, padding: "8px 12px", background: "#fff0f5", borderRadius: 10, border: "1px solid #ffc0d8" }}>
                  {error}
                </p>
              )}

              <motion.button
                type="submit"
                disabled={loading || !recaptchaToken}
                whileHover={!loading && recaptchaToken ? { y: -2, boxShadow: `0 10px 28px ${COLORS.pinkShadow}` } : {}}
                whileTap={!loading && recaptchaToken ? { scale: 0.98 } : {}}
                style={{
                  width: "100%", height: 52, borderRadius: 12,
                  background: recaptchaToken ? COLORS.pink : COLORS.surfaceAlt,
                  border: "none",
                  color: recaptchaToken ? "#fff" : "#bbb",
                  fontSize: 15, fontWeight: 700,
                  cursor: loading || !recaptchaToken ? "not-allowed" : "pointer",
                  transition: "background 250ms, color 250ms",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                {loading
                  ? <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  : "Enviar enlace"
                }
              </motion.button>
            </form>

            <p style={{ textAlign: "center", fontSize: 14, color: COLORS.textMid, margin: "18px 0 0 0" }}>
              <Link
                to="/login"
                style={{ color: COLORS.pink, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                <ArrowLeft size={13} /> Volver al inicio de sesión
              </Link>
            </p>
          </>
        )}
      </motion.div>

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } } * { box-sizing: border-box; }`}</style>
    </div>
  )
}
