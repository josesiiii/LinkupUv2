// src/features/feed/FeedFilterBar.jsx
import { Globe, Building2 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function FeedFilterBar({ myUniversity, onChange }) {
  const { colors } = useTheme();

  const options = [
    { key: "all",           label: "Todos",          Icon: Globe },
    { key: "myUniversity",  label: "Mi Universidad", Icon: Building2 },
  ];

  return (
    <div style={{ display: "flex", gap: 8, padding: "8px 16px 4px", flexShrink: 0 }}>
      {options.map(({ key, label, Icon }) => {
        const active = myUniversity ? key === "myUniversity" : key === "all";
        return (
          <button
            key={key}
            onClick={() => onChange(key === "myUniversity")}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "7px 16px", borderRadius: 999,
              fontSize: 13, fontWeight: 600,
              border: `1px solid ${active ? colors.pink : colors.border}`,
              background: active ? colors.pinkLight : colors.surface,
              color: active ? colors.pink : colors.textMuted,
              cursor: "pointer",
              transition: "all 150ms",
              whiteSpace: "nowrap",
            }}
          >
            <Icon size={14} />
            {label}
          </button>
        );
      })}
    </div>
  );
}
