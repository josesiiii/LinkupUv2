// src/pages/SavedPage.jsx
import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import EmptyState from "../components/ui/EmptyState";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";

export default function SavedPage() {
  const { theme, colors } = useTheme();
  const [guardados, setGuardados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/savedprofiles")
      .then((res) => setGuardados(res.data || []))
      .catch(() => setError("No se pudieron cargar los perfiles guardados."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "0 24px 64px" }}>
        <h1 style={{ margin: "0 0 24px 0", fontSize: 28, fontWeight: 700, color: colors.textDark, fontFamily: "'Inter', sans-serif", letterSpacing: "-0.02em" }}>
          Perfiles guardados
        </h1>

        {loading && <p style={{ color: colors.textMuted, fontSize: 14 }}>Cargando...</p>}

        {error && (
          <p style={{ fontSize: 13, color: "#cc0040", padding: "10px 14px", background: "#fff0f5", borderRadius: 12, border: "1px solid #ffc0d8" }}>
            {error}
          </p>
        )}

        {!loading && !error && guardados.length === 0 && (
          <EmptyState
            icon={<Bookmark size={24} />}
            title="Aún no tienes perfiles guardados"
            subtitle="Cuando guardes un perfil desde el feed, aparecerá aquí para que puedas volver a verlo."
          />
        )}

        {!loading && guardados.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {guardados.map((item) => (
              <div
                key={item._id}
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
                    {item.savedUser?.fullName || "Usuario"}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: colors.textMuted }}>{item.savedUser?.email}</p>
                </div>
                {item.savedUser?.interests?.length > 0 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {item.savedUser.interests.slice(0, 3).map((interest) => (
                      <span key={interest} style={{ fontSize: 12, fontWeight: 500, color: colors.textDark, background: colors.pinkLight, padding: "4px 10px", borderRadius: 100 }}>
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
