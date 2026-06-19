// src/pages/ConnectionsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, MessageCircle, MoreHorizontal, Eye, Share2, Trash2, Flag } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import EmptyState from "../components/ui/EmptyState";
import ProfileCard from "../components/profile/ProfileCard";
import Dropdown from "../components/ui/Dropdown";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import { useTheme } from "../context/ThemeContext";

export default function ConnectionsPage() {
  const navigate = useNavigate();
  const { theme, colors } = useTheme();
  const usuario = useAuthStore((state) => state.usuario);
  const [conexiones, setConexiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingIds, setRemovingIds] = useState([]);

  useEffect(() => {
    setLoading(true);
    api.get("/connections/accepted")
      .then((res) => setConexiones(res.data || []))
      .catch(() => setError("No se pudieron cargar tus conexiones."))
      .finally(() => setLoading(false));
  }, [usuario?._id]);

  const otherPerson = (conn) => {
    const from = conn.from;
    const to = conn.to;
    if (from?._id === usuario?._id) return to;
    return from;
  };

  const handleEliminar = async (connId) => {
    if (!window.confirm("¿Eliminar esta conexión?")) return;
    setRemovingIds((p) => [...p, connId]);
    try {
      await api.delete(`/connections/${connId}`);
      setConexiones((prev) => prev.filter((c) => c._id !== connId));
    } catch {
      alert("No se pudo eliminar la conexión");
    } finally {
      setRemovingIds((p) => p.filter((x) => x !== connId));
    }
  };

  const handleShare = (user) => {
    const url = `${window.location.origin}/users/${user._id}`;
    if (navigator.share) {
      navigator.share({ title: user.fullName, url }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url);
      alert("Enlace copiado al portapapeles");
    }
  };

  const handleReport = () => {
    alert("Gracias por el reporte. Revisaremos el perfil en breve.");
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: "90%", margin: "0 auto", padding: "20px 24px 64px" }}>
        <h1 style={{ margin: "0 0 24px 0", fontSize: 28, fontWeight: 700, color: colors.textDark, fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>
          Amigos
        </h1>

        {loading && <p style={{ color: colors.textMuted, fontSize: 14 }}>Cargando...</p>}

        {error && (
          <p style={{ fontSize: 13, color: "#cc0040", padding: "10px 14px", background: "#fff0f5", borderRadius: 12, border: "1px solid #ffc0d8" }}>
            {error}
          </p>
        )}

        {!loading && !error && conexiones.length === 0 && (
          <EmptyState
            icon={<Users size={24} />}
            title="Aún no tienes conexiones"
            subtitle="Cuando se acepten tus solicitudes de conexión desde el feed, tus amigos aparecerán aquí."
          />
        )}

        {!loading && conexiones.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {conexiones.map((conn) => {
              const persona = otherPerson(conn);
              const isRemoving = removingIds.includes(conn._id);
              return (
                <div key={conn._id} style={{ position: "relative", opacity: isRemoving ? 0.4 : 1, transition: "opacity 200ms" }}>
                  {/* Menú de 3 puntos */}
                  <div style={{ position: "absolute", top: 10, right: 10, zIndex: 20 }}>
                    <Dropdown
                      align="right"
                      items={[
                        { label: "Ver perfil",       icon: Eye,            onClick: () => navigate(`/users/${persona?._id}`) },
                        { label: "Enviar mensaje",   icon: MessageCircle,  onClick: () => navigate(`/chat?with=${persona?._id}`) },
                        { label: "Compartir perfil", icon: Share2,         onClick: () => handleShare(persona) },
                        { label: "Eliminar conexión",icon: Trash2,         onClick: () => handleEliminar(conn._id), danger: true },
                        { label: "Reportar",         icon: Flag,           onClick: handleReport, danger: true },
                      ]}
                      trigger={({ toggle }) => (
                        <button
                          onClick={(e) => { e.stopPropagation(); toggle(); }}
                          style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: colors.surfaceAlt,
                            border: `1px solid ${colors.border}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", transition: "all 150ms",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = colors.pinkLight; e.currentTarget.style.borderColor = colors.pink; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = colors.surfaceAlt; e.currentTarget.style.borderColor = colors.border; }}
                        >
                          <MoreHorizontal size={14} color={colors.textMuted} />
                        </button>
                      )}
                    />
                  </div>

                  <ProfileCard
                    user={persona}
                    colors={colors}
                    theme={theme}
                    onClick={() => navigate(`/users/${persona?._id}`)}
                    footer={
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/chat?with=${persona?._id}`); }}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          width: "100%", padding: "8px 16px", borderRadius: 999,
                          border: `1px solid ${colors.border}`,
                          background: colors.pinkLight, color: colors.pink,
                          fontSize: 13, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        <MessageCircle size={15} /> Iniciar conversación
                      </button>
                    }
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
