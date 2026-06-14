// src/components/chat/ChatInput.jsx
import { useRef, useEffect } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ value, onChange, onSend, onTyping, disabled, colors }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    onTyping?.();
  };

  const handleSend = () => {
    if (disabled) return;
    if (!value.trim()) return;
    onSend();
  };

  return (
    <div style={{
      display: "flex", alignItems: "flex-end", gap: 10,
      padding: "12px 16px", borderTop: `1px solid ${colors.border}`,
      background: colors.surface,
    }}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={disabled ? "Termina de editar el mensaje..." : "Escribe un mensaje..."}
        rows={1}
        style={{
          flex: 1, resize: "none", border: `1px solid ${colors.border}`,
          borderRadius: 20, padding: "10px 16px", fontSize: 14,
          fontFamily: "'Inter', sans-serif", outline: "none",
          background: disabled ? colors.surfaceAlt : colors.bg,
          color: colors.textDark, maxHeight: 120,
          opacity: disabled ? 0.6 : 1,
        }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        style={{
          width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "none", cursor: disabled || !value.trim() ? "default" : "pointer",
          background: disabled || !value.trim() ? colors.surfaceAlt : colors.pink,
          color: disabled || !value.trim() ? colors.textMuted : "#fff",
          transition: "background 150ms",
        }}
      >
        <Send size={18} />
      </button>
    </div>
  );
}
