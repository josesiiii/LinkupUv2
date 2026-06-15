// src/pages/ConnectionsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, MessageCircle } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import EmptyState from "../components/ui/EmptyState";
import ProfileCard from "../components/profile/ProfileCard";
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

  return (
    <AppLayout>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 64px" }}>
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
              return (
                <ProfileCard
                  key={conn._id}
                  user={persona}
                  colors={colors}
                  theme={theme}
                  footer={
                    <button
                      onClick={() => navigate(`/chat?with=${persona?._id}`)}
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
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
