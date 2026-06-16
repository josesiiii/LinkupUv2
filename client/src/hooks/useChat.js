// src/hooks/useChat.js
// Fase 2: hook que conecta la UI de chat (Fase 1) a datos reales vía
// Socket.io + REST, sin cambiar la forma en que los componentes consumen los datos.
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import api from "../api/axios";
import { getSocket } from "../lib/socket";
import { getOtherParticipant } from "../components/chat/utils";

const normalizeUser = (user) =>
  user && {
    _id: user._id,
    name: user.fullName,
    avatar: user.profilePicture || null,
    hasActiveStory: user.hasActiveStory || false,
  };

const normalizeConversation = (conv) => ({
  ...conv,
  participantA: normalizeUser(conv.participantA),
  participantB: normalizeUser(conv.participantB),
});

const normalizeMessage = (msg, conversationId) => ({
  ...msg,
  conversation: msg.conversation || conversationId,
  sender: normalizeUser(msg.sender) || msg.sender,
});

export default function useChat({ roomId, currentUser }) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [presence, setPresence] = useState({});

  const roomIdRef = useRef(roomId);
  roomIdRef.current = roomId;

  const conversationsRef = useRef(conversations);
  conversationsRef.current = conversations;

  const typingTimeoutsRef = useRef(new Map());

  const socket = useMemo(
    () => (currentUser?.token ? getSocket(currentUser.token) : null),
    [currentUser?.token]
  );

  const activeConversationId = useMemo(
    () => conversations.find((c) => c.roomId === roomId)?._id ?? null,
    [roomId, conversations]
  );

  // Conexión del socket
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, [socket]);

  const fetchConversations = useCallback(() => {
    return api
      .get("/messages/conversations")
      .then((res) => setConversations((res.data || []).map(normalizeConversation)))
      .catch(() => setConversations([]));
  }, []);

  // Carga inicial de conversaciones
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Carga de mensajes de la conversación activa
  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    api
      .get(`/messages/conversation/${activeConversationId}`)
      .then((res) =>
        setMessages((res.data || []).map((m) => normalizeMessage(m, activeConversationId)))
      )
      .catch(() => setMessages([]));
  }, [activeConversationId]);

  // Unirse/salir de la sala + marcar como leído
  useEffect(() => {
    if (!socket || !roomId || !isConnected || !currentUser?._id) return;

    socket.emit("join:room", { roomId });
    socket.emit("messages:read", { roomId, userId: currentUser._id });

    return () => {
      socket.emit("leave:room", { roomId });
    };
  }, [socket, roomId, isConnected, currentUser?._id]);

  // Listeners de eventos en tiempo real
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (payload) => {
      if (payload.roomId === roomIdRef.current) {
        setMessages((prev) => [
          ...prev,
          normalizeMessage(payload, payload.conversationId),
        ]);
      }

      if (!conversationsRef.current.some((c) => c.roomId === payload.roomId)) {
        // Conversación recién creada por el servidor (primer mensaje) — refrescar el listado
        fetchConversations();
        return;
      }

      setConversations((prev) =>
        prev.map((c) => {
          if (c.roomId !== payload.roomId) return c;

          const updated = { ...c, lastMessage: payload.text, lastMessageAt: payload.createdAt };

          if (payload.roomId !== roomIdRef.current && payload.sender._id !== currentUser?._id) {
            if (c.participantA?._id === currentUser?._id) {
              updated.unreadCountA = (c.unreadCountA || 0) + 1;
            } else {
              updated.unreadCountB = (c.unreadCountB || 0) + 1;
            }
          }

          return updated;
        })
      );
    };

    const handleTyping = ({ userId, userName }) => {
      setTypingUsers((prev) => {
        const exists = prev.some((u) => u.userId === userId);
        return exists ? prev : [...prev, { userId, userName }];
      });

      clearTimeout(typingTimeoutsRef.current.get(userId));
      const timeout = setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
        typingTimeoutsRef.current.delete(userId);
      }, 2000);
      typingTimeoutsRef.current.set(userId, timeout);
    };

    const handleMessageEdited = ({ messageId, text, editedAt }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, text, edited: true, editedAt } : m))
      );
    };

    const handleMessageDeleted = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, text: "DELETED", deletedForEveryone: true } : m))
      );
    };

    const handleMessageDeletedForMe = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
    };

    const handleMessagePinned = ({ messageId, pinnedAt }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, pinned: true, pinnedAt } : m))
      );
    };

    const handleMessageUnpinned = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, pinned: false, pinnedAt: null } : m))
      );
    };

    const handleMessageStarred = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId ? { ...m, starredBy: [...(m.starredBy || []), currentUser._id] } : m
        )
      );
    };

    const handleMessageUnstarred = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === messageId
            ? { ...m, starredBy: (m.starredBy || []).filter((id) => id !== currentUser._id) }
            : m
        )
      );
    };

    const handleMessagesRead = ({ roomId: readRoomId, readerId }) => {
      if (readRoomId !== roomIdRef.current) return;

      setMessages((prev) =>
        prev.map((m) =>
          m.readBy?.includes(readerId) ? m : { ...m, readBy: [...(m.readBy || []), readerId] }
        )
      );
    };

    const handlePresenceBulk = ({ presences }) => {
      setPresence((prev) => {
        const next = { ...prev };
        presences.forEach((p) => {
          next[p.userId] = { online: p.online, lastSeen: p.lastSeen, doNotDisturb: p.doNotDisturb };
        });
        return next;
      });
    };

    const handlePresenceUpdate = ({ userId, online, lastSeen }) => {
      setPresence((prev) => ({
        ...prev,
        [userId]: { ...prev[userId], online, lastSeen: lastSeen ?? prev[userId]?.lastSeen ?? null },
      }));
    };

    socket.on("message:new", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("message:edited", handleMessageEdited);
    socket.on("message:deleted", handleMessageDeleted);
    socket.on("message:deleted-for-me", handleMessageDeletedForMe);
    socket.on("message:pinned", handleMessagePinned);
    socket.on("message:unpinned", handleMessageUnpinned);
    socket.on("message:starred", handleMessageStarred);
    socket.on("message:unstarred", handleMessageUnstarred);
    socket.on("messages:read", handleMessagesRead);
    socket.on("presence:bulk", handlePresenceBulk);
    socket.on("presence:update", handlePresenceUpdate);

    return () => {
      socket.off("message:new", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("message:edited", handleMessageEdited);
      socket.off("message:deleted", handleMessageDeleted);
      socket.off("message:deleted-for-me", handleMessageDeletedForMe);
      socket.off("message:pinned", handleMessagePinned);
      socket.off("message:unpinned", handleMessageUnpinned);
      socket.off("message:starred", handleMessageStarred);
      socket.off("message:unstarred", handleMessageUnstarred);
      socket.off("messages:read", handleMessagesRead);
      socket.off("presence:bulk", handlePresenceBulk);
      socket.off("presence:update", handlePresenceUpdate);
      typingTimeoutsRef.current.forEach(clearTimeout);
      typingTimeoutsRef.current.clear();
    };
  }, [socket, currentUser?._id, fetchConversations]);

  // Solicita el estado de presencia de los participantes de cada conversación
  useEffect(() => {
    if (!socket || !isConnected || !currentUser?._id || conversations.length === 0) return;

    const ids = [
      ...new Set(
        conversations
          .map((c) => getOtherParticipant(c, currentUser._id)?._id)
          .filter(Boolean)
      ),
    ];
    if (ids.length === 0) return;

    socket.emit("presence:request", { userIds: ids });
  }, [socket, isConnected, currentUser?._id, conversations.length]);

  const sendMessage = useCallback(
    (text, replyToId) => {
      if (!socket || !roomId || !text.trim() || !currentUser?._id) return;
      socket.emit("message:send", { roomId, text: text.trim(), senderId: currentUser._id, replyTo: replyToId || null });
    },
    [socket, roomId, currentUser?._id]
  );

  const deleteMessageForMe = useCallback(
    (messageId) => {
      if (!socket) return;
      socket.emit("message:delete-for-me", { messageId });
    },
    [socket]
  );

  const togglePinMessage = useCallback(
    (messageId, pinned) => {
      if (!socket || !roomId) return;
      socket.emit(pinned ? "message:unpin" : "message:pin", { messageId, roomId });
    },
    [socket, roomId]
  );

  const toggleStarMessage = useCallback(
    (messageId, starred) => {
      if (!socket) return;
      socket.emit(starred ? "message:unstar" : "message:star", { messageId });
    },
    [socket]
  );

  const forwardMessage = useCallback(async (messageId, toUserIds) => {
    try {
      await api.post("/messages/forward", { messageId, toUserIds });
      return true;
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo reenviar el mensaje");
      return false;
    }
  }, []);

  const editMessage = useCallback(
    (messageId, text) => {
      if (!socket || !roomId || !text.trim()) return;
      socket.emit("message:edit", { messageId, text: text.trim(), roomId });
    },
    [socket, roomId]
  );

  const deleteMessage = useCallback(
    (messageId) => {
      if (!socket || !roomId) return;
      socket.emit("message:delete", { messageId, roomId });
    },
    [socket, roomId]
  );

  // Acciones sobre la conversación: archivar, fijar, silenciar, marcar como leído
  const updateConversation = useCallback(
    async (conversationId, action) => {
      try {
        const res = await api.patch(`/conversations/${conversationId}`, { action });
        setConversations((prev) =>
          prev.map((c) => (c._id === conversationId ? { ...c, ...res.data } : c))
        );
        return res.data;
      } catch (err) {
        alert(err.response?.data?.message || "No se pudo actualizar la conversación");
        return null;
      }
    },
    []
  );

  // Eliminar conversación (y sus mensajes) por completo
  const removeConversation = useCallback(
    async (conversationId) => {
      try {
        await api.delete(`/conversations/${conversationId}`);
        setConversations((prev) => prev.filter((c) => c._id !== conversationId));
        return true;
      } catch (err) {
        alert(err.response?.data?.message || "No se pudo eliminar la conversación");
        return false;
      }
    },
    []
  );

  // Bloquear/desbloquear usuario
  const blockUser = useCallback(async (userId) => {
    try {
      await api.post(`/users/${userId}/block`);
      return true;
    } catch (err) {
      alert(err.response?.data?.message || "No se pudo bloquear al usuario");
      return false;
    }
  }, []);

  return {
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
    isConnected,
    socket,
    presence,
    updateConversation,
    removeConversation,
    blockUser,
  };
}
