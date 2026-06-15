// src/components/chat/utils.js

export function formatRelativeTime(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "ahora";
  if (minutes < 60) return `hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "ayer";
  if (days < 7) return `hace ${days} días`;

  return new Date(date).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

// Texto de estado de actividad: 🟢 Activo ahora / 🌙 No molestar / ⚫ Activo hace X / ⚫ Desconectado
export function formatPresence(presence) {
  if (!presence) return "";
  const { online, lastSeen, doNotDisturb } = presence;

  if (doNotDisturb) return "🌙 No molestar";
  if (online) return "🟢 Activo ahora";
  if (!lastSeen) return "⚫ Desconectado";

  const relative = formatRelativeTime(lastSeen);
  return relative === "ahora" ? "⚫ Activo ahora" : `⚫ Activo ${relative}`;
}

export function formatTime(date) {
  return new Date(date).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

export function getInitials(name = "") {
  return name.trim().charAt(0).toUpperCase() || "?";
}

// Devuelve el participante distinto a currentUser
export function getOtherParticipant(conversation, currentUserId) {
  const { participantA, participantB } = conversation;
  return participantA?._id === currentUserId ? participantB : participantA;
}

// Devuelve el conteo de no leídos para currentUser dentro de una conversación
export function getUnreadCount(conversation, currentUserId) {
  return conversation.participantA?._id === currentUserId
    ? conversation.unreadCountA
    : conversation.unreadCountB;
}

// Indica si userId está presente en una lista de ids (string u ObjectId)
export function isInList(list, userId) {
  return Array.isArray(list) && list.some((id) => id?.toString() === userId?.toString());
}
