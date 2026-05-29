// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import AnimatedBackground from "../components/auth/AnimatedBackground";

const INTERESES = [
  "React", "Node.js", "MongoDB", "Docker", "Python",
  "Machine Learning", "Figma", "UI/UX", "JavaScript",
  "TypeScript", "AWS", "IoT", "Arduino", "Ciberseguridad",
  "SQL", "HTML", "CSS", "Linux",
];

const OBJETIVOS = [
  "Networking", "Proyectos", "Investigación",
  "Emprendimiento", "Estudio",
];

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

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [step, setStep]     = useState(1);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  // Paso 1
  const [fullName, setFullName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPwd, setShowPwd]     = useState(false);

  // Institución
  const [institution, setInstitution]     = useState("");
  const [campuses, setCampuses]           = useState([]);
  const [campus, setCampus]               = useState("");
  const [loadingCampus, setLoadingCampus] = useState(false);

  // Paso 2
  const [career, setCareer]       = useState("");
  const [faculty, setFaculty]     = useState("");
  const [semester, setSemester]   = useState(1);
  const [bio, setBio]             = useState("");
  const [interests, setInterests] = useState([]);
  const [objectives, setObjectives] = useState([]);

  const handleEmailBlur = async () => {
    if (!email.includes("@") || !email.includes(".")) return;
    setLoadingCampus(true);
    setInstitution("");
    setCampuses([]);
    setCampus("");
    try {
      const { data } = await api.get(`/institutions/campuses?email=${email}`);
      setInstitution(data.institution);
      setCampuses(data.campuses);
    } catch {
      setInstitution("");
      setCampuses([]);
    } finally {
      setLoadingCampus(false);
    }
  };

  const toggleChip = (item, list, setList) => {
    setList(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const goToStep2 = () => {
    if (!fullName || !email || !password || !campus) {
      setError("Completa todos los campos del paso 1");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        fullName, email, password,
        campus, career, faculty,
        semester: Number(semester),
        bio, interests, objectives,
      });
      setAuth(res.data.usuario, res.data.token);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    maxWidth:     448,
    width:        "100%",
    background:   "rgba(20, 25, 35, 0.85)",
    backdropFilter: "blur(12px)",
    border:       "1px solid rgba(79, 142, 247, 0.15)",
    boxShadow:    "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
    borderRadius: 24,
    padding:      32,
    zIndex:       10,
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10">

      <AnimatedBackground />

      <div className="relative animate-form-entrance" style={cardStyle}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #4F8EF7, #7C5EF0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>🚀</div>
          <span style={{ fontSize: 20, fontWeight: 700, color: "var(--login-text-primary)", letterSpacing: "-0.5px" }}>
            LinkUp – U
          </span>
        </div>

        {/* Título */}
        <h1 style={{
          textAlign: "center", fontSize: 28, fontWeight: 600,
          color: "var(--login-text-primary)", marginBottom: 8,
          fontFamily: "'Syne', sans-serif",
        }}>
          Create an account
        </h1>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--login-text-muted)", marginBottom: 20 }}>
          {step === 1 ? "Tu información básica" : "Personaliza tu perfil"}
        </p>

        {/* Barra de progreso */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 4,
              background: step >= s
                ? "linear-gradient(90deg, #4F8EF7, #7C5EF0)"
                : "var(--login-border-subtle)",
              transition: "background 300ms",
            }} />
          ))}
        </div>

        {/* ── PASO 1 ── */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div className="input-delay-1">
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--login-text-primary)", marginBottom: 8 }}>
                Nombre completo
              </label>
              <input
                type="text"
                placeholder="Juan Pérez"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="input-delay-2">
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--login-text-primary)", marginBottom: 8 }}>
                Correo institucional
              </label>
              <input
                type="email"
                placeholder="juan@itm.edu.co"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                className="input-field"
                required
              />
              {loadingCampus && (
                <p style={{ fontSize: 12, color: "var(--login-text-muted)", marginTop: 6 }}>
                  Detectando institución...
                </p>
              )}
              {institution && (
                <p style={{ fontSize: 12, color: "#34D399", marginTop: 6 }}>
                  ✓ {institution}
                </p>
              )}
            </div>

            <div className="input-delay-3">
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--login-text-primary)", marginBottom: 8 }}>
                Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingRight: 44 }}
                  required
                  minLength={8}
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

            {/* Campus */}
            {campuses.length > 0 && (
              <div className="input-delay-4">
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--login-text-primary)", marginBottom: 8 }}>
                  Campus
                </label>
                <select
                  value={campus}
                  onChange={e => setCampus(e.target.value)}
                  className="input-field"
                  style={{ cursor: "pointer" }}
                  required
                >
                  <option value="">Selecciona tu campus</option>
                  {campuses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.label} — {c.city}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <p style={{ fontSize: 13, color: "var(--login-error)" }}>{error}</p>
            )}

            <button
              type="button"
              onClick={goToStep2}
              className="btn-submit input-delay-5"
            >
              Siguiente →
            </button>

            <p style={{ textAlign: "center", fontSize: 14, color: "var(--login-text-muted)", marginTop: 4 }}>
              Already have an account?{" "}
              <Link to="/" style={{ color: "var(--login-accent-primary)", fontWeight: 500, textDecoration: "none" }}>
                Log In
              </Link>
            </p>

          </div>
        )}

        {/* ── PASO 2 ── */}
        {step === 2 && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="input-delay-1">
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--login-text-primary)", marginBottom: 8 }}>
                  Carrera
                </label>
                <input
                  type="text"
                  placeholder="Ing. de Sistemas"
                  value={career}
                  onChange={e => setCareer(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="input-delay-1">
                <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--login-text-primary)", marginBottom: 8 }}>
                  Facultad
                </label>
                <input
                  type="text"
                  placeholder="Facultad de Ingeniería"
                  value={faculty}
                  onChange={e => setFaculty(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>

            <div className="input-delay-2">
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--login-text-primary)", marginBottom: 8 }}>
                Semestre
              </label>
              <select
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="input-field"
                style={{ cursor: "pointer" }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map(s => (
                  <option key={s} value={s}>Semestre {s}</option>
                ))}
              </select>
            </div>

            <div className="input-delay-3">
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--login-text-primary)", marginBottom: 8 }}>
                Bio <span style={{ color: "var(--login-text-muted)", fontWeight: 400 }}>(opcional)</span>
              </label>
              <textarea
                placeholder="Cuéntanos quién eres..."
                value={bio}
                onChange={e => setBio(e.target.value)}
                style={{
                  width: "100%", minHeight: 72, resize: "none",
                  background: "var(--login-bg-elevated)",
                  border: "1px solid var(--login-border-subtle)",
                  borderRadius: 12, padding: "12px 16px",
                  color: "var(--login-text-primary)", fontSize: 14,
                  outline: "none", maxLength: 300,
                }}
                onFocus={e => {
                  e.target.style.borderColor = "var(--login-border-focus)";
                  e.target.style.boxShadow = "0 0 0 3px var(--login-accent-glow)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "var(--login-border-subtle)";
                  e.target.style.boxShadow = "none";
                }}
                maxLength={300}
              />
            </div>

            {/* Intereses */}
            <div className="input-delay-4">
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--login-text-primary)", marginBottom: 10 }}>
                Intereses
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {INTERESES.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleChip(item, interests, setInterests)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 500,
                      border: "1px solid",
                      cursor: "pointer",
                      transition: "all 150ms",
                      background: interests.includes(item)
                        ? "linear-gradient(135deg, #4F8EF7, #7C5EF0)"
                        : "var(--login-bg-elevated)",
                      borderColor: interests.includes(item)
                        ? "transparent"
                        : "var(--login-border-subtle)",
                      color: interests.includes(item)
                        ? "#ffffff"
                        : "var(--login-text-muted)",
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Objetivos */}
            <div className="input-delay-5">
              <label style={{ display: "block", fontSize: 14, fontWeight: 500, color: "var(--login-text-primary)", marginBottom: 10 }}>
                ¿Qué buscas en LinkUp?
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {OBJETIVOS.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleChip(item, objectives, setObjectives)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 500,
                      border: "1px solid",
                      cursor: "pointer",
                      transition: "all 150ms",
                      background: objectives.includes(item)
                        ? "linear-gradient(135deg, #4F8EF7, #7C5EF0)"
                        : "var(--login-bg-elevated)",
                      borderColor: objectives.includes(item)
                        ? "transparent"
                        : "var(--login-border-subtle)",
                      color: objectives.includes(item)
                        ? "#ffffff"
                        : "var(--login-text-muted)",
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p style={{ fontSize: 13, color: "var(--login-error)" }}>{error}</p>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  flex: 1, height: 48, borderRadius: 12,
                  background: "var(--login-bg-elevated)",
                  border: "1px solid var(--login-border-subtle)",
                  color: "var(--login-text-muted)",
                  fontWeight: 500, cursor: "pointer",
                  transition: "border-color 200ms",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--login-border-focus)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--login-border-subtle)"}
              >
                ← Volver
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-submit"
                style={{ flex: 2 }}
              >
                {loading ? "Creando cuenta..." : "Create account"}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
