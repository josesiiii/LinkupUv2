// src/lib/socket.js
import { io } from "socket.io-client";

let socket = null;

export function getSocket(token) {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      autoConnect: false,
    });
  } else if (token) {
    socket.auth = { token };
  }
  return socket;
}

// Disconnects and discards the current socket so the next getSocket() call
// creates a fresh connection (used when switching between accounts).
export function resetSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
