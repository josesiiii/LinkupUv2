// src/pages/RegisterPage.jsx
import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import RotatingEarth from "../components/auth/RotatingEarth";
import AuthHeader from "../components/auth/AuthHeader";
import Logo from "../components/ui/Logo";
import RecaptchaField from "../components/RecaptchaField";
import useResponsiveGlobeSize from "../hooks/useResponsiveGlobeSize";
import { LIGHT_COLORS as COLORS, getInputBase, getLabelStyle, getFocusIn, getFocusOut } from "../styles/authTheme";

const inputBase = getInputBase(COLORS);
const labelStyle = getLabelStyle(COLORS);
const focusIn = getFocusIn(COLORS);
const focusOut = getFocusOut(COLORS);

// ── Intereses y objetivos ───────────────────────────────────────
const INTERESES = ["React","Node.js","MongoDB","Docker","Python","Machine Learning","Figma","UI/UX","JavaScript","TypeScript","AWS","IoT","Arduino","Ciberseguridad","SQL","Linux"];
const OBJETIVOS = ["Networking","Proyectos","Investigación","Emprendimiento","Estudio"];

// ── Selector de rol ──────────────────────────────────────────────
const ROLES = [
  { id: "user",    label: "Explorador",  desc: "Explora y conecta",        emoji: "🌍" },
  { id: "creator", label: "Creador",     desc: "Crea y comparte",          emoji: "✨" },
  { id: "admin",   label: "Profesional", desc: "Crece profesionalmente",   emoji: "💼" },
];

