// src/pages/LoginPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import AnimatedBackground from "../components/auth/AnimatedBackground";

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth, token } = useAuthStore();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  useEffect(() => {
    if (token) navigate("/feed");
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      setAuth(res.data.usuario, res.data.token);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">

      <AnimatedBackground />

      {/* Tarjeta flotante */}
      <div
        className="relative animate-form-entrance w-full"
        style={{
          maxWidth:    448,
          background:  "rgba(20, 25, 35, 0.85)",
          backdropFilter: "blur(12px)",
          border:      "1px solid rgba(79, 142, 247, 0.15)",
          boxShadow:   "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
          borderRadius: 24,
          padding:     32,
          zIndex:      10,
        }}
      >

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #4F8EF7, #7C5EF0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>
            🚀
          </div>
          <span style={{
            fontSize: 20, fontWeight: 700,
            color: "var(--login-text-primary)",
            letterSpacing: "-0.5px"
          }}>
            LinkUp – U
          </span>
        </div>

        {/* Título */}
        <h1 className="input-delay-1" style={{
          textAlign:  "center",
          fontSize:   28,
          fontWeight: 600,
          color:      "var(--login-text-primary)",
          marginBottom: 24,
          fontFamily: "'Syne', sans-serif",
        }}>
          Log in
        </h1>

        {/* Botones sociales */}
        <div className="input-delay-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <button className="btn-social" type="button">
            {/* Google SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button className="btn-social" type="button">
            {/* Facebook SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        {/* Divider */}
        <div className="input-delay-3" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: "var(--login-border-subtle)" }} />
          <span style={{
            fontSize: 13, color: "var(--login-text-muted)",
            background: "rgba(20, 25, 35, 0.85)",
            padding: "0 8px"
          }}>Or</span>
          <div style={{ flex: 1, height: 1, background: "var(--login-border-subtle)" }} />
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Email */}
          <div className="input-delay-3">
            <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--login-text-primary)", marginBottom: 8 }}>
              Email
            </label>
            <input
              type="email"
              placeholder="teajamica@gmail.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* Password */}
          <div className="input-delay-4">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 500, color: "var(--login-text-primary)" }}>
                Password
              </label>
              <a href="#" style={{ fontSize: 13, color: "var(--login-text-muted)", textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "var(--login-accent-primary)"}
                onMouseLeave={e => e.target.style.color = "var(--login-text-muted)"}
              >
                Forgot ?
              </a>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingRight: 44 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                style={{
                  position: "absolute", right: 14, top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  color: "var(--login-text-muted)", cursor: "pointer",
                  display: "flex", alignItems: "center",
                }}
              >
                <EyeIcon open={showPwd} />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p style={{ fontSize: 13, color: "var(--login-error)", margin: 0 }}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-submit input-delay-5"
          >
            {loading ? "Iniciando sesión..." : "Log in"}
          </button>

        </form>

        {/* Link a register */}
        <p className="input-delay-6" style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "var(--login-text-muted)" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "var(--login-accent-primary)", fontWeight: 500, textDecoration: "none" }}>
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}
