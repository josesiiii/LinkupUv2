// src/components/profile/GalleryEditor.jsx
import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import api from "../../api/axios";
import ImageCropModal from "../ui/ImageCropModal";
import { useTheme } from "../../context/ThemeContext";

const MAX_PHOTOS = 4;

export default function GalleryEditor() {
  const { colors } = useTheme();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);
  const [cropSrc, setCropSrc] = useState(null);

  const load = () => {
    api.get("/users/my-photos")
      .then((res) => setPhotos((res.data.photos || []).slice().sort((a, b) => a.order - b.order)))
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCropSave = async (blob) => {
    const file = new File([blob], "gallery.jpg", { type: "image/jpeg" });
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/users/photos", formData);
      setPhotos((res.data.photos || []).slice().sort((a, b) => a.order - b.order));
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo subir la foto");
    } finally {
      setCropSrc(null);
    }
  };

  const handleDelete = async (photoId) => {
    try {
      const res = await api.delete(`/users/photos/${photoId}`);
      setPhotos((res.data.photos || []).slice().sort((a, b) => a.order - b.order));
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo eliminar la foto");
    }
  };

  const handleReorder = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= photos.length) return;

    const reordered = [...photos];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setPhotos(reordered);

    try {
      const res = await api.patch("/users/photos/reorder", { orderedIds: reordered.map((p) => p._id) });
      setPhotos((res.data.photos || []).slice().sort((a, b) => a.order - b.order));
    } catch {
      load();
    }
  };

  if (loading) return null;

  return (
    <>
      <ImageCropModal
        image={cropSrc}
        aspectRatio={4 / 5}
        cropShape="rect"
        title="Editar foto de galería"
        onSave={handleCropSave}
        onClose={() => setCropSrc(null)}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
        {photos.map((photo, i) => (
          <div key={photo._id} className="linkup-gallery-tile" style={{ position: "relative", borderRadius: 16, overflow: "hidden", aspectRatio: "1", background: colors.surfaceAlt }}>
            <img src={photo.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div
              className="linkup-gallery-overlay"
              style={{
                position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                justifyContent: "space-between", padding: 6, opacity: 0, transition: "opacity 150ms",
                background: "linear-gradient(to bottom, rgba(0,0,0,0.35), transparent 35%, transparent 65%, rgba(0,0,0,0.35))",
              }}
            >
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => handleDelete(photo._id)}
                  style={{ width: 26, height: 26, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.5)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => handleReorder(i, -1)}
                  disabled={i === 0}
                  style={{ width: 26, height: 26, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.5)", color: "#fff", cursor: i === 0 ? "default" : "pointer", opacity: i === 0 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <ChevronUp size={13} />
                </button>
                <button
                  onClick={() => handleReorder(i, 1)}
                  disabled={i === photos.length - 1}
                  style={{ width: 26, height: 26, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.5)", color: "#fff", cursor: i === photos.length - 1 ? "default" : "pointer", opacity: i === photos.length - 1 ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <ChevronDown size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {photos.length < MAX_PHOTOS && (
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              aspectRatio: "1", borderRadius: 16, border: `2px dashed ${colors.border}`,
              background: "transparent", color: colors.textMuted, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            <Plus size={20} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>Agregar foto</span>
          </button>
        )}

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: "none" }} />

        <style>{`
          .linkup-gallery-tile:hover .linkup-gallery-overlay { opacity: 1; }
        `}</style>
      </div>
    </>
  );
}
