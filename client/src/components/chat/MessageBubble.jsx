// src/components/chat/MessageBubble.jsx
import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, Pencil, Trash2, Reply, Forward, Copy, Pin, PinOff, Star } from "lucide-react";
import Avatar from "./Avatar";
import Dropdown from "../ui/Dropdown";
import { formatTime } from "./utils";

export default function MessageBubble({
  message, currentUser, otherParticipant, colors,
  isEditing, draftText, onEditChange,
  onEditStart, onEditSave, onEditCancel,
  isConfirmingDelete, onDeleteRequest, onDeleteConfirm, onDeleteCancel,
  onReply, onForwardOpen, onTogglePin, onToggleStar, onDeleteForMe,
}) {
  const [hovered, setHovered] = useState(false);
  const textareaRef = useRef(null);

  const isOwn = message.sender._id === currentUser._id;
  const isDeleted = message.deletedForEveryone || message.text === "DELETED";
  const isUnread = !message.readBy?.includes(currentUser._id);
  const isPinned = !!message.pinned;
  const isStarred = !!message.starredBy?.includes(currentUser._id);

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

  const actions = [
    { id: "reply", label: "Responder", icon: Reply, onClick: () => onReply?.(message), visible: !isDeleted },
    { id: "forward", label: "Reenviar", icon: Forward, onClick: () => onForwardOpen?.(message), visible: !isDeleted },
    { id: "copy", label: "Copiar", icon: Copy, onClick: () => navigator.clipboard?.writeText(message.text), visible: !isDeleted },
    { id: "pin", label: isPinned ? "Desfijar mensaje" : "Fijar mensaje", icon: isPinned ? PinOff : Pin, onClick: () => onTogglePin?.(message, isPinned), visible: !isDeleted },
    { id: "star", label: isStarred ? "Quitar destacado" : "Destacar", icon: Star, onClick: () => onToggleStar?.(message, isStarred), visible: !isDeleted },
    { id: "edit", label: "Editar", icon: Pencil, onClick: () => onEditStart?.(), visible: isOwn && !isDeleted },
    { id: "deleteForMe", label: "Eliminar para mí", icon: Trash2, onClick: () => onDeleteForMe?.(message._id) },
    { id: "deleteForEveryone", label: "Eliminar para todos", icon: Trash2, danger: true, onClick: () => onDeleteRequest?.(), visible: isOwn && !isDeleted },
  ].filter((a) => a.visible !== false);

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
      onMouseLeave={() => setHovered(false)}
    >
      {!isOwn && <Avatar name={otherParticipant?.name} src={otherParticipant?.avatar} size={32} colors={colors} />}

      <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: isOwn ? "flex-end" : "flex-start", position: "relative" }}>
        {/* Menú de acciones */}
        {!isEditing && !isConfirmingDelete && (
          <div style={{ position: "absolute", top: -28, [isOwn ? "right" : "left"]: 0, opacity: hovered ? 1 : 0, transition: "opacity 150ms", zIndex: 5 }}>
            <Dropdown
              align={isOwn ? "right" : "left"}
              items={actions.map(({ icon, label, onClick, danger }) => ({ icon, label, onClick, danger }))}
              trigger={({ toggle }) => (
                <button
                  onClick={toggle}
                  style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: colors.surface, border: `1px solid ${colors.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: colors.textMuted,
                  }}
                >
                  <MoreHorizontal size={14} />
                </button>
              )}
            />
          </div>
        )}

        {/* Vista previa de respuesta */}
        {message.replyTo && !isEditing && (
          <div style={{
            borderLeft: `3px solid ${colors.pink}`, paddingLeft: 8, marginBottom: 4,
            maxWidth: "100%", boxSizing: "border-box",
          }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: colors.pink }}>
              {message.replyTo.sender?.fullName || message.replyTo.sender?.name || "Usuario"}
            </p>
            <p style={{ margin: 0, fontSize: 12, color: colors.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {message.replyTo.text}
            </p>
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
            <span>¿Eliminar para todos?</span>
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

        {/* Timestamp + editado + indicadores */}
        {!isEditing && !isConfirmingDelete && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3, padding: "0 4px" }}>
            {isPinned && <Pin size={11} color={colors.textMuted} />}
            {isStarred && <Star size={11} color={colors.textMuted} fill={colors.textMuted} />}
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
