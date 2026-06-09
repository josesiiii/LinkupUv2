// src/pages/FeedPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, UserPlus, Heart, Check, Loader2 } from "lucide-react";
import api from "../api/axios";
import useAuthStore from "../store/authStore";

export default function FeedPage() {
  const navigate = useNavigate();
  const { usuario, token, logout } = useAuthStore();

  // Estados de datos
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados de carga individuales para interacciones (guardan el ID del usuario)
  const [connectingIds, setConnectingIds] = useState([]);
  const [connectedIds, setConnectedIds] = useState([]);
  const [savingIds, setSavingIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);

  // Cargar el Feed de recomendaciones compatibles al montar el componente
  useEffect(() => {
    const cargarFeed = async () => {
      try {
        setLoading(true);
        setError("");
        
        const res = await api.get("/users/feed", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // CONTROL ULTRA-DEFENSIVO DE RESPUESTA DE API
        // Valida si viene directo en un array, o encapsulado en .usuarios, .users o .data
        if (Array.isArray(res.data)) {
          setUsuarios(res.data);
        } else if (res.data && Array.isArray(res.data.usuarios)) {
          setUsuarios(res.data.usuarios);
        } else if (res.data && Array.isArray(res.data.users)) {
          setUsuarios(res.data.users);
        } else if (res.data && Array.isArray(res.data.data)) {
          setUsuarios(res.data.data);
        } else {
          // Si no encuentra ninguna lista, inicializa como array vacío para evitar error de crash
          setUsuarios([]);
        }

      } catch (err) {
        setError(
          err.response?.data?.message || 
          "Error al cargar las recomendaciones de compatibilidad"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      cargarFeed();
    }
  }, [token]);

  // Manejar cierre de sesión
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // RF-06: Gestión de conexiones (Enviar solicitud)
  const handleConectar = async (recipientId) => {
    setConnectingIds((prev) => [...prev, recipientId]);
    try {
      await api.post(
        "/connections",
        { recipientId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setConnectedIds((prev) => [...prev, recipientId]);
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo enviar la solicitud");
    } finally {
      setConnectingIds((prev) => prev.filter((id) => id !== recipientId));
    }
  };

  // RF-08: Guardado de perfiles favoritos
  const handleGuardarPerfil = async (savedUserId) => {
    setSavingIds((prev) => [...prev, savedUserId]);
    try {
      await api.post(
        "/saved-profiles",
        { savedUserId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSavedIds((prev) => [...prev, savedUserId]);
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo guardar el perfil");
    } finally {
      setSavingIds((prev) => prev.filter((id) => id !== savedUserId));
    }
  };

  // Asegurar renderizado seguro incluso si por alguna razón vuelve a mutar a un tipo no-iterable
  const listaUsuariosValida = Array.isArray(usuarios) ? usuarios : [];

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "#080808",
        color: "#ffffff",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
      }}
    >
      {/* NAVBAR SUPERIOR */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 32px",
          borderBottom: "1px solid #141414",
          background: "#0a0a0a",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Logo LinkUp-U */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <path
              d="M6 4h10c3.3 0 6 2.7 6 6s-2.7 6-6 6h-2l6 8H16l-5.5-8H10v8H6V4z M10 8v4h6a2 2 0 000-4h-6z"
              fill="white"
            />
          </svg>
          <span style={{ fontWeight: 600, fontSize: 16, letterSpacing: "-0.01em" }}>
            LinkUp <span style={{ color: "#666" }}>– U</span>
          </span>
        </div>

        {/* Info Usuario & Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "#141414",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #222",
              }}
            >
              <User size={14} color="#888" />
            </div>
            <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500 }}>
              {usuario?.nombre || usuario?.email || "Estudiante"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: "1px solid #222",
              borderRadius: 8,
              padding: "6px 12px",
              color: "#888",
              fontSize: 13,
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#ef4444";
              e.currentTarget.style.color = "#ef4444";
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#222";
              e.currentTarget.style.color = "#888";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <LogOut size={13} />
            Log out
          </button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1, padding: "40px 32px", maxWidth: 1200, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>
            Recomendaciones Inteligentes
          </h1>
          <p style={{ color: "#666666", margin: 0, fontSize: 14 }}>
            Estudiantes con mayor afinidad académica según tus intereses, objetivos, facultad y campus.
          </p>
        </header>

        {/* CONTROL DE ESTADOS VISUALES */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh", gap: 10, color: "#666" }}>
            <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
            <span>Calculando niveles de compatibilidad...</span>
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", padding: 16, borderRadius: 12, color: "#ef4444", fontSize: 14 }}>
            {error}
          </div>
        )}

        {/* FEED GRID */}
        {!loading && !error && (
          <>
            {listaUsuariosValida.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", border: "1px dashed #222", borderRadius: 16 }}>
                <p style={{ color: "#444", margin: 0, fontSize: 15 }}>
                  No se encontraron nuevos perfiles compatibles en tu campus en este momento.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: 20,
                }}
              >
                {listaUsuariosValida.map((item) => {
                  if (!item) return null;
                  
                  // Manejo seguro de datos aninados de perfil según tu Backend
                  const infoPerfil = item.profile || item;
                  const intereses = Array.isArray(infoPerfil.intereses) ? infoPerfil.intereses : [];
                  const objetivos = Array.isArray(infoPerfil.objetivos) ? infoPerfil.objetivos : [];
                  
                  return (
                    <div
                      key={item._id}
                      style={{
                        background: "#111111",
                        border: "1px solid #1f1f1f",
                        borderRadius: 16,
                        padding: 24,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        position: "relative",
                        overflow: "hidden",
                        transition: "border-color 200ms ease",
                      }}
                    >
                      {/* Porcentaje de Compatibilidad Inteligente */}
                      <div
                        style={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          background: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#fff",
                        }}
                      >
                        {item.compatibilityPercentage || item.matchPercentage || 100}% match
                      </div>

                      {/* Info Principal */}
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 4px 0", color: "#ffffff", paddingRight: 80 }}>
                          {item.nombre || item.name}
                        </h3>
                        
                        <p style={{ fontSize: 13, color: "#888888", margin: "0 0 16px 0", fontWeight: 400 }}>
                          {infoPerfil.carrera || "Carrera no especificada"} 
                          {infoPerfil.semestre && ` • ${infoPerfil.semestre}° Semestre`}
                          <br />
                          <span style={{ fontSize: 12, color: "#444" }}>
                            {infoPerfil.facultad || "Facultad"} {infoPerfil.campus && `(${infoPerfil.campus})`}
                          </span>
                        </p>

                        {/* Biografía opcional */}
                        {infoPerfil.biografia && (
                          <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 16px 0", lineHeight: "1.4" }}>
                            "{infoPerfil.biografia}"
                          </p>
                        )}

                        {/* Intereses */}
                        <div style={{ marginBottom: 14 }}>
                          <span style={{ fontSize: 11, color: "#555", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                            Intereses
                          </span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {intereses.length > 0 ? intereses.map((int, i) => (
                              <span key={i} style={{ background: "#181818", border: "1px solid #262626", color: "#CECFD0", padding: "3px 8px", borderRadius: 6, fontSize: 12 }}>
                                {int}
                              </span>
                            )) : <span style={{ fontSize: 12, color: "#333" }}>Ninguno registrado</span>}
                          </div>
                        </div>

                        {/* Objetivos */}
                        <div style={{ marginBottom: 24 }}>
                          <span style={{ fontSize: 11, color: "#555", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                            Objetivos
                          </span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {objetivos.length > 0 ? objetivos.map((obj, i) => (
                              <span key={i} style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed #262626", color: "#9CA3AF", padding: "3px 8px", borderRadius: 6, fontSize: 12 }}>
                                {obj}
                              </span>
                            )) : <span style={{ fontSize: 12, color: "#333" }}>Ninguno registrado</span>}
                          </div>
                        </div>
                      </div>

                      {/* BOTONES DE ACCIÓN */}
                      <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                        {/* Botón de conectar */}
                        <button
                          disabled={connectingIds.includes(item._id) || connectedIds.includes(item._id)}
                          onClick={() => handleConectar(item._id)}
                          style={{
                            flex: 1,
                            height: 38,
                            borderRadius: 10,
                            background: connectedIds.includes(item._id) ? "transparent" : "#ffffff",
                            border: connectedIds.includes(item._id) ? "1px solid #222" : "1px solid #ffffff",
                            color: connectedIds.includes(item._id) ? "#666" : "#000000",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: connectingIds.includes(item._id) || connectedIds.includes(item._id) ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            transition: "all 150ms ease",
                          }}
                        >
                          {connectingIds.includes(item._id) ? (
                            <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                          ) : connectedIds.includes(item._id) ? (
                            <>
                              <Check size={14} color="#22c55e" />
                              Enviada
                            </>
                          ) : (
                            <>
                              <UserPlus size={14} />
                              Conectar
                            </>
                          )}
                        </button>

                        {/* Botón de favoritos (Guardar Perfil) */}
                        <button
                          disabled={savingIds.includes(item._id) || savedIds.includes(item._id)}
                          onClick={() => handleGuardarPerfil(item._id)}
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 10,
                            background: "transparent",
                            border: "1px solid #222",
                            color: savedIds.includes(item._id) ? "#ef4444" : "#666",
                            cursor: savingIds.includes(item._id) || savedIds.includes(item._id) ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 150ms ease",
                          }}
                          onMouseEnter={(e) => {
                            if (!savedIds.includes(item._id)) {
                              e.currentTarget.style.borderColor = "#444";
                              e.currentTarget.style.color = "#fff";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!savedIds.includes(item._id)) {
                              e.currentTarget.style.borderColor = "#222";
                              e.currentTarget.style.color = "#666";
                            }
                          }}
                        >
                          {savingIds.includes(item._id) ? (
                            <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                          ) : (
                            <Heart size={14} fill={savedIds.includes(item._id) ? "#ef4444" : "none"} />
                          )}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* KEYFRAMES DE SPIN */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}