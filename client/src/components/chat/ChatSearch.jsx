// src/components/chat/ChatSearch.jsx
import { useEffect, useRef, useState } from "react";
import { Search, X, MessageSquare } from "lucide-react";
import api from "../../api/axios";
import Avatar from "./Avatar";
import { getOtherParticipant } from "./utils";

const DEBOUNCE_MS = 300;

export default function ChatSearch({ colors, currentUser, onSelectConversation, onSelectMessage }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ conversations: [], messages: [] });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults({ conversations: [], messages: [] });
      return;
    }
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      api.get("/messages/search", { params: { q: query.trim() } })
        .then((res) => setResults({ conversations: res.data?.conversations || [], messages: res.data?.messages || [] }))
        .catch(() => setResults({ conversations: [], messages: [] }))
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleClear = () => {
    setQuery("");
    setResults({ conversations: [], messages: [] });
  };

  const hasResults = results.conversations.length > 0 || results.messages.length > 0;
  const showPanel = open && query.trim().length > 0;

  return (
    <div ref={containerRef} style={{ position: "relative", padding: "0 14px 10px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: colors.surfaceAlt, borderRadius: 12, padding: "8px 12px",
        border: `1px solid ${colors.border}`,
      }}>
        <Search size={15} color={colors.textMuted} style={{ flexShrink: 0 }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Buscar en mensajes..."
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontSize: 13, color: colors.textDark, fontFamily: "'Inter', sans-serif",
          }}
        />
        {query && (
          <button onClick={handleClear} style={{ border: "none", background: "transparent", cursor: "pointer", color: colors.textMuted, display: "flex", flexShrink: 0 }}>
            <X size={14} />
          </button>
        )}
      </div>

      {showPanel && (
        <div style={{
          position: "absolute", top: "calc(100% - 6px)", left: 14, right: 14,
          zIndex: 40, maxHeight: 360, overflowY: "auto",
          background: colors.surface, border: `1px solid ${colors.border}`,
          borderRadius: 14, boxShadow: "0 16px 40px rgba(0,0,0,0.16)",
        }}>
          {loading && (
            <p style={{ margin: 0, padding: "14px 16px", fontSize: 13, color: colors.textMuted }}>Buscando...</p>
          )}

          {!loading && !hasResults && (
            <p style={{ margin: 0, padding: "14px 16px", fontSize: 13, color: colors.textMuted }}>Sin resultados para "{query}"</p>
          )}

          {!loading && results.conversations.length > 0 && (
            <div style={{ padding: "8px 0" }}>
              <p style={{ margin: 0, padding: "4px 16px", fontSize: 11, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Conversaciones
              </p>
              {results.conversations.map((conv) => {
                const persona = getOtherParticipant(conv, currentUser._id);
                return (
                  <button
                    key={conv._id}
                    onClick={() => { onSelectConversation?.(conv); setOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, width: "100%",
                      padding: "8px 16px", border: "none", background: "transparent",
                      cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <Avatar name={persona?.fullName} src={persona?.profilePicture} size={32} colors={colors} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: colors.textDark }}>{persona?.fullName}</span>
                  </button>
                );
              })}
            </div>
          )}

          {!loading && results.messages.length > 0 && (
            <div style={{ padding: "4px 0 8px" }}>
              <p style={{ margin: 0, padding: "4px 16px", fontSize: 11, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Mensajes
              </p>
              {results.messages.map((msg) => (
                <button
                  key={msg._id}
                  onClick={() => { onSelectMessage?.(msg); setOpen(false); }}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: 10, width: "100%",
                    padding: "8px 16px", border: "none", background: "transparent",
                    cursor: "pointer", textAlign: "left",
                  }}
                >
                  <MessageSquare size={15} color={colors.pink} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 12, fontWeight: 700, color: colors.textDark }}>
                      {msg.sender?._id === currentUser._id ? "Tú" : msg.sender?.fullName || "Usuario"}
                    </span>
                    <span style={{ display: "block", fontSize: 13, color: colors.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {msg.text}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
