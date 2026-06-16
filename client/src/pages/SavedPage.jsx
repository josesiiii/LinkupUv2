// src/pages/SavedPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import EmptyState from "../components/ui/EmptyState";
import ProfileCard from "../components/profile/ProfileCard";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import { useTheme } from "../context/ThemeContext";

export default function SavedPage() {
  const navigate = useNavigate();
  const { theme, colors } = useTheme();
  const usuario = useAuthStore((state) => state.usuario);
  const [guardados, setGuardados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/savedprofiles")
      .then((res) => setGuardados(res.data || []))
      .catch(() => setError("No se pudieron cargar los perfiles guardados."))
      .finally(() => setLoading(false));
  }, [usuario?._id]);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guardados.map((item) => (
              <ProfileCard key={item._id} user={item.savedUser} colors={colors} theme={theme} onClick={() => navigate(`/users/${item.savedUser?._id}`)} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
