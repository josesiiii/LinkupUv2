// src/components/chat/ChatLayout.jsx
// Fase 2: conectado a datos reales vía Socket.io + REST (useChat).
import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import useAuthStore from "../../store/authStore";
import useChat from "../../hooks/useChat";
import api from "../../api/axios";
import ConversationItem from "./ConversationItem";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import Avatar from "./Avatar";
import { getOtherParticipant } from "./utils";

export default function ChatLayout() {
  const { colors } = useTheme();
  const { usuario, token } = useAuthStore();

  const currentUser = useMemo(
    () => ({
      _id: usuario?._id,
      name: usuario?.fullName,
      avatar: usuario?.profilePicture || null,
      token,
    }),
    [usuario, token]
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeRoomId, setActiveRoomId] = useState(null);
  const [pendingOtherUser, setPendingOtherUser] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [draftText, setDraftText] = useState("");
  const [deletingConfirmId, setDeletingConfirmId] = useState(null);
  const [mobileView, setMobileView] = useState("list"); // "list" | "chat"

  const typingLockRef = useRef(false);
  const typingUnlockTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const {
    conversations,
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    typingUsers,
    socket,
  } = useChat({ roomId: activeRoomId, currentUser });

  // Resuelve el parámetro ?with=<userId> para iniciar/abrir un chat
  useEffect(() => {
    const withId = searchParams.get("with");
    if (!withId || !currentUser?._id) return;

    const existing = conversations.find(
      (c) => getOtherParticipant(c, currentUser._id)?._id === withId
    );

    if (existing) {
      setActiveRoomId(existing.roomId);
      setPendingOtherUser(null);
      setMobileView("chat");
      setSearchParams({}, { replace: true });
      return;
    }

    api
      .get(`/users/${withId}`)
      .then((res) => {
        const user = res.data;
        setPendingOtherUser({
          _id: user._id,
          name: user.fullName,
          avatar: user.profilePicture || null,
        });
        setActiveRoomId([currentUser._id, withId].sort().join("_"));
        setMobileView("chat");
      })
      .finally(() => setSearchParams({}, { replace: true }));
  }, [searchParams, conversations, currentUser?._id, setSearchParams]);

  // Selecciona la primera conversación automáticamente
  useEffect(() => {
    if (!activeRoomId && !searchParams.get("with") && conversations.length > 0) {
      setActiveRoomId(conversations[0].roomId);
    }
  }, [conversations, activeRoomId, searchParams]);

  const activeConversation = conversations.find((c) => c.roomId === activeRoomId);
  const otherParticipant = activeConversation
    ? getOtherParticipant(activeConversation, currentUser._id)
    : pendingOtherUser;

  const visibleMessages = messages;
  const isTyping = typingUsers.length > 0;
  const typingUserName = typingUsers[0]?.userName ?? "";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages.length, activeRoomId]);

  useEffect(() => {
    return () => clearTimeout(typingUnlockTimeoutRef.current);
  }, []);

  // Si la conversación pendiente ya existe en la lista, limpiar el estado "pendiente"
  useEffect(() => {
    if (pendingOtherUser && activeConversation) {
      setPendingOtherUser(null);
    }
  }, [pendingOtherUser, activeConversation]);

  const handleSelectConversation = (conv) => {
    setActiveRoomId(conv.roomId);
    setPendingOtherUser(null);
    setEditingMessageId(null);
    setDeletingConfirmId(null);
    setDraftText("");
    setMobileView("chat");
  };

  const handleBackToList = () => {
    setMobileView("list");
  };

  const handleTyping = () => {
    if (!socket || !activeRoomId || typingLockRef.current) return;
    socket.emit("typing", { roomId: activeRoomId, userId: currentUser._id });
    typingLockRef.current = true;
    typingUnlockTimeoutRef.current = setTimeout(() => {
      typingLockRef.current = false;
    }, 2000);
  };

  const handleSend = () => {
    const text = draftText.trim();
    if (!text) return;
    sendMessage(text);
    setDraftText("");
    clearTimeout(typingUnlockTimeoutRef.current);
    typingLockRef.current = false;
  };

  const handleEditStart = (message) => {
    setEditingMessageId(message._id);
    setDraftText(message.text);
    setDeletingConfirmId(null);
  };

  const handleEditCancel = () => {
    setEditingMessageId(null);
    setDraftText("");
  };

  const handleEditSave = () => {
    const text = draftText.trim();
    if (!text) return;
    editMessage(editingMessageId, text);
    setEditingMessageId(null);
    setDraftText("");
  };

  const handleDeleteRequest = (messageId) => {
    setDeletingConfirmId(messageId);
  };

  const handleDeleteCancel = () => {
    setDeletingConfirmId(null);
  };

  const handleDeleteConfirm = (messageId) => {
    deleteMessage(messageId);
    setDeletingConfirmId(null);
  };

  return (
    <div className="chat-layout" style={{ display: "flex", height: "100%", background: colors.bg, borderRadius: 24, overflow: "hidden", border: `1px solid ${colors.border}` }}>
      {/* Sidebar de conversaciones */}
      <div className={`chat-sidebar ${mobileView === "chat" ? "is-hidden-mobile" : ""}`} style={{
        width: 320, flexShrink: 0, borderRight: `1px solid ${colors.border}`,
        display: "flex", flexDirection: "column", background: colors.surface,
      }}>
        <div style={{ padding: "20px 18px 12px" }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: colors.textDark }}>Mensajes</h2>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {conversations.map((conv) => (
            <ConversationItem
              key={conv._id}
              conversation={conv}
              currentUser={currentUser}
              isActive={conv.roomId === activeRoomId}
              onClick={() => handleSelectConversation(conv)}
              colors={colors}
            />
          ))}
        </div>
      </div>

      {/* Panel de mensajes */}
      <div className={`chat-panel ${mobileView === "list" ? "is-hidden-mobile" : ""}`} style={{
        flex: 1, display: "flex", flexDirection: "column", minWidth: 0,
      }}>
        {activeConversation || pendingOtherUser ? (
          <>
            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "14px 18px", borderBottom: `1px solid ${colors.border}`,
              background: colors.surface,
            }}>
              <button
                className="chat-back-btn"
                onClick={handleBackToList}
                style={{
                  display: "none", border: "none", background: "transparent",
                  cursor: "pointer", color: colors.textDark, padding: 4,
                }}
              >
                <ArrowLeft size={20} />
              </button>
              <Avatar name={otherParticipant?.name} src={otherParticipant?.avatar} size={40} colors={colors} />
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colors.textDark }}>
                  {otherParticipant?.name || "Usuario"}
                </p>
              </div>
            </div>

            {/* Mensajes */}
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              {visibleMessages.map((message) => (
                <MessageBubble
                  key={message._id}
                  message={message}
                  currentUser={currentUser}
                  otherParticipant={otherParticipant}
                  colors={colors}
                  isEditing={editingMessageId === message._id}
                  draftText={draftText}
                  onEditChange={setDraftText}
                  onEditStart={() => handleEditStart(message)}
                  onEditSave={handleEditSave}
                  onEditCancel={handleEditCancel}
                  isConfirmingDelete={deletingConfirmId === message._id}
                  onDeleteRequest={() => handleDeleteRequest(message._id)}
                  onDeleteConfirm={() => handleDeleteConfirm(message._id)}
                  onDeleteCancel={handleDeleteCancel}
                />
              ))}
              <TypingIndicator isTyping={isTyping} userName={typingUserName} colors={colors} />
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput
              value={editingMessageId ? "" : draftText}
              onChange={setDraftText}
              onSend={handleSend}
              onTyping={handleTyping}
              disabled={!!editingMessageId}
              colors={colors}
            />
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: colors.textMuted, fontSize: 14 }}>
            Selecciona una conversación
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .chat-sidebar.is-hidden-mobile, .chat-panel.is-hidden-mobile { display: none; }
          .chat-sidebar { width: 100% !important; }
          .chat-back-btn { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
}
