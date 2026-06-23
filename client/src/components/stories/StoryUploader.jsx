import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import Modal from "../ui/Modal";
import ImageCropModal from "../ui/ImageCropModal";
import { useTheme } from "../../context/ThemeContext";

const ACCEPTED = "image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm";

export default function StoryUploader({ open, onClose, onUpload }) {
  const { colors } = useTheme();
  const inputRef = useRef(null);

  const [file, setFile]       = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]     = useState("");
  const [cropSrc, setCropSrc] = useState(null);

  useEffect(() => {
    if (open) {
      setFile(null);
      setPreview(null);
      setError("");
      setCropSrc(null);
      setTimeout(() => inputRef.current?.click(), 100);
    }
  }, [open]);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    e.target.value = "";
    setError("");

    if (selected.type.startsWith("video/")) {
      if (preview) URL.revokeObjectURL(preview);
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result);
    reader.readAsDataURL(selected);
  };

  const handleCropSave = (blob) => {
    if (preview) URL.revokeObjectURL(preview);
    const croppedFile = new File([blob], "story.jpg", { type: "image/jpeg" });
    setFile(croppedFile);
    setPreview(URL.createObjectURL(blob));
    setCropSrc(null);
  };

  const handlePublish = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      await onUpload(file);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Error al subir la story");
    } finally {
      setUploading(false);
    }
  };

  const isVideo = file?.type?.startsWith("video/");

  return (
    <>
      <ImageCropModal
        image={cropSrc}
        aspectRatio={9 / 16}
        cropShape="rect"
        title="Editar story"
        onSave={handleCropSave}
        onClose={() => { setCropSrc(null); if (!file) onClose(); }}
      />

      <Modal open={open && !cropSrc} onClose={onClose} title="Nueva story" maxWidth={420}>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {!file ? (
          <div
            onClick={() => inputRef.current?.click()}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 12, padding: "48px 24px", borderRadius: 16, cursor: "pointer",
              border: `2px dashed ${colors.border}`, color: colors.textMuted,
            }}
          >
            <Upload size={32} />
            <p style={{ margin: 0, fontSize: 14, textAlign: "center" }}>
              Haz clic para seleccionar una imagen o video
            </p>
            <p style={{ margin: 0, fontSize: 12, color: colors.textMuted }}>
              JPEG, PNG, WebP · MP4, MOV, WebM · máx. 100 MB
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", height: 320, background: "#000" }}>
              {isVideo ? (
                <video src={preview} autoPlay muted playsInline loop style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <img src={preview} alt="preview" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              )}
              <button
                onClick={() => { setFile(null); if (preview) URL.revokeObjectURL(preview); setPreview(null); }}
                style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}
              >
                <X size={14} />
              </button>
            </div>

            {error && (
              <p style={{ margin: 0, color: "#FF3D9E", fontSize: 13, textAlign: "center" }}>{error}</p>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onClose}
                disabled={uploading}
                style={{ flex: 1, padding: "12px 0", borderRadius: 12, border: `1px solid ${colors.border}`, background: "transparent", color: colors.textDark, cursor: "pointer", fontWeight: 600, fontSize: 14 }}
              >
                Cancelar
              </button>
              <button
                onClick={handlePublish}
                disabled={uploading}
                style={{ flex: 2, padding: "12px 0", borderRadius: 12, border: "none", background: uploading ? colors.border : "#FF3D9E", color: "#fff", cursor: uploading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: 14 }}
              >
                {uploading ? "Subiendo story..." : "Publicar story"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
