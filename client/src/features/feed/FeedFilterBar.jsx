// src/features/feed/FeedFilterBar.jsx
import { useState, useEffect } from "react";
import { ChevronDown, MapPin, GraduationCap } from "lucide-react";
import api from "../../api/axios";
import Dropdown from "../../components/ui/Dropdown";
import { useTheme } from "../../context/ThemeContext";

function FilterDropdown({ icon: Icon, label, value, options, onChange }) {
  const { colors } = useTheme();

  return (
    <Dropdown
      align="left"
      items={[
        {
          label: "Todos",
          onClick: () => onChange(""),
        },
        ...options.map((opt) => ({
          label: opt,
          onClick: () => onChange(opt),
        })),
      ]}
      trigger={({ open, toggle }) => (
        <button
          onClick={toggle}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
          style={{
            background: open || value ? colors.pinkLight : colors.surface,
            border: `1px solid ${value ? colors.pink : colors.border}`,
            color: value ? colors.pink : colors.textDark,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <Icon className="h-4 w-4" />
          {value || label}
          <ChevronDown className="h-4 w-4" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 150ms" }} />
        </button>
      )}
    />
  );
}

export default function FeedFilterBar({ campus, faculty, onCampusChange, onFacultyChange }) {
  const [facets, setFacets] = useState({ campuses: [], faculties: [] });

  useEffect(() => {
    api.get("/users/facets")
      .then((res) => setFacets(res.data || { campuses: [], faculties: [] }))
      .catch(() => setFacets({ campuses: [], faculties: [] }));
  }, []);

  if (facets.campuses.length === 0 && facets.faculties.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: 10, padding: "8px 16px 4px", flexShrink: 0, flexWrap: "wrap" }}>
      {facets.campuses.length > 0 && (
        <FilterDropdown
          icon={MapPin}
          label="Campus"
          value={campus}
          options={facets.campuses}
          onChange={onCampusChange}
        />
      )}
      {facets.faculties.length > 0 && (
        <FilterDropdown
          icon={GraduationCap}
          label="Facultad"
          value={faculty}
          options={facets.faculties}
          onChange={onFacultyChange}
        />
      )}
    </div>
  );
}
