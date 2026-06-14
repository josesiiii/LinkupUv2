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
