// src/pages/LoginPage.jsx

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../api/axios";
import useAuthStore from "../store/authStore";


export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth, token } = useAuthStore();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

  useEffect(() => {
    if (token) navigate("/feed");
  }, [token, navigate]);

const handleLogin = async (e) => {
  e.preventDefault();

  if (!email.trim() || !password.trim()) {
    setError("Completa todos los campos");
    return;
  }

  setError("");
  setLoading(true);

  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    setAuth(res.data.usuario, res.data.token);
    navigate("/feed");
  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Error al iniciar sesión"
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#080808",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* NAV */}
      <nav
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          padding: "16px 24px",
          zIndex: 20,
        }}
      >
        <Link
          to="/"
          className="nav-home-link"
          style={{
            fontSize: 13,
            color: "#666",
            textDecoration: "none",
            transition: "color 200ms",
          }}
        >
          ← Home
        </Link>
      </nav>

{/* Blob inferior izquierda - estilo Resend */}
<div
  style={{
    position: "absolute",
    bottom: -160,
    left: -160,
    width: 600,
    height: 600,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(209, 213, 219, 0.12) 0%, transparent 70%)",
    filter: "blur(140px)",
    pointerEvents: "none",
    zIndex: 0,
  }}
/>

      {/* Blob superior derecha - estilo Resend */}
<div
  style={{
    position: "absolute",
    top: -200,
    right: -200,
    width: 800,
    height: 800,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)",
    filter: "blur(150px)",
    pointerEvents: "none",
    zIndex: 0,
  }}
/>

      {/* FORM */}
      <div
        className="login-form-container"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 360,
          zIndex: 10,
        }}
      >
        {/* LOGO */}
        <div
          className="login-logo"
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M6 4h10c3.3 0 6 2.7 6 6s-2.7 6-6 6h-2l6 8H16l-5.5-8H10v8H6V4z M10 8v4h6a2 2 0 000-4h-6z"
              fill="white"
            />
          </svg>
        </div>

{/* TITULO */}
<div className="login-section" style={{ "--delay": "0.15s" }}>
  <h1
    style={{
      fontSize: 28,
      fontWeight: 600,
      color: "#ffffff",
      letterSpacing: "-0.02em",
      margin: "0 0 8px 0",
      textAlign: "center",
    }}
  >
    Log in to LinkUp
  </h1>

  <p
    style={{
      fontSize: 15,
      fontWeight: 400,
      color: "#9CA3AF",
      textAlign: "center",
      margin: "0 0 32px 0",
    }}
  >
    Connect. Learn. Grow.
  </p>
</div>

{/* Botones OAuth */}
<div
  className="login-section"
  style={{
    "--delay": "0.2s",
    display: "flex",
    gap: 10,
    marginBottom: 16,
  }}
>

</div>

{/* GOOGLE */}
<button
  type="button"
  className="oauth-btn"
  onMouseEnter={(e) => {
    e.currentTarget.style.background =
      "linear-gradient(180deg, #fff)";

    e.currentTarget.style.color = "#000";

    e.currentTarget.style.borderColor = "#000000";
    e.currentTarget.style.transform = "translateY(-1px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background =
      "linear-gradient(180deg, rgba(28,28,28,1) 0%, rgba(18,18,18,1) 100%)";

    e.currentTarget.style.color = "#fff";

    e.currentTarget.style.borderColor = "#222222";
    e.currentTarget.style.transform = "translateY(0)";
  }}
  style={{
    width: "100%",
    height: 42,
    background:
      "linear-gradient(180deg, rgba(28,28,28,1) 0%, rgba(18,18,18,1) 100%)",
    border: "1px solid #222222",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "0 12px",
    cursor: "pointer",
    transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  }}
>
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>

  <span
    style={{
      fontSize: 13,
      fontWeight: 400,
    }}
  >
    Google
  </span>
