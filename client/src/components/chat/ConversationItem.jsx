// src/components/chat/ConversationItem.jsx
import {
  MoreVertical, Trash2, Archive, ArchiveRestore,
  Pin, PinOff, CheckCheck, BellOff, Bell, Ban, User,
} from "lucide-react";
import Avatar from "./Avatar";
import Dropdown from "../ui/Dropdown";
import { formatRelativeTime, getOtherParticipant, getUnreadCount, isInList } from "./utils";

export default function ConversationItem({
  conversation, currentUser, isActive, onClick, colors, presence,
  onArchive, onUnarchive, onPin, onUnpin, onMute, onUnmute,
  onMarkRead, onDelete, onBlock, disablePin, onViewProfile,
}) {
  const persona = getOtherParticipant(conversation, currentUser._id);
  const unread = getUnreadCount(conversation, currentUser._id);
  const online = !!presence?.online;

  const isArchived = isInList(conversation.archivedBy, currentUser._id);
  const isPinned = isInList(conversation.pinnedBy, currentUser._id);
  const isMuted = isInList(conversation.mutedBy, currentUser._id);

  const menuItems = [
    { label: "Ver perfil", icon: User, onClick: () => onViewProfile?.(persona) },
    ...(unread > 0 ? [{ label: "Marcar como leído", icon: CheckCheck, onClick: () => onMarkRead?.(conversation._id) }] : []),
    isPinned
      ? { label: "Desfijar", icon: PinOff, onClick: () => onUnpin?.(conversation._id) }
      : { label: "Fijar", icon: Pin, disabled: disablePin, onClick: () => onPin?.(conversation._id) },
    isMuted
      ? { label: "Quitar silencio", icon: Bell, onClick: () => onUnmute?.(conversation._id) }
      : { label: "Silenciar", icon: BellOff, onClick: () => onMute?.(conversation._id) },
    isArchived
      ? { label: "Desarchivar", icon: ArchiveRestore, onClick: () => onUnarchive?.(conversation._id) }
      : { label: "Archivar", icon: Archive, onClick: () => onArchive?.(conversation._id) },
    {
      label: "Bloquear usuario", icon: Ban, danger: true,
      onClick: () => {
        if (persona?._id && window.confirm(`¿Bloquear a ${persona?.name || "este usuario"}? No podrán enviarse mensajes.`)) {
          onBlock?.(persona._id);
        }
      },
    },
    {
      label: "Eliminar chat", icon: Trash2, danger: true,
      onClick: () => {
        if (window.confirm("¿Eliminar esta conversación? Esta acción no se puede deshacer.")) {
          onDelete?.(conversation._id);
        }
      },
    },
  ];

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 14px", borderRadius: 16,
        cursor: "pointer",
        background: isActive ? colors.pinkLight : "transparent",
        transition: "background 150ms",
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = colors.surfaceAlt; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
    >
      <div
        onClick={(e) => { e.stopPropagation(); onViewProfile?.(persona); }}
        style={{ cursor: "pointer", flexShrink: 0, borderRadius: "50%", transition: "opacity 150ms" }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.8"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
      >
        <Avatar name={persona?.name} src={persona?.avatar} size={46} colors={colors} online={online} showStatus hasStory={!!persona?.hasActiveStory} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: colors.textDark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", alignItems: "center", gap: 4 }}>
            {isPinned && <Pin size={12} style={{ flexShrink: 0, color: colors.pink }} />}
            {persona?.name || "Usuario"}
          </p>
          <span style={{ fontSize: 11, color: colors.textMuted, flexShrink: 0 }}>
            {formatRelativeTime(conversation.lastMessageAt)}
          </span>
        </div>
        <p style={{
          margin: "2px 0 0 0", fontSize: 13, color: colors.textMuted,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {isMuted && "🔇 "}{conversation.lastMessage || "Sin mensajes aún"}
        </p>
      </div>

      {unread > 0 && (
        <span style={{
          minWidth: 20, height: 20, borderRadius: 10, padding: "0 6px",
          background: colors.pink, color: "#fff",
          fontSize: 11, fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {unread}
        </span>
      )}

      <div onClick={(e) => e.stopPropagation()}>
        <Dropdown
          align="right"
          items={menuItems}
          trigger={({ toggle }) => (
            <button
              onClick={toggle}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: 28, height: 28, borderRadius: "50%",
                border: "none", background: "transparent",
                color: colors.textMuted, cursor: "pointer", flexShrink: 0,
              }}
            >
              <MoreVertical size={16} />
            </button>
          )}
        />
      </div>
    </div>
  );
}
