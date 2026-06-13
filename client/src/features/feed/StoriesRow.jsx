// src/features/feed/StoriesRow.jsx
import { useState } from "react";
import { Plus } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const STORAGE_KEY = "linkup-stories-seen";

function loadSeen() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export default function StoriesRow({ usuarios, yo, onSelect }) {
  const { colors } = useTheme();
  const [seenIds, setSeenIds] = useState(loadSeen);

  const handleClick = (id, index) => {
    if (!seenIds.includes(id)) {
      const next = [...seenIds, id];
      setSeenIds(next);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    onSelect(index);
  };

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

      {usuarios.map((item, index) => {
        if (!item) return null;
        const perfil = item.usuario || item;
        const id = perfil._id;
        const seen = seenIds.includes(id);
        const firstName = (perfil.fullName || perfil.name || "Usuario").split(" ")[0];

        return (
          <div
            key={id}
            onClick={() => handleClick(id, index)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, cursor: "pointer" }}
          >
            {perfil.profilePicture ? (
              <img
                src={perfil.profilePicture}
                alt={firstName}
                style={{
                  width: 64, height: 64, borderRadius: "50%", objectFit: "cover",
                  border: seen ? `2px solid ${colors.border}` : "2px solid #FF3D9E",
                  filter: seen ? "grayscale(60%)" : "none",
                  transition: "filter 200ms, border-color 200ms",
                }}
              />
            ) : (
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                border: seen ? `2px solid ${colors.border}` : "2px solid #FF3D9E",
                filter: seen ? "grayscale(60%)" : "none",
                background: colors.surfaceAlt,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, fontWeight: 700, color: colors.textDark,
                transition: "filter 200ms, border-color 200ms",
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
