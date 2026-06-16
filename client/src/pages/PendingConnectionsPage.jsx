// src/pages/PendingConnectionsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Inbox, Check, X, MoreVertical, UserCircle, Archive, RotateCcw } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import EmptyState from "../components/ui/EmptyState";
import Dropdown from "../components/ui/Dropdown";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import { useTheme } from "../context/ThemeContext";

export default function PendingConnectionsPage() {
  const navigate = useNavigate();
  const { theme, colors } = useTheme();
  const usuario = useAuthStore((state) => state.usuario);

  const [activeTab, setActiveTab] = useState("pending");
  const [solicitudes, setSolicitudes] = useState([]);
  const [archivadas, setArchivadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingIds, setProcessingIds] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/connections/pending"),
      api.get("/connections/archived"),
    ])
      .then(([pendRes, archRes]) => {
        setSolicitudes(pendRes.data || []);
        setArchivadas(archRes.data || []);
      })
      .catch(() => setError("No se pudieron cargar las solicitudes."))
      .finally(() => setLoading(false));
  }, [usuario?._id]);

  const withProcessing = (id, fn) => async () => {
    setProcessingIds((p) => [...p, id]);
    try { await fn(); } catch (err) { alert(err.response?.data?.message || "Error al procesar la solicitud"); }
    finally { setProcessingIds((p) => p.filter((x) => x !== id)); }
  };

  const handleAceptar = (id) => withProcessing(id, async () => {
    await api.put(`/connections/${id}/accept`);
    setSolicitudes((p) => p.filter((s) => s._id !== id));
  })();

  const handleRechazar = (id) => withProcessing(id, async () => {
    await api.put(`/connections/${id}/reject`);
    setSolicitudes((p) => p.filter((s) => s._id !== id));
  })();

  const handleArchivar = (id) => withProcessing(id, async () => {
    await api.put(`/connections/${id}/archive`);
    const item = solicitudes.find((s) => s._id === id);
    setSolicitudes((p) => p.filter((s) => s._id !== id));
    if (item) setArchivadas((p) => [item, ...p]);
  })();

  const handleRestaurar = (id) => withProcessing(id, async () => {
    await api.put(`/connections/${id}/restore`);
    const item = archivadas.find((s) => s._id === id);
    setArchivadas((p) => p.filter((s) => s._id !== id));
    if (item) setSolicitudes((p) => [item, ...p]);
  })();

  const cardStyle = (theme === "dark"
    ? { background: colors.surface }
    : { background: "rgba(255,255,255,0.5)" });

  const renderCard = (sol, tab) => {
    const persona = sol.from;
    const isProcessing = processingIds.includes(sol._id);

    const menuItems = tab === "pending"
      ? [
          { label: "Ver perfil", icon: UserCircle, onClick: () => navigate(`/users/${persona?._id}`) },
          { label: "Archivar solicitud", icon: Archive, onClick: () => handleArchivar(sol._id) },
        ]
      : [
          { label: "Ver perfil", icon: UserCircle, onClick: () => navigate(`/users/${persona?._id}`) },
          { label: "Restaurar solicitud", icon: RotateCcw, onClick: () => handleRestaurar(sol._id) },
        ];

    return (
      <div
        key={sol._id}
        style={{
          ...cardStyle,
          border: `1px solid ${colors.border}`,
          borderRadius: 20, padding: "16px 20px",
          boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
          display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
        }}
      >
        {/* Avatar */}
        <button
          onClick={() => navigate(`/users/${persona?._id}`)}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", flexShrink: 0, transition: "opacity 150ms" }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          {persona?.profilePicture ? (
            <img
              src={persona.profilePicture}
              alt={persona.fullName}
              style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: colors.pinkLight, display: "flex", alignItems: "center", justifyContent: "center", color: colors.pink, fontWeight: 700, fontSize: 20 }}>
              {(persona?.fullName || "U").charAt(0).toUpperCase()}
            </div>
          )}
        </button>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <button
            onClick={() => navigate(`/users/${persona?._id}`)}
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
          >
            <p style={{ margin: "0 0 2px 0", fontSize: 16, fontWeight: 700, color: colors.textDark }}>
              {persona?.fullName || "Usuario"}
            </p>
          </button>
          <p style={{ margin: 0, fontSize: 13, color: colors.textMuted }}>
            {persona?.career || persona?.email}
          </p>
        </div>

        {/* Acciones */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
          {tab === "pending" && (
            <>
              <button
                onClick={() => handleAceptar(sol._id)}
                disabled={isProcessing}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 999,
                  background: colors.pink, color: "#fff",
                  border: "none", fontSize: 13, fontWeight: 600,
                  cursor: isProcessing ? "default" : "pointer",
                  opacity: isProcessing ? 0.6 : 1, transition: "all 150ms",
                }}
              >
                <Check size={15} /> Aceptar
              </button>
              <button
                onClick={() => handleRechazar(sol._id)}
                disabled={isProcessing}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 999,
                  background: colors.pinkLight, color: colors.textDark,
                  border: "none", fontSize: 13, fontWeight: 600,
                  cursor: isProcessing ? "default" : "pointer",
                  opacity: isProcessing ? 0.6 : 1, transition: "all 150ms",
                }}
              >
                <X size={15} /> Rechazar
              </button>
            </>
          )}

          {/* Menú 3 puntos */}
          <Dropdown
            align="right"
            items={menuItems}
            trigger={({ toggle }) => (
              <button
                onClick={toggle}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32, borderRadius: "50%",
                  border: `1px solid ${colors.border}`, background: "transparent",
                  color: colors.textMuted, cursor: "pointer",
                }}
              >
                <MoreVertical size={16} />
              </button>
            )}
          />
        </div>
      </div>
    );
  };

  const currentList = activeTab === "pending" ? solicitudes : archivadas;

  return (
    <AppLayout>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 64px" }}>
        <h1 style={{ margin: "0 0 20px 0", fontSize: 28, fontWeight: 700, color: colors.textDark, fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>
          Solicitudes
        </h1>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[
            { key: "pending", label: "Solicitudes", count: solicitudes.length },
            { key: "archived", label: "Archivadas", count: archivadas.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 18px", borderRadius: 999,
                border: `1px solid ${activeTab === tab.key ? colors.pink : colors.border}`,
                background: activeTab === tab.key ? colors.pinkLight : "transparent",
                color: activeTab === tab.key ? colors.pink : colors.textMuted,
                fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 150ms",
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 999,
                  background: activeTab === tab.key ? colors.pink : colors.surfaceAlt,
                  color: activeTab === tab.key ? "#fff" : colors.textMuted,
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: colors.textMuted, fontSize: 14 }}>Cargando...</p>}

        {error && (
          <p style={{ fontSize: 13, color: "#cc0040", padding: "10px 14px", background: "#fff0f5", borderRadius: 12, border: "1px solid #ffc0d8" }}>
            {error}
          </p>
        )}

        {!loading && !error && currentList.length === 0 && (
          <EmptyState
            icon={<Inbox size={24} />}
            title={activeTab === "pending" ? "No tienes solicitudes pendientes" : "No tienes solicitudes archivadas"}
            subtitle={activeTab === "pending"
              ? "Cuando alguien quiera conectar contigo, aparecerá aquí."
              : "Las solicitudes que archives aparecerán aquí."}
          />
        )}

        {!loading && currentList.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {currentList.map((sol) => renderCard(sol, activeTab))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
