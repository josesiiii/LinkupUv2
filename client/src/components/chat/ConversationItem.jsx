// src/components/chat/ConversationItem.jsx
import Avatar from "./Avatar";
import { formatRelativeTime, getOtherParticipant, getUnreadCount } from "./utils";

export default function ConversationItem({ conversation, currentUser, isActive, onClick, colors }) {
  const persona = getOtherParticipant(conversation, currentUser._id);
  const unread = getUnreadCount(conversation, currentUser._id);

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
      <Avatar name={persona?.name} src={persona?.avatar} size={46} colors={colors} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: colors.textDark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
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
          {conversation.lastMessage || "Sin mensajes aún"}
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
    </div>
  );
}
