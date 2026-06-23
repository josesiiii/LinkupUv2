// src/pages/LoginPage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import RotatingEarth from "../components/auth/RotatingEarth";
import AuthHeader from "../components/auth/AuthHeader";
import Logo from "../components/ui/Logo";
import RecaptchaField from "../components/RecaptchaField";
import useResponsiveGlobeSize from "../hooks/useResponsiveGlobeSize";
import { LIGHT_COLORS as COLORS, getInputBase, getFocusIn, getFocusOut } from "../styles/authTheme";

const inputBase = getInputBase(COLORS);
const focusIn = getFocusIn(COLORS);
const focusOut = getFocusOut(COLORS);

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addingAccount = searchParams.get("addAccount") === "1";
  const { setAuth, token } = useAuthStore();
  const globeSize = useResponsiveGlobeSize();

  const recaptchaRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token && !addingAccount) navigate("/feed");
  }, [token, addingAccount, navigate]);

  // Mostrar error si Google OAuth falló
  useEffect(() => {
    if (searchParams.get("error") === "google_failed") {
      setError("Error al iniciar sesión con Google. Intenta de nuevo.");
    }
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Completa todos los campos"); return; }
    if (!recaptchaToken) { setError("Por favor completa el reCAPTCHA"); return; }
    setError(""); setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password, recaptchaToken });
      setAuth(res.data.usuario, res.data.token);
      navigate("/feed");
    } catch (err) {
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally { setLoading(false); }
  };

  const ready = email.trim() && password.trim() && recaptchaToken;

  return (
    <div className="auth-page" style={{
      width: "100%", minHeight: "100vh",
      background: "#ffffff",
      display: "flex",
      fontFamily: "'Inter', sans-serif",
      overflowX: "hidden",
    }}>

      {/* Encabezado global */}
      <div style={{ position: "absolute", top: 24, left: 28, zIndex: 20 }}>
        <AuthHeader />
      </div>

      {/* ══════════════════════════════════════
          LEFT PANEL — Planeta protagonista
      ══════════════════════════════════════ */}
      <motion.div
        className="auth-panel auth-panel-left"
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "50%", minHeight: "100vh",
          background: COLORS.surfaceAlt,
          borderRight: `1px solid ${COLORS.border}`,
          display: "flex", flexDirection: "column",
          justifyContent: "center",
          padding: "100px 48px 40px",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Ambient blob */}
        <div style={{ position: "absolute", top: -160, left: -160, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,61,158,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

        {/* Textos centrados encima del planeta */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, zIndex: 1, textAlign: "center" }}>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                fontSize: "clamp(1.9rem, 3.4vw, 2.8rem)", fontWeight: 700,
                color: COLORS.textDark, lineHeight: 1.12, letterSpacing: "-0.03em",
                margin: "0 0 14px 0", fontFamily: "'Inter', sans-serif",
              }}
            >
              Conecta con personas{" "}
              <span style={{
                background: COLORS.gradient,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                de todo el mundo
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{ fontSize: 15, color: COLORS.textMid, lineHeight: 1.65, maxWidth: 380, margin: "0 auto" }}
            >
              Descubre amistades reales, comunidades y oportunidades, sin límites.
            </motion.p>
          </div>

          {/* Globo — elemento protagonista */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <RotatingEarth size={globeSize} />
          </motion.div>
        </div>

        <p style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center", fontSize: 11, color: COLORS.textMuted, zIndex: 1, margin: 0 }}>
          Arrastra para explorar · Desliza para hacer zoom
        </p>
      </motion.div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — Formulario
      ══════════════════════════════════════ */}
      <motion.div
        className="auth-panel auth-panel-right"
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "50%", minHeight: "100vh",
          background: COLORS.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "48px",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -100, right: -100, width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,61,158,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "100%", maxWidth: 440,
            background: "#ffffff",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 24, padding: "40px",
            boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
            zIndex: 1,
          }}
        >
          {/* Logo centrado — punto focal visual */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
            <Logo size={72} showText={false} />
          </div>

          {/* Eyebrow + título */}
          <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.pink, letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 8px 0", textAlign: "center" }}>
            Bienvenido de nuevo
          </p>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: COLORS.textDark, letterSpacing: "-0.03em", margin: "0 0 4px 0", textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
            Iniciar sesión
          </h2>
          <p style={{ fontSize: 14, color: COLORS.textMid, margin: "0 0 28px 0", textAlign: "center" }}>
            Sigue construyendo conexiones con propósito.
          </p>

          {/* Solo Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            style={{
              width: "100%", height: 46, borderRadius: 12,
              background: "#fff", border: `1.5px solid ${COLORS.border}`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              fontSize: 14, fontWeight: 500, color: COLORS.textMid,
              cursor: "pointer", transition: "border-color 200ms, box-shadow 200ms",
              marginBottom: 20,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.pink; e.currentTarget.style.boxShadow = `0 0 0 3px ${COLORS.pinkLight}`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = "none"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: COLORS.border }} />
            <span style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 500, letterSpacing: "0.05em" }}>O INICIA CON EMAIL</span>
            <div style={{ flex: 1, height: 1, background: COLORS.border }} />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.textDark, marginBottom: 7 }}>Correo electrónico</label>
              <input
                type="email"
                placeholder="alan.turing@universidad.edu.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputBase}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.textDark }}>Contraseña</label>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: 12, color: COLORS.pink, fontWeight: 500, textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ ...inputBase, paddingRight: 52 }}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: COLORS.textMuted, cursor: "pointer", display: "flex", alignItems: "center", padding: 4, transition: "color 150ms", zIndex: 2 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.pink)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textMuted)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* reCAPTCHA */}
            <RecaptchaField ref={recaptchaRef} onChange={setRecaptchaToken} />

            {/* Error */}
            {error && (
              <p style={{ fontSize: 12, color: "#cc0040", margin: 0, padding: "8px 12px", background: "#fff0f5", borderRadius: 10, border: "1px solid #ffc0d8" }}>
                {error}
              </p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={ready && !loading ? { y: -2, boxShadow: `0 10px 28px ${COLORS.pinkShadow}` } : {}}
              whileTap={ready && !loading ? { scale: 0.98 } : {}}
              style={{
                width: "100%", height: 54,
                borderRadius: 12,
                background: ready ? COLORS.pink : COLORS.surfaceAlt,
                border: "none",
                color: ready ? "#fff" : "#bbb",
                fontSize: 15, fontWeight: 700,
                cursor: ready && !loading ? "pointer" : "not-allowed",
                transition: "background 250ms, color 250ms",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginTop: 2,
              }}
            >
              {loading ? (
                <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              ) : "Iniciar sesión"}
            </motion.button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: "center", fontSize: 14, color: COLORS.textMid, margin: "18px 0 0 0" }}>
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              style={{ color: COLORS.pink, fontWeight: 600, textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              Crear cuenta
            </Link>
          </p>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .auth-page, .auth-page * { box-sizing: border-box; }
        @media (max-width: 900px) {
          .auth-page { flex-direction: column; }
          .auth-panel-left, .auth-panel-right { width: 100% !important; min-height: auto !important; }
          .auth-panel-left { padding: 96px 24px 32px !important; border-right: none !important; border-bottom: 1px solid ${COLORS.border}; }
          .auth-panel-right { padding: 32px 20px !important; }
        }
      `}</style>
    </div>
  );
}
