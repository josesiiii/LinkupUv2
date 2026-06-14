// src/components/chat/MessageBubble.jsx
import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Avatar from "./Avatar";
import { formatTime } from "./utils";

export default function MessageBubble({
  message, currentUser, otherParticipant, colors,
  isEditing, draftText, onEditChange,
  onEditStart, onEditSave, onEditCancel,
  isConfirmingDelete, onDeleteRequest, onDeleteConfirm, onDeleteCancel,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const textareaRef = useRef(null);

  const isOwn = message.sender._id === currentUser._id;
  const isDeleted = message.text === "DELETED";
  const isUnread = !message.readBy?.includes(currentUser._id);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleEditKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onEditCancel();
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEditSave();
    }
  };

  const bubbleBg = isOwn ? colors.pink : colors.surfaceAlt;
  const textColor = isOwn ? "#fff" : colors.textDark;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isOwn ? "flex-end" : "flex-start",
        gap: 8,
        marginBottom: 4,
        position: "relative",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
    >
      {!isOwn && <Avatar name={otherParticipant?.name} src={otherParticipant?.avatar} size={32} colors={colors} />}

      <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start", position: "relative" }}>
        {/* Menú de acciones — solo en mensajes propios, no eliminados, no en edición */}
        {isOwn && !isDeleted && !isEditing && (
          <div style={{ position: "absolute", top: -28, right: 0, opacity: hovered ? 1 : 0, transition: "opacity 150ms", zIndex: 5 }}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                width: 26, height: 26, borderRadius: "50%",
                background: colors.surface, border: `1px solid ${colors.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: colors.textMuted,
              }}
            >
              <MoreHorizontal size={14} />
            </button>

            {menuOpen && (
              <div style={{
                position: "absolute", top: 30, right: 0,
                background: colors.surface, border: `1px solid ${colors.border}`,
                borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                minWidth: 130, zIndex: 10,
              }}>
                <button
                  onClick={() => { setMenuOpen(false); onEditStart(); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: colors.textDark, textAlign: "left" }}
                >
                  <Pencil size={13} /> Editar
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onDeleteRequest(); }}
                  style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px", background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "#e0556f", textAlign: "left" }}
                >
                  <Trash2 size={13} /> Eliminar
                </button>
              </div>
            )}
          </div>
        )}

        {/* Burbuja */}
        {isDeleted ? (
          <div style={{
            padding: "10px 14px", borderRadius: 18,
            background: colors.surfaceAlt, color: colors.textMuted,
            fontSize: 14, fontStyle: "italic",
          }}>
            Mensaje eliminado
          </div>
        ) : isConfirmingDelete ? (
          <div style={{
            padding: "10px 14px", borderRadius: 18,
            background: colors.surfaceAlt, color: colors.textDark,
            fontSize: 13, display: "flex", alignItems: "center", gap: 10,
          }}>
            <span>¿Eliminar?</span>
            <button onClick={onDeleteConfirm} style={{ background: "none", border: "none", color: "#e0556f", fontWeight: 700, cursor: "pointer", fontSize: 13, padding: 0 }}>Sí</button>
            <button onClick={onDeleteCancel} style={{ background: "none", border: "none", color: colors.textMuted, fontWeight: 700, cursor: "pointer", fontSize: 13, padding: 0 }}>No</button>
          </div>
        ) : isEditing ? (
          <div style={{
            padding: 8, borderRadius: 18,
            background: colors.surfaceAlt, width: "100%", minWidth: 220,
          }}>
            <textarea
              ref={textareaRef}
              value={draftText}
              onChange={(e) => onEditChange(e.target.value)}
              onKeyDown={handleEditKeyDown}
              rows={2}
              style={{
                width: "100%", resize: "none", border: "none", outline: "none",
                background: "transparent", color: colors.textDark, fontSize: 14,
                fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
              <button onClick={onEditCancel} style={{ background: "none", border: "none", color: colors.textMuted, fontWeight: 600, cursor: "pointer", fontSize: 12 }}>Cancelar</button>
              <button onClick={onEditSave} style={{ background: colors.pink, border: "none", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 12, borderRadius: 8, padding: "4px 10px" }}>Guardar</button>
            </div>
          </div>
        ) : (
          <div style={{
            padding: "10px 14px", borderRadius: 18,
            background: isUnread && !isOwn ? colors.pinkLight : bubbleBg,
            color: textColor, fontSize: 14, lineHeight: 1.4,
            wordBreak: "break-word",
            border: isUnread && !isOwn ? `1px solid ${colors.pink}` : "none",
          }}>
            {message.text}
          </div>
        )}

        {/* Timestamp + editado */}
        {!isEditing && !isConfirmingDelete && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3, padding: "0 4px" }}>
            <span style={{ fontSize: 11, color: colors.textMuted }}>{formatTime(message.createdAt)}</span>
            {message.edited && !isDeleted && (
              <span style={{ fontSize: 11, color: colors.textMuted, fontStyle: "italic" }}>(editado)</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
