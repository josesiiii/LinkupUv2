// src/features/feed/StoriesRow.jsx
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";

export default function StoriesRow({ yo }) {
  const { colors } = useTheme();
  const usuario = useAuthStore((state) => state.usuario);
  const [amigos, setAmigos] = useState([]);

  useEffect(() => {
    api.get("/connections/accepted")
      .then((res) => {
        const conexiones = res.data || [];
        const lista = conexiones
          .map((conn) => {
            const from = conn.from;
            const to = conn.to;
            return from?._id === usuario?._id ? to : from;
          })
          .filter(Boolean);
        setAmigos(lista);
      })
      .catch(() => setAmigos([]));
  }, [usuario?._id]);

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        overflowX: "auto",
        padding: "4px 16px 12px",
        flexShrink: 0,
        scrollbarWidth: "none",
      }}
      className="stories-row"
    >
      {/* Tu historia */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <div style={{ position: "relative", width: 64, height: 64 }}>
          {yo?.profilePicture ? (
            <img
              src={yo.profilePicture}
              alt="Tu historia"
              style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: `2px solid ${colors.border}` }}
            />
          ) : (
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              border: `2px solid ${colors.border}`,
              background: colors.surfaceAlt,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 700, color: colors.textDark,
            }}>
              {(yo?.fullName || "Tú").charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{
            position: "absolute", bottom: -2, right: -2,
            width: 22, height: 22, borderRadius: "50%",
            background: "#FF3D9E", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: `2px solid ${colors.surface}`,
          }}>
            <Plus size={13} />
          </div>
        </div>
        <span style={{ fontSize: 11, color: colors.textMuted, maxWidth: 64, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          Tu historia
        </span>
      </div>

      {amigos.map((perfil) => {
        const id = perfil._id;
        const firstName = (perfil.fullName || perfil.name || "Usuario").split(" ")[0];

        return (
          <div
            key={id}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}
          >
            {perfil.profilePicture ? (
              <img
                src={perfil.profilePicture}
                alt={firstName}
                style={{
                  width: 64, height: 64, borderRadius: "50%", objectFit: "cover",
                  border: `2px solid ${colors.border}`,
                }}
              />
            ) : (
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                border: `2px solid ${colors.border}`,
                background: colors.surfaceAlt,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, fontWeight: 700, color: colors.textDark,
              }}>
                {firstName.charAt(0).toUpperCase()}
              </div>
            )}
            <span style={{ fontSize: 11, color: colors.textMuted, maxWidth: 64, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {firstName}
            </span>
          </div>
        );
      })}

      <style>{`
        .stories-row::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
