// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import RotatingEarth from "../components/auth/RotatingEarth";

// ── Design tokens ──────────────────────────────────────────────
const PINK        = "#cf5ef2";
const PINK_LIGHT  = "rgba(255,61,158,0.10)";
const PINK_SHADOW = "rgba(255,61,158,0.25)";
const GRAY2       = "#666666";
const BORDER      = "#e8e8e8";
const LOGO_SRC    = "/Logo.webp";
const INPUT_BG    = "#f6f6f6";

const inputBase = {
  width: "100%", height: 52,
  background: INPUT_BG,
  border: "1.5px solid transparent",
  borderRadius: 14,
  padding: "0 16px",
  fontSize: 14, color: "#000",
  outline: "none", boxSizing: "border-box",
  fontFamily: "'Inter', sans-serif",
  transition: "border-color 250ms, box-shadow 250ms",
};

const labelStyle = {
  display: "block", fontSize: 13,
  fontWeight: 600, color: "#111", marginBottom: 7,
};

const focusIn  = (e) => { e.currentTarget.style.borderColor = PINK; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(255,61,158,0.10)"; };
const focusOut = (e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.boxShadow = "none"; };

// ── Interests & Objectives ─────────────────────────────────────
const INTERESES = ["React","Node.js","MongoDB","Docker","Python","Machine Learning","Figma","UI/UX","JavaScript","TypeScript","AWS","IoT","Arduino","Ciberseguridad","SQL","Linux"];
const OBJETIVOS = ["Networking","Proyectos","Investigación","Emprendimiento","Estudio"];

// ── Role Selector component ────────────────────────────────────
const ROLES = [
  { id: "user",      label: "Explorer",    desc: "Explora y conecta" },
  { id: "creator",   label: "Creator",     desc: "Crea y comparte" },
  { id: "admin",     label: "Professional",desc: "Crece profesionalmente" },
];

function RoleSelector({ value, onChange }) {
  const activeIdx = ROLES.findIndex((r) => r.id === value);

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Glowing pink track */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: `linear-gradient(180deg, transparent, ${PINK}, transparent)`,
        borderRadius: 4, opacity: 0.4,
      }} />

      {/* Animated glider */}
      {activeIdx >= 0 && (
        <motion.div
          layoutId="role-glider"
          style={{
            position: "absolute", left: 0, width: 3,
            height: `${100 / ROLES.length}%`,
            top: `${(activeIdx / ROLES.length) * 100}%`,
            background: PINK,
            borderRadius: 4,
            boxShadow: `0 0 10px ${PINK}, 0 0 20px rgba(255,61,158,0.4)`,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      {ROLES.map((role, idx) => {
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
              background: isActive ? "rgba(255,61,158,0.06)" : "transparent",
              transition: "background 200ms",
              userSelect: "none",
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: isActive ? PINK : "#f0f0f0",
              border: isActive ? "none" : `1.5px solid ${BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 200ms",
              boxShadow: isActive ? `0 4px 14px ${PINK_SHADOW}` : "none",
            }}>
              <span style={{ fontSize: 15 }}>
                {idx === 0 ? "🌍" : idx === 1 ? "✨" : "💼"}
              </span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: isActive ? PINK : "#111", transition: "color 200ms" }}>
                {role.label}
              </p>
              <p style={{ margin: "1px 0 0 0", fontSize: 12, color: isActive ? "rgba(255,61,158,0.7)" : "#aaa", transition: "color 200ms" }}>
                {role.desc}
              </p>
            </div>
            {isActive && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center" }}
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

// ── Main Component ─────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [step,    setStep]    = useState(1);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1
  const [fullName, setFullName] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);

  // Institution
  const [institution,    setInstitution]    = useState("");
  const [campuses,       setCampuses]       = useState([]);
  const [campus,         setCampus]         = useState("");
  const [loadingCampus,  setLoadingCampus]  = useState(false);

  // Step 2
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
    setInstitution(""); setCampuses([]); setCampus("");
    try {
      const { data } = await api.get(`/institutions/campuses?email=${email}`);
      setInstitution(data.institution);
      setCampuses(data.campuses);
    } catch { setInstitution(""); setCampuses([]); }
    finally { setLoadingCampus(false); }
  };

  const toggleChip = (item, list, setList) =>
    setList((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]);

  const goToStep2 = () => {
    if (!fullName || !email || !password || !campus) { setError("Completa todos los campos"); return; }
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres"); return; }
    setError(""); setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        fullName, email, password, campus,
        career, faculty, semester: Number(semester),
        bio, interests, objectives,
      });
      setAuth(res.data.usuario, res.data.token);
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Error al registrarse");
    } finally { setLoading(false); }
  };

  // Step progress indicator
  const steps = [
    { n: 1, label: "Tu cuenta",  desc: "Nombre, email y contraseña" },
    { n: 2, label: "Tu perfil",  desc: "Carrera, intereses y objetivos" },
  ];

  return (
    <div style={{
      width: "100vw", minHeight: "100vh",
      background: "#ffffff",
      display: "flex", overflow: "hidden",
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ═══════════════════════════════════════
          LEFT PANEL — Globe + Identity
      ══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: -28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "50%", minHeight: "100vh",
          background: "linear-gradient(150deg, #fff9fc 0%, #fff0f7 55%, #ffe4f2 100%)",
          borderRight: `1px solid ${BORDER}`,
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          padding: "44px 48px",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -160, left: -160, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,61,158,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -120, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,61,158,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, zIndex: 1 }}>
          <img src={LOGO_SRC} alt="LinkUp-U logo" style={{ width: 100, height: 100, objectFit: "contain", borderRadius: 8 }} />
          <span style={{ fontWeight: 800, fontSize: 19, color: "#000", letterSpacing: "-0.03em" }}>LINKUP</span>
        </div>

        {/* Headline */}
        <div style={{ zIndex: 1 }}>
          <motion.h1
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            style={{ fontSize: "clamp(1.9rem, 3vw, 2.7rem)", fontWeight: 800, color: "#000", lineHeight: 1.1, letterSpacing: "-0.035em", margin: "0 0 16px 0" }}
          >
            Your network<br />
            starts <span style={{ color: PINK }}>here.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            style={{ fontSize: 15, color: GRAY2, lineHeight: 1.65, maxWidth: 340, margin: 0 }}
          >
            Crea tu perfil y conecta con personas que comparten tus intereses, carrera y objetivos.
          </motion.p>
        </div>

        {/* Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1 }}
        >
          <RotatingEarth size={260} />
        </motion.div>

        {/* Step indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ display: "flex", flexDirection: "column", gap: 10, zIndex: 1 }}
        >
          {steps.map((s) => (
            <div key={s.n} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 16px",
              background: step >= s.n ? "rgba(255,61,158,0.06)" : "rgba(255,255,255,0.5)",
              border: `1px solid ${step >= s.n ? "rgba(255,61,158,0.15)" : BORDER}`,
              borderRadius: 12, transition: "all 300ms",
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                background: step > s.n ? PINK : step === s.n ? "rgba(255,61,158,0.12)" : "#f0f0f0",
                border: `1.5px solid ${step >= s.n ? PINK : BORDER}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
                color: step > s.n ? "#fff" : step === s.n ? PINK : "#aaa",
                transition: "all 300ms",
              }}>
                {step > s.n ? <Check size={13} /> : s.n}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: step >= s.n ? "#111" : "#aaa" }}>{s.label}</p>
                <p style={{ margin: "1px 0 0 0", fontSize: 11, color: "#bbb" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════
          RIGHT PANEL — Form
      ══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "50%", minHeight: "100vh",
          background: "linear-gradient(210deg, #fff0f7 0%, #ffffff 45%, #fff9fc 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "40px 48px",
          position: "relative", overflowY: "auto",
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
          <Link to="/" style={{ fontSize: 13, color: "#aaa", textDecoration: "none", display: "block", marginBottom: 20 }}>← Home</Link>

          {/* Logo centrado */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <img src={LOGO_SRC} alt="LinkUp-U" style={{ width: 150, height: 150, objectFit: "contain" }} />
          </div>

          {/* Progress bar */}
          <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
            {[1, 2].map((s) => (
              <motion.div key={s}
                animate={{ background: step >= s ? PINK : "#f0f0f0" }}
                transition={{ duration: 0.3 }}
                style={{ flex: 1, height: 3, borderRadius: 4 }}
              />
            ))}
          </div>

          <p style={{ fontSize: 11, fontWeight: 700, color: PINK, letterSpacing: "0.10em", textTransform: "uppercase", margin: "0 0 10px 0", textAlign: "center" }}>
            {step === 1 ? "CREATE ACCOUNT" : "YOUR PROFILE"}
          </p>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#000", letterSpacing: "-0.03em", margin: "0 0 6px 0", textAlign: "center" }}>
            {step === 1 ? "Join LinkUp" : "Personaliza tu perfil"}
          </h2>
          <p style={{ fontSize: 14, color: GRAY2, margin: "0 0 24px 0", textAlign: "center" }}>
            {step === 1 ? "Tu información básica para empezar." : "Cuéntanos quién eres y qué buscas."}
          </p>

          <AnimatePresence mode="wait">
            {/* ─── STEP 1 ─────────────────────────────── */}
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
                  {loadingCampus && <p style={{ fontSize: 12, color: "#aaa", marginTop: 5 }}>Detectando institución...</p>}
                  {institution && <p style={{ fontSize: 12, color: "#00a86b", marginTop: 5, fontWeight: 600 }}>✓ {institution}</p>}
                </div>

                <div>
                  <label style={labelStyle}>Contraseña</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPwd ? "text" : "password"} placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputBase, paddingRight: 48 }} onFocus={focusIn} onBlur={focusOut} />
                    <button type="button" onClick={() => setShowPwd((v) => !v)}
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#aaa", cursor: "pointer", display: "flex", alignItems: "center", padding: 0, transition: "color 150ms" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = PINK)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
                    >
                      {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {campuses.length > 0 && (
                  <div>
                    <label style={labelStyle}>Campus</label>
                    <select value={campus} onChange={(e) => setCampus(e.target.value)}
                      style={{ ...inputBase, cursor: "pointer", appearance: "auto" }}
                      onFocus={focusIn} onBlur={focusOut}
                    >
                      <option value="">Selecciona tu campus</option>
                      {campuses.map((c) => <option key={c.id} value={c.id}>{c.label} — {c.city}</option>)}
                    </select>
                  </div>
                )}

                {error && <p style={{ fontSize: 12, color: "#cc0040", margin: 0, padding: "8px 12px", background: "#fff0f5", borderRadius: 10, border: "1px solid #ffc0d8" }}>{error}</p>}

                <motion.button type="button" onClick={goToStep2}
                  whileHover={{ y: -2, boxShadow: `0 10px 28px ${PINK_SHADOW}` }}
                  whileTap={{ scale: 0.98 }}
                  style={{ width: "100%", height: 52, borderRadius: 14, background: PINK, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 4 }}
                >
                  Continue →
                </motion.button>

                <p style={{ textAlign: "center", fontSize: 14, color: GRAY2, margin: 0 }}>
                  ¿Ya tienes cuenta?{" "}
                  <Link to="/login" style={{ color: PINK, fontWeight: 600, textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >Sign In</Link>
                </p>
              </motion.div>
            )}

            {/* ─── STEP 2 ─────────────────────────────── */}
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
                {/* Role selector */}
                <div>
                  <label style={{ ...labelStyle, marginBottom: 10 }}>Rol en LinkUp</label>
                  <div style={{ background: INPUT_BG, borderRadius: 16, padding: "8px 4px", border: `1.5px solid transparent` }}>
                    <RoleSelector value={role} onChange={setRole} />
                  </div>
                </div>

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
                  <label style={labelStyle}>Bio <span style={{ fontWeight: 400, color: "#aaa" }}>(opcional)</span></label>
                  <textarea
                    placeholder="Cuéntanos quién eres..."
                    value={bio} onChange={(e) => setBio(e.target.value)}
                    maxLength={300}
                    style={{ width: "100%", minHeight: 72, resize: "none", background: INPUT_BG, border: "1.5px solid transparent", borderRadius: 14, padding: "10px 14px", color: "#000", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 250ms, box-shadow 250ms" }}
                    onFocus={(e) => { e.target.style.borderColor = PINK; e.target.style.boxShadow = "0 0 0 4px rgba(255,61,158,0.10)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Interests */}
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
                          background: interests.includes(item) ? PINK : "#f4f4f4",
                          border: `1.5px solid ${interests.includes(item) ? PINK : BORDER}`,
                          color: interests.includes(item) ? "#fff" : "#555",
                          transition: "all 150ms",
                        }}
                      >
                        {item}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Objectives */}
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
                          background: objectives.includes(item) ? PINK : "#f4f4f4",
                          border: `1.5px solid ${objectives.includes(item) ? PINK : BORDER}`,
                          color: objectives.includes(item) ? "#fff" : "#555",
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
                    style={{ flex: 1, height: 52, borderRadius: 14, background: "#f4f4f4", border: `1.5px solid ${BORDER}`, color: "#666", fontWeight: 600, cursor: "pointer", fontSize: 14, transition: "all 200ms" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ccc"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; }}
                  >
                    ← Volver
                  </button>
                  <motion.button type="submit" disabled={loading}
                    whileHover={!loading ? { y: -2, boxShadow: `0 10px 28px ${PINK_SHADOW}` } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    style={{ flex: 2, height: 52, borderRadius: 14, background: PINK, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {loading ? <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> : "Crear cuenta"}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        select option { background: #fff; color: #000; }
        @media (max-width: 768px) {
          body > div > div { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}