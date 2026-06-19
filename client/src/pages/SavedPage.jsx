// src/pages/SavedPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Heart, MoreHorizontal, Eye, MessageCircle, Share2, Trash2, Flag } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import EmptyState from "../components/ui/EmptyState";
import ProfileCard from "../components/profile/ProfileCard";
import Dropdown from "../components/ui/Dropdown";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import useSavedProfilesStore from "../store/savedProfilesStore";
import { useTheme } from "../context/ThemeContext";

export default function SavedPage() {
  const navigate = useNavigate();
  const { theme, colors } = useTheme();
  const usuario = useAuthStore((state) => state.usuario);
  const unsaveProfile = useSavedProfilesStore((s) => s.unsave);
  const [guardados, setGuardados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingIds, setRemovingIds] = useState([]);

  useEffect(() => {
    setLoading(true);
    api.get("/savedprofiles")
      .then((res) => setGuardados(res.data || []))
      .catch(() => setError("No se pudieron cargar los perfiles guardados."))
      .finally(() => setLoading(false));
  }, [usuario?._id]);

  const handleQuitar = async (savedUserId) => {
    setRemovingIds((p) => [...p, savedUserId]);
    try {
      await unsaveProfile(savedUserId);
      setGuardados((prev) => prev.filter((g) => g.savedUser?._id !== savedUserId));
    } catch {
      // silent — item stays in list if API fails
    } finally {
      setRemovingIds((p) => p.filter((x) => x !== savedUserId));
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
            {guardados.map((item) => {
              const user = item.savedUser;
              if (!user) return null;
              const isRemoving = removingIds.includes(user._id);
              return (
                <div key={item._id} style={{ position: "relative", opacity: isRemoving ? 0.5 : 1, transition: "opacity 200ms" }}>
                  {/* Corazón activo — quitar guardado */}
                  <button
                    onClick={() => handleQuitar(user._id)}
                    disabled={isRemoving}
                    title="Quitar guardado"
                    style={{
                      position: "absolute", top: 10, right: 44, zIndex: 20,
                      width: 32, height: 32, borderRadius: "50%",
                      background: "rgba(255,61,158,0.12)",
                      border: "1px solid rgba(255,61,158,0.35)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all 150ms",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,61,158,0.22)"; e.currentTarget.style.transform = "scale(1.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,61,158,0.12)"; e.currentTarget.style.transform = "scale(1)"; }}
                  >
                    <Heart size={14} fill="#FF3D9E" color="#FF3D9E" />
                  </button>

                  {/* Menú de 3 puntos */}
                  <div style={{ position: "absolute", top: 10, right: 10, zIndex: 20 }}>
                    <Dropdown
                      align="right"
                      items={[
                        { label: "Ver perfil",            icon: Eye,            onClick: () => navigate(`/users/${user._id}`) },
                        { label: "Iniciar conversación",  icon: MessageCircle,  onClick: () => navigate(`/chat?with=${user._id}`) },
                        { label: "Compartir perfil",      icon: Share2,         onClick: () => handleShare(user) },
                        { label: "Quitar guardado",       icon: Trash2,         onClick: () => handleQuitar(user._id), danger: true },
                        { label: "Reportar",              icon: Flag,           onClick: handleReport, danger: true },
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
                    user={user}
                    colors={colors}
                    theme={theme}
                    onClick={() => navigate(`/users/${user._id}`)}
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
