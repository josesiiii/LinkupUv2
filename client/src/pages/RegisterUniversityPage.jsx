import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Navbar from "../components/landing/Navbar";
import api from "../api/axios";

const BASE_FIELD = {
  padding: "14px 18px",
  borderRadius: 14,
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(16px)",
  color: "#3c2f41",
  fontSize: "0.95rem",
  width: "100%",
  outline: "none",
  transition: "border-color 200ms ease, box-shadow 200ms ease",
  boxSizing: "border-box",
  fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
};

export default function RegisterUniversityPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    universityName: "",
    city: "",
    contactName: "",
    contactEmail: "",
    message: "",
  });
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const fieldStyle = (key) => ({
    ...BASE_FIELD,
    border: focused === key
      ? "1px solid rgba(241,173,194,0.8)"
      : "1px solid rgba(241,173,194,0.3)",
    boxShadow: focused === key
      ? "0 0 0 3px rgba(241,173,194,0.15)"
      : "none",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/campus/solicitar", form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error al enviar la solicitud. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      minHeight: "100vh",
      background: "linear-gradient(180deg, #fdf2f8 0%, #fde4ec 55%, #fdf2f8 100%)",
      overflowX: "hidden",
    }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap" />

      <Navbar />

      {/* Blobs decorativos */}
      <div style={{ position: "fixed", top: "12%", right: "-6%", width: 420, height: 420, borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%", background: "radial-gradient(circle, rgba(216,180,254,0.22) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "8%", left: "-6%", width: 360, height: 360, borderRadius: "40% 60% 70% 30% / 30% 60% 40% 70%", background: "radial-gradient(circle, rgba(241,173,194,0.18) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, padding: "120px 24px 80px", display: "flex", flexDirection: "column", alignItems: "center" }}>

        {/* Volver */}
        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", color: "#786b7d",
            cursor: "pointer", fontSize: "0.88rem", fontWeight: 500,
            marginBottom: 40, padding: 0, transition: "color 150ms",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#f1adc2"}
          onMouseLeave={e => e.currentTarget.style.color = "#786b7d"}
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </button>

        {!success ? (
          <div style={{ width: "100%", maxWidth: 560 }}>

            {/* Encabezado */}
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <span style={{
                display: "inline-block", padding: "5px 16px", borderRadius: 100,
                background: "rgba(216,180,254,0.15)", border: "1px solid rgba(216,180,254,0.4)",
                fontSize: "0.78rem", fontWeight: 600, color: "#d8b4fe",
                letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16,
              }}>
                Para Universidades
              </span>
              <h1 style={{
                fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "#3c2f41",
                letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 14,
                fontFamily: "'Syne', sans-serif",
              }}>
                Registra tu universidad
              </h1>
              <p style={{ color: "#786b7d", fontSize: "1rem", lineHeight: 1.7, margin: "0 auto", maxWidth: 460 }}>
                ¿Tu institución aún no está en LinkUp? Envíanos tu solicitud y nos ponemos en contacto contigo para incorporarla a la plataforma.
              </p>
            </div>

            {/* Formulario */}
            <form
              onSubmit={handleSubmit}
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(241,173,194,0.25)",
                borderRadius: 24,
                padding: "36px 32px",
                boxShadow: "0 8px 40px rgba(60,47,65,0.08)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#3c2f41", marginBottom: 6 }}>
                    Nombre de la universidad <span style={{ color: "#f1adc2" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Universidad de Antioquia"
                    required
                    value={form.universityName}
                    onChange={set("universityName")}
                    onFocus={() => setFocused("universityName")}
                    onBlur={() => setFocused(null)}
                    style={fieldStyle("universityName")}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#3c2f41", marginBottom: 6 }}>
                    Ciudad / Sede <span style={{ color: "#f1adc2" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Medellín, Antioquia"
                    required
                    value={form.city}
                    onChange={set("city")}
                    onFocus={() => setFocused("city")}
                    onBlur={() => setFocused(null)}
                    style={fieldStyle("city")}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#3c2f41", marginBottom: 6 }}>
                      Nombre del responsable <span style={{ color: "#f1adc2" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Tu nombre completo"
                      required
                      value={form.contactName}
                      onChange={set("contactName")}
                      onFocus={() => setFocused("contactName")}
                      onBlur={() => setFocused(null)}
                      style={fieldStyle("contactName")}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#3c2f41", marginBottom: 6 }}>
                      Correo de contacto <span style={{ color: "#f1adc2" }}>*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="correo@universidad.edu.co"
                      required
                      value={form.contactEmail}
                      onChange={set("contactEmail")}
                      onFocus={() => setFocused("contactEmail")}
                      onBlur={() => setFocused(null)}
                      style={fieldStyle("contactEmail")}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#3c2f41", marginBottom: 6 }}>
                    Mensaje adicional{" "}
                    <span style={{ color: "#786b7d", fontWeight: 400 }}>(opcional)</span>
                  </label>
                  <textarea
                    placeholder="Cuéntanos un poco más sobre tu institución o el motivo de la solicitud…"
                    rows={4}
                    value={form.message}
                    onChange={set("message")}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                    style={{ ...fieldStyle("message"), resize: "vertical", minHeight: 100 }}
                  />
                </div>

                {error && (
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#e0556f", fontWeight: 500 }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "14px 28px", borderRadius: 100, marginTop: 4,
                    background: loading
                      ? "rgba(241,173,194,0.45)"
                      : "linear-gradient(135deg, #f1adc2 0%, #d8b4fe 100%)",
                    border: "none", color: "#3c2f41", fontWeight: 700, fontSize: "0.95rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: loading ? "none" : "0 4px 24px rgba(241,173,194,0.45)",
                    transition: "transform 180ms ease, box-shadow 180ms ease",
                    width: "100%",
                  }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(241,173,194,0.55)"; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = loading ? "none" : "0 4px 24px rgba(241,173,194,0.45)"; }}
                >
                  {loading ? "Enviando…" : "Enviar solicitud →"}
                </button>
              </div>
            </form>

            <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#a09ab8", marginTop: 20 }}>
              Tu información es confidencial y solo se usará para ponernos en contacto contigo.
            </p>
          </div>
        ) : (
          /* Estado de éxito */
          <div style={{ width: "100%", maxWidth: 480, textAlign: "center" }}>
            <div style={{
              background: "rgba(255,255,255,0.75)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(241,173,194,0.25)",
              borderRadius: 24,
              padding: "52px 36px",
              boxShadow: "0 8px 40px rgba(60,47,65,0.08)",
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "linear-gradient(135deg, #f1adc2 0%, #d8b4fe 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px",
                boxShadow: "0 8px 24px rgba(241,173,194,0.4)",
              }}>
                <CheckCircle size={36} color="#fff" strokeWidth={2} />
              </div>
              <h2 style={{
                fontSize: "1.8rem", fontWeight: 800, color: "#3c2f41",
                letterSpacing: "-0.03em", marginBottom: 12,
                fontFamily: "'Syne', sans-serif",
              }}>
                ¡Solicitud enviada!
              </h2>
              <p style={{ color: "#786b7d", fontSize: "1rem", lineHeight: 1.7, marginBottom: 32 }}>
                Recibimos la solicitud para{" "}
                <strong style={{ color: "#3c2f41" }}>{form.universityName}</strong>.
                Nos pondremos en contacto con{" "}
                <strong style={{ color: "#3c2f41" }}>{form.contactEmail}</strong>{" "}
                en los próximos días hábiles.
              </p>
              <button
                onClick={() => navigate("/")}
                style={{
                  padding: "12px 28px", borderRadius: 100,
                  background: "linear-gradient(135deg, #f1adc2 0%, #d8b4fe 100%)",
                  border: "none", color: "#3c2f41", fontWeight: 700, fontSize: "0.9rem",
                  cursor: "pointer", boxShadow: "0 4px 20px rgba(241,173,194,0.4)",
                }}
              >
                Volver al inicio
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 520px) {
          form > div > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