</button>

        {/* SEPARADOR */}
        <div
          className="login-section"
          style={{
            "--delay": "0.25s",
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />

          <span
            style={{
              fontSize: 12,
              color: "#444444",
              whiteSpace: "nowrap",
            }}
          >
            or
          </span>

          <div style={{ flex: 1, height: 1, background: "#1e1e1e" }} />
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin}>
          {/* EMAIL */}
<div
  className="login-section"
  style={{
    "--delay": "0.3s",
    marginBottom: 16,
  }}
>
  <label
    htmlFor="email"
    style={{
      display: "block",
      fontSize: 14,
      fontWeight: 500,
      color: "#E5E7EB",
      marginBottom: 8,
    }}
  >
    Email
  </label>

  <input
    id="email"
    type="email"
    placeholder="alan.turing@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    style={{
      width: "100%",
      height: 44,
      background: "#141414",
      border: "1px solid #2D2D2D",
      borderRadius: 12,
      padding: "0 16px",
      fontSize: 14,
      color: "#FFFFFF",
      outline: "none",
      boxSizing: "border-box",
      transition: "all 180ms ease",
    }}
    onFocus={(e) => {
      e.currentTarget.style.borderColor = "#4A4A4A";
      e.currentTarget.style.boxShadow =
        "0 0 0 3px rgba(255,255,255,0.05)";
    }}
    onBlur={(e) => {
      e.currentTarget.style.borderColor = "#2D2D2D";
      e.currentTarget.style.boxShadow = "none";
    }}
  />
</div>
          
            {/* PASSWORD */}
<div
  className="login-section"
  style={{
    "--delay": "0.35s",
    marginBottom: 12,
  }}
>
  <label
    htmlFor="password"
    style={{
      display: "block",
      fontSize: 14,
      fontWeight: 500,
      color: "#E5E7EB",
      marginBottom: 8,
    }}
  >
    Password
  </label>

  <div
    style={{
      position: "relative",
    }}
  >
    <input
      id="password"
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      style={{
        width: "100%",
        height: 44,
        background: "#141414",
        border: "1px solid #2D2D2D",
        borderRadius: 12,
        padding: "0 16px",
        paddingRight: 48,
        fontSize: 14,
        color: "#FFFFFF",
        outline: "none",
        boxSizing: "border-box",
        transition: "all 180ms ease",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "#4A4A4A";
        e.currentTarget.style.boxShadow =
          "0 0 0 3px rgba(255,255,255,0.05)";
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = "#2D2D2D";
        e.currentTarget.style.boxShadow = "none";
      }}
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: "absolute",
        right: 12,
        top: "50%",
        transform: "translateY(-50%)",
        background: "transparent",
        border: "none",
        color: "#888888",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
      }}
    >
      {showPassword ? (
        <EyeOff size={18} />
      ) : (
        <Eye size={18} />
      )}
    </button>
  </div>
</div>


          {/* ERROR */}
          {error && (
            <p
              style={{
                fontSize: 12,
                color: "#ef4444",
                margin: "0 0 8px 0",
              }}
            >
              {error}
            </p>
          )}

          {/* BOTON CONTINUE */}
<div className="login-section" style={{ "--delay": "0.4s" }}>
  <button
    type="submit"
    disabled={loading}
    style={{
  width: "100%",
  height: 44,
  borderRadius: 12,

  background:
    email.trim() && password.trim()
      ? "#ffffff"
      : "#191919",

  border:
    email.trim() && password.trim()
      ? "1px solid #ffffff"
      : "1px solid #282828",

  color:
    email.trim() && password.trim()
      ? "#000000"
      : "#666666",

  fontSize: 14,
  fontWeight: 600,

  cursor:
    email.trim() && password.trim() && !loading
      ? "pointer"
      : "not-allowed",

  transition: "all 220ms ease",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  boxShadow:
    email.trim() && password.trim()
      ? "0 0 30px rgba(255,255,255,0.15)"
      : "none",
}}
onMouseEnter={(e) => {
  if (
    email.trim() &&
    password.trim() &&
    !loading
  ) {
    e.currentTarget.style.background = "#ffffff";
    e.currentTarget.style.transform = "translateY(-2px)";
    e.currentTarget.style.boxShadow =
      "0 0 40px rgba(255,255,255,0.25)";
  }
}}

onMouseLeave={(e) => {
  if (
    email.trim() &&
    password.trim()
  ) {
    e.currentTarget.style.background = "#ffffff";
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow =
      "0 0 30px rgba(255,255,255,0.15)";
  } else {
    e.currentTarget.style.background = "#191919";
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "none";
  }
}}
  >
    {loading ? (
      <div
        style={{
          width: 16,
          height: 16,
          border: "2px solid rgba(0,0,0,0.2)",
          borderTopColor: "#000000",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }}
      />
    ) : (
      "Continue"
    )}
  </button>
</div>
        </form>

        {/* LEGAL */}
        <div
          className="login-section"
          style={{
            "--delay": "0.4s",
            marginTop: 20,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "#444444",
              margin: 0,
            }}
          >
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="legal-link"
              style={{
                color: "#666666",
                textDecoration: "underline",
              }}
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="legal-link"
              style={{
                color: "#666666",
                textDecoration: "underline",
              }}
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}