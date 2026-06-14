// src/components/chat/TypingIndicator.jsx

export default function TypingIndicator({ isTyping, userName, colors }) {
  if (!isTyping) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 14px 8px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        background: colors.surfaceAlt, borderRadius: 18, padding: "8px 12px",
      }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: colors.textMuted,
              display: "inline-block",
              animation: `typingDotPulse 1.2s ${i * 0.15}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
      <span style={{ fontSize: 12, color: colors.textMuted, fontStyle: "italic" }}>
        {userName} está escribiendo...
      </span>

      <style>{`
        @keyframes typingDotPulse {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-3px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