function RoleSelector({ value, onChange }) {
  const activeIdx = ROLES.findIndex((r) => r.id === value);

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Track */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: `linear-gradient(180deg, transparent, ${COLORS.pink}, transparent)`,
        borderRadius: 4, opacity: 0.4,
      }} />

      {/* Glider animado */}
      {activeIdx >= 0 && (
        <motion.div
          layoutId="role-glider"
          style={{
            position: "absolute", left: 0, width: 3,
            height: `${100 / ROLES.length}%`,
            top: `${(activeIdx / ROLES.length) * 100}%`,
            background: COLORS.pink,
            borderRadius: 4,
            boxShadow: `0 0 10px ${COLORS.pink}, 0 0 20px ${COLORS.pinkLight}`,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      {ROLES.map((role) => {
        const isActive = value === role.id;
        return (
          <motion.div
            key={role.id}
            onClick={() => onChange(role.id)}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.99 }}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 16px 14px 20px",
              cursor: "pointer",
              borderRadius: 12,
              background: isActive ? COLORS.pinkLight : "transparent",
              transition: "background 200ms",
              userSelect: "none",
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: isActive ? COLORS.pink : COLORS.surfaceAlt,
              border: isActive ? "none" : `1.5px solid ${COLORS.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 200ms",
              boxShadow: isActive ? `0 4px 14px ${COLORS.pinkShadow}` : "none",
            }}>
              <span style={{ fontSize: 15 }}>{role.emoji}</span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: isActive ? COLORS.textDark : COLORS.textDark, transition: "color 200ms" }}>
                {role.label}
              </p>
              <p style={{ margin: "1px 0 0 0", fontSize: 12, color: isActive ? COLORS.textMid : COLORS.textMuted, transition: "color 200ms" }}>
                {role.desc}
              </p>
            </div>
            {isActive && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", background: COLORS.pink, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <Check size={11} color="#fff" />
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const globeSize = useResponsiveGlobeSize();

  const recaptchaRef = useRef(null);
  const [step,    setStep]    = useState(1);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  // Paso 1
  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);

  // Institución
  const [institution,    setInstitution]    = useState("");
  const [campuses,       setCampuses]       = useState([]);
  const [currentCampus,  setCurrentCampus]  = useState("");
  const [faculties,      setFaculties]      = useState([]);
  const [loadingCampus,  setLoadingCampus]  = useState(false);

  // Paso 2
  const [role,       setRole]       = useState("user");
  const [career,     setCareer]     = useState("");
  const [faculty,    setFaculty]    = useState("");
  const [semester,   setSemester]   = useState(1);
  const [bio,        setBio]        = useState("");
  const [interests,  setInterests]  = useState([]);
  const [objectives, setObjectives] = useState([]);

  const handleEmailBlur = async () => {
    if (!email.includes("@") || !email.includes(".")) return;
    setLoadingCampus(true);
    setInstitution(""); setCampuses([]); setCurrentCampus(""); setFaculties([]);
    try {
      const { data } = await api.get(`/institutions/campuses?email=${email}`);
      setInstitution(data.institution);
      setCampuses(data.campuses);
      setFaculties(data.faculties ?? []);
    } catch { setInstitution(""); setCampuses([]); setFaculties([]); }
    finally { setLoadingCampus(false); }
  };

  const toggleChip = (item, list, setList) =>
    setList((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]);

  const goToStep2 = () => {
    if (!fullName || !email || !password || !currentCampus) { setError("Completa todos los campos"); return; }
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres"); return; }
    if (!recaptchaToken) { setError("Por favor completa el reCAPTCHA"); return; }
    setError(""); setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        fullName, email, password,
        currentCampus,
        institution,
        career, faculty, semester: Number(semester),
        bio, interests, objectives, role,
        recaptchaToken,
      });
      setAuth(res.data.usuario, res.data.token);
      navigate("/feed");
    } catch (err) {
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
      setError(err.response?.data?.message || "Error al registrarse");
    } finally { setLoading(false); }
  };

  // Indicador de progreso
  const steps = [
    { n: 1, label: "Tu cuenta",  desc: "Nombre, correo y contraseña" },
    { n: 2, label: "Tu perfil",  desc: "Carrera, intereses y objetivos" },
  ];

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

      {/* ═══════════════════════════════════════
          LEFT PANEL — Planeta + progreso
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
          justifyContent: "center", gap: 28,
          padding: "100px 48px 40px",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -160, left: -160, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,61,158,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

        {/* Textos centrados */}
        <div style={{ zIndex: 1, textAlign: "center" }}>
          <motion.h1
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              fontSize: "clamp(1.9rem, 3.4vw, 2.8rem)", fontWeight: 700,
              color: COLORS.textDark, lineHeight: 1.12, letterSpacing: "-0.03em",
              margin: "0 0 14px 0", fontFamily: "'Inter', sans-serif",
            }}
          >
            Tu red de contactos{" "}
            <span style={{
              background: COLORS.gradient,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              empieza aquí
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ fontSize: 15, color: COLORS.textMid, lineHeight: 1.65, maxWidth: 380, margin: "0 auto" }}
          >
            Crea tu perfil y conecta con personas que comparten tus intereses, carrera y objetivos.
          </motion.p>
        </div>

        {/* Globo — elemento protagonista */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1 }}
        >
          <RotatingEarth size={globeSize} />
        </motion.div>

        {/* Indicadores de paso */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ display: "flex", flexDirection: "column", gap: 10, zIndex: 1 }}
        >
          {steps.map((s) => (
            <div key={s.n} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px",
              background: step >= s.n ? COLORS.pinkLight : "rgba(255,255,255,0.5)",
              border: `1px solid ${step >= s.n ? COLORS.border : "rgba(255,61,158,0.10)"}`,
              borderRadius: 12, transition: "all 300ms",
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                background: step > s.n ? COLORS.pink : step === s.n ? COLORS.pinkLight : COLORS.surfaceAlt,
                border: `1.5px solid ${step >= s.n ? COLORS.pink : COLORS.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
                color: step > s.n ? "#fff" : step === s.n ? COLORS.textDark : "#aaa",
                transition: "all 300ms",
              }}>
                {step > s.n ? <Check size={13} /> : s.n}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: step >= s.n ? COLORS.textDark : "#aaa" }}>{s.label}</p>
                <p style={{ margin: "1px 0 0 0", fontSize: 11, color: COLORS.textMuted }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════
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
          display: "flex", justifyContent: "center", alignItems: "flex-start",
          padding: "100px 48px 40px",
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
            borderRadius: 24, padding: "36px 40px",
            boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
            zIndex: 1,
          }}
        >
          {/* Logo centrado — punto focal visual */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 28 }}>
            <Logo size={72} showText={false} />
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
            {[1, 2].map((s) => (
              <motion.div key={s}
                animate={{ background: step >= s ? COLORS.pink : COLORS.surfaceAlt }}
                transition={{ duration: 0.3 }}
                style={{ flex: 1, height: 3, borderRadius: 4 }}
              />
            ))}
          </div>

          <p style={{ fontSize: 11, fontWeight: 700, color: COLORS.pink, letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 10px 0", textAlign: "center" }}>
            {step === 1 ? "Crear cuenta" : "Tu perfil"}
          </p>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: COLORS.textDark, letterSpacing: "-0.03em", margin: "0 0 6px 0", textAlign: "center", fontFamily: "'Inter', sans-serif" }}>
            {step === 1 ? "Únete a LinkUp" : "Personaliza tu perfil"}
          </h2>
          <p style={{ fontSize: 14, color: COLORS.textMid, margin: "0 0 24px 0", textAlign: "center" }}>
            {step === 1 ? "Tu información básica para empezar." : "Cuéntanos quién eres y qué buscas."}
          </p>

          <AnimatePresence mode="wait">
            {/* ─── PASO 1 ─────────────────────────────── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.28 }}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div>
                  <label style={labelStyle}>Nombre completo</label>
                  <input type="text" placeholder="Juan Pérez" value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputBase} onFocus={focusIn} onBlur={focusOut} />
                </div>

                <div>
                  <label style={labelStyle}>Correo institucional</label>
                  <input type="email" placeholder="juan@itm.edu.co" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailBlur} style={inputBase} onFocus={focusIn} />
                  {loadingCampus && <p style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 5 }}>Detectando institución...</p>}
                  {institution && <p style={{ fontSize: 12, color: "#00a86b", marginTop: 5, fontWeight: 600 }}>✓ {institution}</p>}
                </div>

                <div>
                  <label style={labelStyle}>Contraseña</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPwd ? "text" : "password"} placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputBase, paddingRight: 48 }} onFocus={focusIn} onBlur={focusOut} />
                    <button type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowPwd((v) => !v)}
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", display: "flex", alignItems: "center", padding: 4, transition: "color 150ms", zIndex: 2 }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.pink)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textMuted)}
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {campuses.length > 0 && (
                  <div>
                    <label style={labelStyle}>Campus</label>
                    <select value={currentCampus} onChange={(e) => setCurrentCampus(e.target.value)}
                      style={{ ...inputBase, cursor: "pointer", appearance: "auto" }}
                      onFocus={focusIn} onBlur={focusOut}
                    >
                      <option value="">Selecciona tu campus</option>
                      {campuses.map((c) => <option key={c.id} value={c.id}>{c.label} — {c.city}</option>)}
                    </select>
                  </div>
                )}

                <RecaptchaField ref={recaptchaRef} onChange={setRecaptchaToken} />

                {error && <p style={{ fontSize: 12, color: "#cc0040", margin: 0, padding: "8px 12px", background: "#fff0f5", borderRadius: 10, border: "1px solid #ffc0d8" }}>{error}</p>}

                <motion.button type="button" onClick={goToStep2}
                  whileHover={{ y: -2, boxShadow: `0 10px 28px ${COLORS.pinkShadow}` }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: "100%", height: 52, borderRadius: 12, background: COLORS.pink, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}
                >
                  Continuar →
                </motion.button>

                <p style={{ textAlign: "center", fontSize: 14, color: COLORS.textMid, margin: 0 }}>
                  ¿Ya tienes cuenta?{" "}
                  <Link to="/login" style={{ color: COLORS.pink, fontWeight: 600, textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >Iniciar sesión</Link>
                </p>
              </motion.div>
            )}

            {/* ─── PASO 2 ─────────────────────────────── */}
            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.28 }}
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {/* Selector de rol */}
                <div>
                  <label style={{ ...labelStyle, marginBottom: 10 }}>Rol en LinkUp</label>
                  <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 16, padding: "8px 4px", border: `1.5px solid ${COLORS.border}` }}>
                    <RoleSelector value={role} onChange={setRole} />
                  </div>
                </div>

                {faculties.length > 0 ? (() => {
                  const availableCareers = faculties.find(f => f.name === faculty)?.careers ?? [];
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Facultad</label>
                        <select
                          value={faculty}
                          onChange={e => { setFaculty(e.target.value); setCareer(""); }}
                          style={{ ...inputBase, height: 46, cursor: "pointer", appearance: "auto" }}
                          onFocus={focusIn} onBlur={focusOut}
                        >
                          <option value="">Selecciona tu facultad</option>
                          {faculties.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                        </select>
                      </div>
                      {availableCareers.length > 0 && (
                        <div>
                          <label style={labelStyle}>Carrera</label>
                          <select
                            value={career}
                            onChange={e => setCareer(e.target.value)}
                            style={{ ...inputBase, height: 46, cursor: "pointer", appearance: "auto" }}
                            onFocus={focusIn} onBlur={focusOut}
                          >
                            <option value="">Selecciona tu carrera</option>
                            {availableCareers.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })() : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Carrera</label>
                      <input type="text" placeholder="Ing. de Sistemas" value={career} onChange={(e) => setCareer(e.target.value)} style={{ ...inputBase, height: 46 }} onFocus={focusIn} onBlur={focusOut} />
                    </div>
                    <div>
                      <label style={labelStyle}>Facultad</label>
                      <input type="text" placeholder="Ing. y Sistemas" value={faculty} onChange={(e) => setFaculty(e.target.value)} style={{ ...inputBase, height: 46 }} onFocus={focusIn} onBlur={focusOut} />
                    </div>
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Semestre</label>
                  <select value={semester} onChange={(e) => setSemester(e.target.value)}
                    style={{ ...inputBase, height: 46, cursor: "pointer", appearance: "auto" }}
                    onFocus={focusIn} onBlur={focusOut}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((s) => (
                      <option key={s} value={s}>Semestre {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Bio <span style={{ fontWeight: 400, color: COLORS.textMuted }}>(opcional)</span></label>
                  <textarea
                    placeholder="Cuéntanos quién eres..."
                    value={bio} onChange={(e) => setBio(e.target.value)}
                    maxLength={300}
                    style={{ width: "100%", minHeight: 72, resize: "none", background: "rgba(255,255,255,0.6)", border: `1.5px solid ${COLORS.border}`, borderRadius: 14, padding: "10px 14px", color: COLORS.textDark, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 250ms, box-shadow 250ms" }}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </div>

                {/* Intereses */}
                <div>
                  <label style={labelStyle}>Intereses</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {INTERESES.map((item) => (
                      <motion.button key={item} type="button"
                        onClick={() => toggleChip(item, interests, setInterests)}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        style={{
                          padding: "5px 12px", borderRadius: 20,
                          fontSize: 12, fontWeight: 500, cursor: "pointer",
                          background: interests.includes(item) ? COLORS.pink : COLORS.surfaceAlt,
                          border: `1.5px solid ${interests.includes(item) ? COLORS.pink : COLORS.border}`,
                          color: interests.includes(item) ? "#fff" : COLORS.textMid,
                          transition: "all 150ms",
                        }}
                      >
                        {item}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Objetivos */}
                <div>
                  <label style={labelStyle}>¿Qué buscas en LinkUp?</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {OBJETIVOS.map((item) => (
                      <motion.button key={item} type="button"
                        onClick={() => toggleChip(item, objectives, setObjectives)}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        style={{
                          padding: "5px 12px", borderRadius: 20,
                          fontSize: 12, fontWeight: 500, cursor: "pointer",
                          background: objectives.includes(item) ? COLORS.pink : COLORS.surfaceAlt,
                          border: `1.5px solid ${objectives.includes(item) ? COLORS.pink : COLORS.border}`,
                          color: objectives.includes(item) ? "#fff" : COLORS.textMid,
                          transition: "all 150ms",
                        }}
                      >
                        {item}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {error && <p style={{ fontSize: 12, color: "#cc0040", margin: 0, padding: "8px 12px", background: "#fff0f5", borderRadius: 10, border: "1px solid #ffc0d8" }}>{error}</p>}

                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" onClick={() => setStep(1)}
                    style={{ flex: 1, height: 52, borderRadius: 12, background: COLORS.surfaceAlt, border: `1.5px solid ${COLORS.border}`, color: COLORS.textMid, fontWeight: 600, cursor: "pointer", fontSize: 14, transition: "all 200ms" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.pink; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; }}
                  >
                    ← Volver
                  </button>
                  <motion.button type="submit" disabled={loading}
                    whileHover={!loading ? { y: -2, boxShadow: `0 10px 28px ${COLORS.pinkShadow}` } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    style={{ flex: 2, height: 52, borderRadius: 12, background: COLORS.pink, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {loading ? <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> : "Crear cuenta"}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .auth-page, .auth-page * { box-sizing: border-box; }
        select option { background: #fff; color: ${COLORS.textDark}; }
        @media (max-width: 900px) {
          .auth-page { flex-direction: column; }
          .auth-panel-left, .auth-panel-right { width: 100% !important; min-height: auto !important; }
          .auth-panel-left { padding: 96px 24px 32px !important; border-right: none !important; border-bottom: 1px solid ${COLORS.border}; }
          .auth-panel-right { padding: 32px 20px !important; align-items: center !important; }
        }
      `}</style>
    </div>
  );
}
