// src/pages/ConnectionsPage.jsx
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import EmptyState from "../components/ui/EmptyState";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import { COLORS } from "../styles/authTheme";

export default function ConnectionsPage() {
  const usuario = useAuthStore((state) => state.usuario);
  const [conexiones, setConexiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/connections/accepted")
      .then((res) => setConexiones(res.data || []))
      .catch(() => setError("No se pudieron cargar tus conexiones."))
      .finally(() => setLoading(false));
  }, []);

  const otherPerson = (conn) => {
    const from = conn.from;
    const to = conn.to;
    if (from?._id === usuario?._id) return to;
    return from;
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 64px" }}>
        <h1 style={{ margin: "0 0 24px 0", fontSize: 28, fontWeight: 800, color: COLORS.textDark, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}>
          Amigos
        </h1>

        {loading && <p style={{ color: COLORS.textMuted, fontSize: 14 }}>Cargando...</p>}

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
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {conexiones.map((conn) => {
              const persona = otherPerson(conn);
              return (
                <div
                  key={conn._id}
                  style={{
                    background: "rgba(255,255,255,0.5)", border: `1px solid ${COLORS.border}`,
                    borderRadius: 20, padding: "16px 20px",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
                  }}
                >
                  <div>
                    <p style={{ margin: "0 0 2px 0", fontSize: 16, fontWeight: 700, color: COLORS.textDark }}>
                      {persona?.fullName || "Usuario"}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, color: COLORS.textMuted }}>{persona?.email}</p>
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
