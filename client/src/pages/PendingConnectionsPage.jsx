// src/pages/PendingConnectionsPage.jsx
import { useEffect, useState } from "react";
import { Inbox, Check, X } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import EmptyState from "../components/ui/EmptyState";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

export default function PendingConnectionsPage() {
  const { theme, colors } = useTheme();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingIds, setProcessingIds] = useState([]);

  useEffect(() => {
    api.get("/connections/pending")
      .then((res) => setSolicitudes(res.data || []))
      .catch(() => setError("No se pudieron cargar tus solicitudes."))
      .finally(() => setLoading(false));
  }, []);

  const handleAceptar = async (id) => {
    setProcessingIds((p) => [...p, id]);
    try {
      await api.put(`/connections/${id}/accept`);
      setSolicitudes((p) => p.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo aceptar la solicitud");
    } finally {
      setProcessingIds((p) => p.filter((x) => x !== id));
    }
  };

  const handleRechazar = async (id) => {
    setProcessingIds((p) => [...p, id]);
    try {
      await api.put(`/connections/${id}/reject`);
      setSolicitudes((p) => p.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo rechazar la solicitud");
    } finally {
      setProcessingIds((p) => p.filter((x) => x !== id));
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 64px" }}>
        <h1 style={{ margin: "0 0 24px 0", fontSize: 28, fontWeight: 700, color: colors.textDark, fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>
          Solicitudes
        </h1>

        {loading && <p style={{ color: colors.textMuted, fontSize: 14 }}>Cargando...</p>}

        {error && (
          <p style={{ fontSize: 13, color: "#cc0040", padding: "10px 14px", background: "#fff0f5", borderRadius: 12, border: "1px solid #ffc0d8" }}>
            {error}
          </p>
        )}

        {!loading && !error && solicitudes.length === 0 && (
          <EmptyState
            icon={<Inbox size={24} />}
            title="No tienes solicitudes pendientes"
            subtitle="Cuando alguien quiera conectar contigo, aparecerá aquí."
          />
        )}

        {!loading && solicitudes.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {solicitudes.map((sol) => {
              const persona = sol.from;
              const isProcessing = processingIds.includes(sol._id);
              return (
                <div
                  key={sol._id}
                  style={{
                    ...(theme === "dark"
                      ? { background: colors.surface }
                      : { background: "rgba(255,255,255,0.5)" }),
                    border: `1px solid ${colors.border}`,
                    borderRadius: 20, padding: "16px 20px",
                    boxShadow: "0 1px 10px rgba(0,0,0,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p style={{ margin: "0 0 2px 0", fontSize: 16, fontWeight: 700, color: colors.textDark }}>
                      {persona?.fullName || "Usuario"}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: colors.textMuted }}>{persona?.email}</p>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => handleAceptar(sol._id)}
                      disabled={isProcessing}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 16px", borderRadius: 999,
                        background: colors.pink, color: "#fff",
                        border: "none", fontSize: 13, fontWeight: 600,
                        cursor: isProcessing ? "default" : "pointer",
                        opacity: isProcessing ? 0.6 : 1,
                        transition: "all 150ms",
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
                        opacity: isProcessing ? 0.6 : 1,
                        transition: "all 150ms",
                      }}
                    >
                      <X size={15} /> Rechazar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
