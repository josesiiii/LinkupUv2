// src/pages/LoginPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Check } from "lucide-react";
import { motion } from "framer-motion";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import RotatingEarth from "../components/auth/RotatingEarth";

// ── Design tokens ──────────────────────────────────────────────
const PINK        = "#cf5ef2";
const PINK_LIGHT  = "rgba(255, 61, 158, 0.23)";
const PINK_SHADOW = "rgba(255,61,158,0.25)";
const GRAY2       = "#666666";
const BORDER      = "#e8e8e8";
const INPUT_BG    = "#f6f6f6";

// Ruta del logo — ajusta si tu carpeta de assets es diferente
const LOGO_SRC = "Logo.webp";

const inputBase = {
  width: "100%", height: 54,
  background: INPUT_BG,
  border: "1.5px solid transparent",
  borderRadius: 14,
  padding: "0 18px",
  fontSize: 14, color: "#000",
  outline: "none", boxSizing: "border-box",
  fontFamily: "'Inter', sans-serif",
  transition: "border-color 250ms, box-shadow 250ms",
};

const focusIn  = (e) => { e.currentTarget.style.borderColor = PINK; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(255,61,158,0.10)"; };
const focusOut = (e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.boxShadow = "none"; };

// ── Role Selector (admin / usuario) ────────────────────────────
const ROLES = [
  { id: "user",  label: "Usuario",  desc: "Explorar y conectar",      emoji: "🌍" },
  { id: "admin", label: "Admin",    desc: "Gestionar la plataforma",   emoji: "⚙️" },
];

function RoleSelector({ value, onChange }) {
  const activeIdx = ROLES.findIndex((r) => r.id === value);
  return (
    <div style={{ position: "relative" }}>
      {/* Track vertical */}
      <div style={{
        position: "absolute", left: 0, top: 4, bottom: 4, width: 3,
        background: `linear-gradient(180deg, transparent, ${PINK} 40%, transparent)`,
        borderRadius: 4, opacity: 0.35,
      }} />
      {/* Glider animado */}
      {activeIdx >= 0 && (
        <motion.div
          layoutId="login-role-glider"
          style={{
            position: "absolute", left: 0, width: 3,
            height: `calc(${100 / ROLES.length}% - 8px)`,
            top: `calc(${(activeIdx / ROLES.length) * 100}% + 4px)`,
            background: PINK,
            borderRadius: 4,
            boxShadow: `0 0 8px ${PINK}, 0 0 18px rgba(255,61,158,0.35)`,
          }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
        />
      )}
      {ROLES.map((role, idx) => {
        const active = value === role.id;
        return (
          <motion.div
            key={role.id}
            onClick={() => onChange(role.id)}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.99 }}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px 11px 18px",
              cursor: "pointer",
              borderRadius: 12,
              background: active ? "rgba(255,61,158,0.07)" : "transparent",
              transition: "background 200ms",
              userSelect: "none",
            }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: active ? PINK : "#f0f0f0",
              border: active ? "none" : `1.5px solid ${BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 220ms",
              boxShadow: active ? `0 3px 12px ${PINK_SHADOW}` : "none",
              fontSize: 16,
            }}>
              {role.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: active ? PINK : "#111", transition: "color 200ms" }}>
                {role.label}
              </p>
              <p style={{ margin: "1px 0 0 0", fontSize: 11, color: active ? "rgba(255,61,158,0.65)" : "#aaa", transition: "color 200ms" }}>
                {role.desc}
              </p>
            </div>
            {active && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  width: 18, height: 18, borderRadius: "50%",
                  background: PINK,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Check size={10} color="#fff" />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth, token } = useAuthStore();

  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [role,         setRole]         = useState("user");

  useEffect(() => { if (token) navigate("/feed"); }, [token, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError("Completa todos los campos"); return; }
    setError(""); setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password, role });
      setAuth(res.data.usuario, res.data.token);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally { setLoading(false); }
  };

  const ready = email.trim() && password.trim();

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "#ffffff",
      display: "flex", overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ══════════════════════════════════════
          LEFT PANEL — Globo + Identidad
      ══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "50%", height: "100%",
          background: "linear-gradient(150deg, #fff9fc 0%, #fff0f7 55%, #ffe4f2 100%)",
          borderRight: `1px solid ${BORDER}`,
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          padding: "44px 52px",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* Ambient blobs */}
        <div style={{ position: "absolute", top: -160, left: -160, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,61,158,0.09) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -120, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,61,158,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

        {/* Logo + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, zIndex: 1 }}>
          <img
            src={LOGO_SRC}
            alt="LinkUp-U logo"
            style={{ width: 6, height: 6, objectFit: "contain", borderRadius: 8 }}
          />
          <span style={{ fontWeight: 800, fontSize: 19, color: "#000", letterSpacing: "-0.03em" }}>
            LINKUP
          </span>
        </div>

        {/* Headline */}
        <div style={{ zIndex: 1 }}>
          <motion.h1
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            style={{ fontSize: "clamp(1.9rem, 3vw, 2.7rem)", fontWeight: 800, color: "#000", lineHeight: 1.1, letterSpacing: "-0.035em", margin: "0 0 16px 0" }}
          >
            Meet people<br />
            <span style={{ color: PINK }}>across</span> the<br />world.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            style={{ fontSize: 15, color: GRAY2, lineHeight: 1.65, maxWidth: 340, margin: 0 }}
          >
            Discover real friendships, communities, and opportunities — without limits.
          </motion.p>
        </div>

        {/* Globe — sin recuadro, planeta grande y limpio */}
        <motion.div
          initial={{ opacity: 0, scale: 0.90 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.38, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1 }}
        >
          <RotatingEarth size={300} />
        </motion.div>

        <p style={{ fontSize: 11, color: "#ccc", margin: 0, zIndex: 1 }}>
          Drag to explore · Scroll to zoom
        </p>
      </motion.div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — Formulario
      ══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "50%", height: "100%",
          background: "linear-gradient(210deg, #fff0f7 0%, #ffffff 45%, #fff9fc 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "48px",
          position: "relative", overflow: "hidden",
          overflowY: "auto",
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
            border: `1px solid ${BORDER}`,
            borderRadius: 32, padding: "36px 40px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
            zIndex: 1,
          }}
        >
          {/* Back */}
          <Link to="/" style={{ fontSize: 13, color: "#aaa", textDecoration: "none", display: "block", marginBottom: 24 }}>
            ← Home
          </Link>

          {/* Logo centrado en el formulario */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <img
              src={LOGO_SRC}
              alt="LinkUp-U"
              style={{ width: 150, height: 150, objectFit: "contain" }}
            />
          </div>

          {/* Eyebrow + título */}
          <p style={{ fontSize: 11, fontWeight: 700, color: PINK, letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 8px 0", textAlign: "center" }}>
            WELCOME BACK
          </p>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#000", letterSpacing: "-0.03em", margin: "0 0 4px 0", textAlign: "center" }}>
            Sign In
          </h2>
          <p style={{ fontSize: 14, color: GRAY2, margin: "0 0 28px 0", textAlign: "center" }}>
            Continue building meaningful connections.
          </p>

          {/* Solo Google */}
          <button
            type="button"
            style={{
              width: "100%", height: 46, borderRadius: 12,
              background: "#fff", border: `1.5px solid ${BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              fontSize: 14, fontWeight: 500, color: "#333",
              cursor: "pointer", transition: "border-color 200ms, box-shadow 200ms",
              marginBottom: 20,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = PINK; e.currentTarget.style.boxShadow = `0 0 0 3px ${PINK_LIGHT}`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
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
            <div style={{ flex: 1, height: 1, background: BORDER }} />
            <span style={{ fontSize: 11, color: "#bbb", fontWeight: 500, letterSpacing: "0.05em" }}>O INICIA CON EMAIL</span>
            <div style={{ flex: 1, height: 1, background: BORDER }} />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 7 }}>Email</label>
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
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 7 }}>Contraseña</label>
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
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", color: "#aaa", cursor: "pointer", display: "flex", alignItems: "center", padding: 0, transition: "color 150ms" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = PINK)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#111", marginBottom: 8 }}>
                Ingresar como
              </label>
              <div style={{ background: INPUT_BG, borderRadius: 14, padding: "6px 2px", border: "1.5px solid transparent" }}>
                <RoleSelector value={role} onChange={setRole} />
              </div>
            </div>

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
              whileHover={ready && !loading ? { y: -2, boxShadow: `0 10px 28px ${PINK_SHADOW}` } : {}}
              whileTap={ready && !loading ? { scale: 0.98 } : {}}
              style={{
                width: "100%", height: 54,
                borderRadius: 14,
                background: ready ? PINK : "#f0f0f0",
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
                <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              ) : "Sign In"}
            </motion.button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: "center", fontSize: 14, color: GRAY2, margin: "18px 0 0 0" }}>
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              style={{ color: PINK, fontWeight: 600, textDecoration: "none" }}
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
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}