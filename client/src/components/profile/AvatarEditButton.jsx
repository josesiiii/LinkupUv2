// src/components/profile/AvatarEditButton.jsx
import { useRef, useState } from "react";
import { Pencil, Image, Trash2, X } from "lucide-react";
import Dropdown from "../ui/Dropdown";
import ImageCropModal from "../ui/ImageCropModal";
import api from "../../api/axios";
import useAuthStore from "../../store/authStore";
import { useTheme } from "../../context/ThemeContext";

export default function AvatarEditButton({ hasPhoto }) {
  const { colors } = useTheme();
  const updateUsuario = useAuthStore((state) => state.updateUsuario);
  const fileInputRef = useRef(null);
  const [cropSrc, setCropSrc] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCropSave = async (blob) => {
    const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/users/profile-picture", formData);
      updateUsuario({ profilePicture: res.data.profilePicture });
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo actualizar la foto de perfil");
    } finally {
      setCropSrc(null);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete("/users/profile-picture");
      updateUsuario({ profilePicture: "" });
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo eliminar la foto de perfil");
    }
  };

  const items = [
    { icon: Image, label: "Cambiar foto", onClick: () => fileInputRef.current?.click() },
    { icon: Trash2, label: "Eliminar foto", danger: true, disabled: !hasPhoto, onClick: handleDelete },
    { icon: X, label: "Cancelar", onClick: () => {} },
  ];

  return (
    <>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

      <ImageCropModal
        image={cropSrc}
        aspectRatio={1}
        cropShape="round"
        title="Editar foto de perfil"
        onSave={handleCropSave}
        onClose={() => setCropSrc(null)}
      />

      <div style={{ position: "absolute", bottom: 0, right: 0 }}>
        <Dropdown
          align="left"
          items={items}
          trigger={({ toggle }) => (
            <button
              onClick={toggle}
              style={{
                width: 32, height: 32, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: colors.pink, color: "#fff",
                border: `2px solid ${colors.surface}`, cursor: "pointer", padding: 0,
              }}
            >
              <Pencil size={14} />
            </button>
          )}
        />
      </div>
    </>
  );
}
