// src/components/profile/EditProfileModal.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Modal from "../ui/Modal";
import AcademicSelect from "../ui/AcademicSelect";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";

const FIELDS = [
  { key: "fullName", label: "Nombre completo" },
  { key: "city",     label: "Ciudad" },
];

function TagInput({ label, values, onChange, colors, labelStyle, inputStyle }) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft("");
  };

  const removeTag = (tag) => onChange(values.filter((t) => t !== tag));

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
        {values.map((tag) => (
          <span
            key={tag}
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              padding: "5px 10px", borderRadius: 100, fontSize: 12, fontWeight: 500,
              background: colors.pinkLight, color: colors.textDark,
            }}
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex", color: colors.textMuted, padding: 0 }}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag();
          }
        }}
        placeholder="Escribe y presiona Enter"
        style={inputStyle}
      />
    </div>
  );
}

export default function EditProfileModal({ open, onClose, usuario }) {
  const { colors } = useTheme();
  const updateUsuario = useAuthStore((state) => state.updateUsuario);

  const [form, setForm] = useState(() => ({
    fullName:      usuario?.fullName      || "",
    institution:   usuario?.institution   || "",
    faculty:       usuario?.faculty       || "",
    career:        usuario?.career        || "",
    currentCampus: usuario?.currentCampus || "",
    city:          usuario?.city          || "",
    bio:           usuario?.bio           || "",
    interests:     usuario?.interests     || [],
    objectives:    usuario?.objectives    || [],
  }));
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const [institutions,        setInstitutions]        = useState([]);
  const [loadingInstitutions, setLoadingInstitutions] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoadingInstitutions(true);
    api.get("/institutions")
      .then(res => setInstitutions(res.data.institutions || []))
      .catch(() => {})
      .finally(() => setLoadingInstitutions(false));
  }, [open]);

  useEffect(() => {
    if (open) {
      setForm({
        fullName:      usuario?.fullName      || "",
        institution:   usuario?.institution   || "",
        faculty:       usuario?.faculty       || "",
        career:        usuario?.career        || "",
        currentCampus: usuario?.currentCampus || "",
        city:          usuario?.city          || "",
        bio:           usuario?.bio           || "",
        interests:     usuario?.interests     || [],
        objectives:    usuario?.objectives    || [],
      });
      setError("");
    }
  }, [open, usuario]);

  // Datos derivados — jerarquía: institución → campus / facultad → carrera
  const selectedInstitution = institutions.find(i => i.name === form.institution);
  const availableCampuses   = selectedInstitution?.campuses  ?? [];
  const availableFaculties  = selectedInstitution?.faculties ?? []; // [{name, careers}]
  const facultyNames        = availableFaculties.map(f => f.name);
  const selectedFaculty     = availableFaculties.find(f => f.name === form.faculty);
  const availableCareers    = selectedFaculty?.careers ?? [];
  const careerNames         = availableCareers;

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleInstitutionChange = (value) => {
    setForm(f => ({ ...f, institution: value, currentCampus: "", faculty: "", career: "" }));
  };

  const handleFacultyChange = (value) => {
    setForm(f => ({ ...f, faculty: value, career: "" }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await api.put("/users/profile", form);
      updateUsuario(res.data.usuario);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 12,
    border: `1px solid ${colors.border}`, background: "transparent",
    color: colors.textDark, fontSize: 14, outline: "none", boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const labelStyle = {
    fontSize: 12, fontWeight: 600, color: colors.textMuted,
    textTransform: "uppercase", letterSpacing: "0.05em",
    display: "block", marginBottom: 6,
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar perfil" maxWidth={560}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={labelStyle}>Correo</label>
          <input value={usuario?.email || ""} disabled style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }} />
        </div>

        {/* Institución */}
        <div>
          <label style={labelStyle}>Institución</label>
          <AcademicSelect
            options={institutions.map(i => i.name)}
            value={form.institution}
            onChange={handleInstitutionChange}
            placeholder={loadingInstitutions ? "Cargando instituciones..." : "Selecciona tu institución"}
            disabled={loadingInstitutions}
          />
        </div>

        {/* Campus — dependiente de institución */}
        {availableCampuses.length > 0 && (
          <div>
            <label style={labelStyle}>Campus</label>
            <AcademicSelect
              options={availableCampuses.map(c => `${c.label} — ${c.city}`)}
              value={(() => {
                if (!form.currentCampus) return "";
                const found = availableCampuses.find(c => c.id === form.currentCampus);
                return found ? `${found.label} — ${found.city}` : "";
              })()}
              onChange={(labelCity) => {
                const found = availableCampuses.find(c => `${c.label} — ${c.city}` === labelCity);
                if (found) setField("currentCampus", found.id);
              }}
              placeholder="Selecciona tu campus"
            />
          </div>
        )}

        {/* Facultad — dependiente de institución */}
        {availableFaculties.length > 0 && (
          <div>
            <label style={labelStyle}>Facultad</label>
            <AcademicSelect
              options={facultyNames}
              value={form.faculty}
              onChange={handleFacultyChange}
              placeholder="Selecciona tu facultad"
            />
          </div>
        )}

        {/* Carrera — dependiente de facultad */}
        {availableCareers.length > 0 && (
          <div>
            <label style={labelStyle}>Carrera</label>
            <AcademicSelect
              options={careerNames}
              value={form.career}
              onChange={(v) => setField("career", v)}
              placeholder="Selecciona tu carrera"
            />
          </div>
        )}

        {/* Campos de texto libres */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {FIELDS.map(({ key, label }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input
                value={form[key]}
                onChange={(e) => setField(key, e.target.value)}
                style={inputStyle}
              />
            </div>
          ))}
        </div>

        <div>
          <label style={labelStyle}>Biografía</label>
          <textarea
            value={form.bio}
            onChange={(e) => setField("bio", e.target.value)}
            maxLength={300}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        <TagInput label="Intereses" values={form.interests} onChange={(v) => setField("interests", v)} colors={colors} labelStyle={labelStyle} inputStyle={inputStyle} />
        <TagInput label="Objetivos" values={form.objectives} onChange={(v) => setField("objectives", v)} colors={colors} labelStyle={labelStyle} inputStyle={inputStyle} />

        {error && <p style={{ fontSize: 13, color: "#cc0040", margin: 0 }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button
            onClick={onClose}
            disabled={saving}
            style={{ padding: "10px 20px", borderRadius: 100, border: `1px solid ${colors.border}`, background: "transparent", color: colors.textDark, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: "10px 20px", borderRadius: 100, border: "none", background: colors.pink, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", opacity: saving ? 0.7 : 1 }}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
