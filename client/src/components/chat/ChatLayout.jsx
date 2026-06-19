// src/components/chat/ChatLayout.jsx
// Fase 2: conectado a datos reales vía Socket.io + REST (useChat).
import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pin, X, Eye, User } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import useAuthStore from "../../store/authStore";
import useChat from "../../hooks/useChat";
import api from "../../api/axios";
import AccountSwitcher from "../layout/AccountSwitcher";
import ConversationItem from "./ConversationItem";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";
import Avatar from "./Avatar";
import Modal from "../ui/Modal";
import PortalDropdown from "../ui/PortalDropdown";
import StoryViewer from "../stories/StoryViewer";
import ContactProfileModal from "./ContactProfileModal";
import ChatSearch from "./ChatSearch";
import { getOtherParticipant, formatPresence, isInList } from "./utils";

const HIGHLIGHT_MS = 600;

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
  const [showArchived, setShowArchived] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [forwardTarget, setForwardTarget] = useState(null);
  const [forwardConnections, setForwardConnections] = useState([]);
  const [profileModalUser, setProfileModalUser] = useState(null);

  // Story viewer integrado al chat
  const [chatStoriesFeed, setChatStoriesFeed] = useState([]);
  const [chatStoryViewerOpen, setChatStoryViewerOpen] = useState(false);
  const [chatStoryAuthorIdx, setChatStoryAuthorIdx] = useState(0);
  const [chatStoryIdx, setChatStoryIdx] = useState(0);
  const [headerAvatarMenuOpen, setHeaderAvatarMenuOpen] = useState(false);
  const headerAvatarRef = useRef(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState(null);
  const [highlightedConversationId, setHighlightedConversationId] = useState(null);
  const [pendingHighlightMessageId, setPendingHighlightMessageId] = useState(null);

  const typingLockRef = useRef(false);
  const typingUnlockTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messageRefs = useRef(new Map());

  const {
    conversations,
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    deleteMessageForMe,
    togglePinMessage,
    toggleStarMessage,
    forwardMessage,
    typingUsers,
    socket,
    presence,
    updateConversation,
    removeConversation,
    blockUser,
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

  const pinnedCount = useMemo(
    () => conversations.filter((c) => isInList(c.pinnedBy, currentUser._id)).length,
    [conversations, currentUser._id]
  );

  const sortedConversations = useMemo(() => {
    const pinned = conversations.filter((c) => isInList(c.pinnedBy, currentUser._id));
    const rest = conversations.filter((c) => !isInList(c.pinnedBy, currentUser._id));
    return [...pinned, ...rest];
  }, [conversations, currentUser._id]);

  const visibleConversations = useMemo(
    () => sortedConversations.filter((c) => isInList(c.archivedBy, currentUser._id) === showArchived),
    [sortedConversations, showArchived, currentUser._id]
  );

  const visibleMessages = messages;
  const pinnedMessages = useMemo(() => messages.filter((m) => m.pinned), [messages]);
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

  // Carga conexiones para el selector de "Reenviar"
  useEffect(() => {
    if (!forwardTarget) return;
    api.get("/connections/accepted")
      .then((res) => setForwardConnections(res.data || []))
      .catch(() => setForwardConnections([]));
  }, [forwardTarget]);

  const handleSelectConversation = (conv) => {
    setActiveRoomId(conv.roomId);
    setPendingOtherUser(null);
    setEditingMessageId(null);
    setDeletingConfirmId(null);
    setDraftText("");
    setMobileView("chat");
  };

  // Resultado de búsqueda → abre la conversación y resalta la fila en el sidebar
  const handleSearchSelectConversation = (conv) => {
    handleSelectConversation(conv);
    setHighlightedConversationId(conv._id);
    setTimeout(() => setHighlightedConversationId(null), HIGHLIGHT_MS);
  };

  // Resultado de búsqueda → abre la conversación del mensaje y deja pendiente
  // el scroll+resaltado hasta que los mensajes de esa conversación carguen.
  const handleSearchSelectMessage = (msg) => {
    const conversationId = msg.conversation?._id || msg.conversation;
    const conv = conversations.find((c) => c._id === conversationId);
    if (!conv) return;
    handleSelectConversation(conv);
    setHighlightedConversationId(conv._id);
    setTimeout(() => setHighlightedConversationId(null), HIGHLIGHT_MS);
    setPendingHighlightMessageId(msg._id);
  };

  // Cuando el mensaje pendiente aparece en la conversación activa, hace scroll y lo resalta.
  useEffect(() => {
    if (!pendingHighlightMessageId) return;
    const el = messageRefs.current.get(pendingHighlightMessageId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightedMessageId(pendingHighlightMessageId);
    setPendingHighlightMessageId(null);
    const timeout = setTimeout(() => setHighlightedMessageId(null), HIGHLIGHT_MS);
    return () => clearTimeout(timeout);
  }, [pendingHighlightMessageId, messages]);

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
    sendMessage(text, replyingTo?._id);
    setDraftText("");
    setReplyingTo(null);
    clearTimeout(typingUnlockTimeoutRef.current);
    typingLockRef.current = false;
  };

  const handleReply = (message) => setReplyingTo(message);
  const handleCancelReply = () => setReplyingTo(null);

  const handleTogglePin = (message, isPinned) => togglePinMessage(message._id, isPinned);
  const handleToggleStar = (message, isStarred) => toggleStarMessage(message._id, isStarred);
  const handleDeleteForMe = (messageId) => deleteMessageForMe(messageId);

  const handleForwardOpen = (message) => setForwardTarget(message);

  const handleForwardTo = async (userId) => {
    if (!forwardTarget) return;
    const ok = await forwardMessage(forwardTarget._id, [userId]);
    if (ok) setForwardTarget(null);
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

  const handlePin = (id) => updateConversation(id, "pin");
  const handleUnpin = (id) => updateConversation(id, "unpin");
  const handleMute = (id) => updateConversation(id, "mute");
  const handleUnmute = (id) => updateConversation(id, "unmute");
  const handleArchive = (id) => updateConversation(id, "archive");
  const handleUnarchive = (id) => updateConversation(id, "unarchive");
  const handleMarkRead = (id) => updateConversation(id, "markRead");
  const handleBlockUser = (userId) => blockUser(userId);

  const handleOpenStory = async (userId) => {
    try {
      const res = await api.get("/stories/feed");
      const feed = Array.isArray(res.data) ? res.data : [];
      const idx = feed.findIndex((g) => g.author?._id === userId);
      if (idx >= 0) {
        setChatStoriesFeed(feed);
        setChatStoryAuthorIdx(idx);
        setChatStoryIdx(0);
        setChatStoryViewerOpen(true);
      }
    } catch {}
  };

  const handleChatStoryView = async (storyId) => {
    try { await api.post(`/stories/${storyId}/view`); } catch {}
  };

  const handleDeleteConversation = async (id) => {
    const conv = conversations.find((c) => c._id === id);
    const ok = await removeConversation(id);
    if (ok && conv?.roomId === activeRoomId) {
      setActiveRoomId(null);
    }
  };

  return (
    <div className="chat-layout" style={{ display: "flex", height: "100%", background: colors.bg, borderRadius: 24, overflow: "hidden", border: `1px solid ${colors.border}` }}>
      {/* Sidebar de conversaciones */}
      <div className={`chat-sidebar ${mobileView === "chat" ? "is-hidden-mobile" : ""}`} style={{
        width: 320, flexShrink: 0, borderRight: `1px solid ${colors.border}`,
        display: "flex", flexDirection: "column", background: colors.surface,
      }}>
        <div style={{ padding: "20px 18px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: colors.textDark }}>Mensajes</h2>
          <AccountSwitcher
            includeExtras
            align="right"
            trigger={({ toggle }) => (
              <button onClick={toggle} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, lineHeight: 0 }}>
                <Avatar name={usuario?.fullName} src={usuario?.profilePicture} size={32} colors={colors} />
              </button>
            )}
          />
        </div>
        <div style={{ padding: "0 14px 10px", display: "flex", gap: 8 }}>
          {[
            { key: false, label: "Chats" },
            { key: true, label: "Archivados" },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setShowArchived(tab.key)}
              style={{
                padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700,
                border: `1px solid ${colors.border}`, cursor: "pointer",
                background: showArchived === tab.key ? colors.pinkLight : "transparent",
                color: showArchived === tab.key ? colors.pink : colors.textMuted,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <ChatSearch
          colors={colors}
          currentUser={currentUser}
          onSelectConversation={handleSearchSelectConversation}
          onSelectMessage={handleSearchSelectMessage}
        />
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {visibleConversations.length === 0 && (
            <div style={{ padding: "24px 12px", textAlign: "center", color: colors.textMuted, fontSize: 13 }}>
              {showArchived ? "No tienes chats archivados" : "No tienes conversaciones"}
            </div>
          )}
          {visibleConversations.map((conv) => {
            const persona = getOtherParticipant(conv, currentUser._id);
            const isPinned = isInList(conv.pinnedBy, currentUser._id);
            return (
              <ConversationItem
                key={conv._id}
                conversation={conv}
                currentUser={currentUser}
                isActive={conv.roomId === activeRoomId}
                onClick={() => handleSelectConversation(conv)}
                colors={colors}
                presence={presence[persona?._id]}
                highlighted={conv._id === highlightedConversationId}
                disablePin={pinnedCount >= 3 && !isPinned}
                onPin={handlePin}
                onUnpin={handleUnpin}
                onMute={handleMute}
                onUnmute={handleUnmute}
                onArchive={handleArchive}
                onUnarchive={handleUnarchive}
                onMarkRead={handleMarkRead}
                onDelete={handleDeleteConversation}
                onBlock={handleBlockUser}
                onViewProfile={(persona) => navigate(`/users/${persona._id}`)}
                onViewStory={handleOpenStory}
              />
            );
          })}
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
              <div
                ref={headerAvatarRef}
                style={{ cursor: otherParticipant?._id ? "pointer" : "default", lineHeight: 0, position: "relative" }}
                onClick={() => {
                  if (!otherParticipant?._id) return;
                  if (otherParticipant?.hasActiveStory) {
                    setHeaderAvatarMenuOpen((v) => !v);
                  } else {
                    navigate(`/users/${otherParticipant._id}`);
                  }
                }}
              >
                <Avatar
                  name={otherParticipant?.name}
                  src={otherParticipant?.avatar}
                  size={40}
                  colors={colors}
                  online={!!presence[otherParticipant?._id]?.online}
                  showStatus={!!otherParticipant?._id}
                  hasStory={!!otherParticipant?.hasActiveStory}
                  userId={otherParticipant?._id}
                />
              </div>
              <PortalDropdown
                open={headerAvatarMenuOpen}
                onClose={() => setHeaderAvatarMenuOpen(false)}
                anchorRef={headerAvatarRef}
                align="left"
                items={[
                  { label: "Ver historia", icon: Eye, onClick: () => handleOpenStory(otherParticipant?._id) },
                  { label: "Ver perfil", icon: User, onClick: () => navigate(`/users/${otherParticipant?._id}`) },
                ]}
              />
              <div
                style={{ cursor: otherParticipant?._id ? "pointer" : "default" }}
                onClick={otherParticipant?._id ? () => navigate(`/users/${otherParticipant._id}`) : undefined}
              >
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: colors.textDark }}>
                  {otherParticipant?.name || "Usuario"}
                </p>
                {otherParticipant?._id && (
                  <p style={{ margin: "2px 0 0 0", fontSize: 12, color: colors.textMuted }}>
                    {formatPresence(presence[otherParticipant._id]) || "⚫ Desconectado"}
                  </p>
                )}
              </div>
            </div>

            {/* Mensajes fijados */}
            {pinnedMessages.length > 0 && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "8px 18px", borderBottom: `1px solid ${colors.border}`,
                background: colors.pinkLight, fontSize: 12, color: colors.textDark,
              }}>
                <Pin size={14} color={colors.pink} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {pinnedMessages[pinnedMessages.length - 1].text}
                </span>
                <button
                  onClick={() => handleTogglePin(pinnedMessages[pinnedMessages.length - 1], true)}
                  style={{ border: "none", background: "transparent", cursor: "pointer", color: colors.textMuted, display: "flex", flexShrink: 0 }}
                  title="Desfijar"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Mensajes */}
            <div className="chat-messages-scroll" style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              {visibleMessages.map((message) => (
                <div
                  key={message._id}
                  ref={(el) => {
                    if (el) messageRefs.current.set(message._id, el);
                    else messageRefs.current.delete(message._id);
                  }}
                  style={{
                    borderRadius: 18,
                    transition: "background 400ms ease, box-shadow 400ms ease",
                    background: highlightedMessageId === message._id ? colors.pinkLight : "transparent",
                    boxShadow: highlightedMessageId === message._id ? `0 0 0 3px ${colors.pink}33` : "none",
                  }}
                >
                  <MessageBubble
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
                    onReply={handleReply}
                    onForwardOpen={handleForwardOpen}
                    onTogglePin={handleTogglePin}
                    onToggleStar={handleToggleStar}
                    onDeleteForMe={handleDeleteForMe}
                    onAvatarClick={(userId) => navigate(`/users/${userId}`)}
                  />
                </div>
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
              replyingTo={replyingTo}
              onCancelReply={handleCancelReply}
            />
          </>
        ) : (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: colors.textMuted, fontSize: 14 }}>
            Selecciona una conversación
          </div>
        )}
      </div>

      <Modal open={!!forwardTarget} onClose={() => setForwardTarget(null)} title="Reenviar mensaje" maxWidth={400}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {forwardConnections.length === 0 && (
            <p style={{ fontSize: 13, color: colors.textMuted, margin: 0 }}>No tienes conexiones para reenviar.</p>
          )}
          {forwardConnections.map((conn) => {
            const persona = conn.from?._id === currentUser._id ? conn.to : conn.from;
            return (
              <button
                key={conn._id}
                onClick={() => handleForwardTo(persona?._id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "8px 10px", borderRadius: 12,
                  border: "none", background: "transparent", cursor: "pointer", textAlign: "left",
                }}
              >
                <Avatar name={persona?.fullName} src={persona?.profilePicture} size={32} colors={colors} />
                <span style={{ fontSize: 14, fontWeight: 600, color: colors.textDark }}>{persona?.fullName}</span>
              </button>
            );
          })}
        </div>
      </Modal>

      <ContactProfileModal
        open={!!profileModalUser}
        onClose={() => setProfileModalUser(null)}
        userId={profileModalUser?._id}
        presence={profileModalUser?._id ? presence[profileModalUser._id] : null}
        onOpenStory={(uid) => { setProfileModalUser(null); handleOpenStory(uid); }}
      />

      <StoryViewer
        open={chatStoryViewerOpen}
        onClose={() => setChatStoryViewerOpen(false)}
        storiesFeed={chatStoriesFeed}
        ownStories={[]}
        activeAuthorIndex={chatStoryAuthorIdx}
        activeStoryIndex={chatStoryIdx}
        setActiveAuthorIndex={setChatStoryAuthorIdx}
        setActiveStoryIndex={setChatStoryIdx}
        onView={handleChatStoryView}
        onDelete={() => {}}
      />

      <style>{`
        @media (max-width: 767px) {
          .chat-sidebar.is-hidden-mobile, .chat-panel.is-hidden-mobile { display: none; }
          .chat-sidebar { width: 100% !important; }
          .chat-back-btn { display: inline-flex !important; }
        }
        .chat-messages-scroll::-webkit-scrollbar { width: 4px; }
        .chat-messages-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-messages-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }
        .chat-messages-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.22); }
        .chat-messages-scroll { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.12) transparent; }
      `}</style>
    </div>
  );
}
