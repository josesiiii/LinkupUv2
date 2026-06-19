import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// userId -> Set<socketId>, en memoria mientras el proceso esté vivo
const onlineUsers = new Map();

async function broadcastPresence(io, userId, online, lastSeen) {
  try {
    const convs = await Conversation.find({
      $or: [{ participantA: userId }, { participantB: userId }],
    }).select("participantA participantB");

    const partnerIds = new Set();
    convs.forEach((c) => {
      const a = c.participantA.toString();
      const b = c.participantB.toString();
      partnerIds.add(a === userId ? b : a);
    });

    partnerIds.forEach((pid) => {
      io.to(pid).emit("presence:update", { userId, online, lastSeen });
    });
  } catch (error) {
    console.error("Error en broadcastPresence:", error.message);
  }
}

export default function registerChatSocket(io) {
  // AUTENTICACIÓN JWT EN EL HANDSHAKE
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("No autorizado"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await User.findById(decoded.id).select("-password");
      if (!usuario) return next(new Error("Usuario no encontrado"));

      socket.userId = usuario._id.toString();
      socket.user = usuario;
      next();
    } catch (error) {
      next(new Error("Token inválido"));
    }
  });

  io.on("connection", (socket) => {
    // Sala personal: permite notificar al usuario aunque no tenga
    // la conversación abierta (actualizar su sidebar en vivo)
    socket.join(socket.userId);

    // Presencia: registrar este socket como conexión activa del usuario
    const sockets = onlineUsers.get(socket.userId) || new Set();
    const wasOffline = sockets.size === 0;
    sockets.add(socket.id);
    onlineUsers.set(socket.userId, sockets);
    if (wasOffline) {
      broadcastPresence(io, socket.userId, true, null);
    }

    socket.on("presence:request", async ({ userIds }) => {
      try {
        if (!Array.isArray(userIds) || userIds.length === 0) return;
        const usuarios = await User.find({ _id: { $in: userIds } }).select("lastSeen doNotDisturb");
        const presences = usuarios.map((u) => ({
          userId: u._id.toString(),
          online: onlineUsers.has(u._id.toString()),
          lastSeen: u.lastSeen,
          doNotDisturb: u.doNotDisturb,
        }));
        socket.emit("presence:bulk", { presences });
      } catch (error) {
        console.error("Error en presence:request:", error.message);
      }
    });

    socket.on("disconnect", async () => {
      const sockets = onlineUsers.get(socket.userId);
      if (!sockets) return;
      sockets.delete(socket.id);
      if (sockets.size === 0) {
        onlineUsers.delete(socket.userId);
        const lastSeen = new Date();
        try {
          await User.findByIdAndUpdate(socket.userId, { lastSeen });
        } catch (error) {
          console.error("Error guardando lastSeen:", error.message);
        }
        broadcastPresence(io, socket.userId, false, lastSeen);
      }
    });

    socket.on("join:room", ({ roomId }) => {
      socket.join(roomId);
    });

    socket.on("leave:room", ({ roomId }) => {
      socket.leave(roomId);
    });

    socket.on("message:send", async ({ roomId, text, replyTo, clientTempId }) => {
      try {
        if (!text?.trim()) return;

        const [idA, idB] = roomId.split("_");
        const otherUserId = idA === socket.userId ? idB : idA;

        const yaBloqueado = socket.user.blockedUsers?.some((id) => id.toString() === otherUserId);
        if (yaBloqueado) return;

        const recipient = await User.findById(otherUserId).select("blockedUsers");
        const meBloqueoAMi = recipient?.blockedUsers?.some((id) => id.toString() === socket.userId);
        if (meBloqueoAMi) return;

        let conversation = await Conversation.findOne({ roomId });

        if (!conversation) {
          conversation = await Conversation.create({
            roomId,
            participantA: idA,
            participantB: idB,
            lastMessage: text,
            lastMessageSender: socket.userId,
            lastMessageAt: new Date(),
            unreadCountA: idA === socket.userId ? 0 : 1,
            unreadCountB: idB === socket.userId ? 0 : 1,
          });
        } else {
          conversation.lastMessage = text;
          conversation.lastMessageSender = socket.userId;
          conversation.lastMessageAt = new Date();

          if (conversation.participantA.toString() === socket.userId) {
            conversation.unreadCountB += 1;
          } else {
            conversation.unreadCountA += 1;
          }

          await conversation.save();
        }

        let replyToData = null;
        if (replyTo) {
          const original = await Message.findById(replyTo).select("text sender").populate("sender", "fullName");
          if (original) {
            replyToData = {
              _id: original._id,
              text: original.text,
              sender: { _id: original.sender._id, fullName: original.sender.fullName },
            };
          }
        }

        const mensaje = await Message.create({
          conversation: conversation._id,
          sender: socket.userId,
          text: text.trim(),
          readBy: [socket.userId],
          replyTo: replyToData?._id || null,
        });

        const otherParticipantId =
          conversation.participantA.toString() === socket.userId
            ? conversation.participantB.toString()
            : conversation.participantA.toString();

        io.to(roomId).to(otherParticipantId).emit("message:new", {
          _id: mensaje._id,
          sender: {
            _id: socket.userId,
            fullName: socket.user.fullName,
            profilePicture: socket.user.profilePicture,
          },
          text: mensaje.text,
          createdAt: mensaje.createdAt,
          readBy: mensaje.readBy,
          roomId,
          conversationId: conversation._id,
          replyTo: replyToData,
          clientTempId: clientTempId || null,
        });
      } catch (error) {
        console.error("Error en message:send:", error.message);
      }
    });

    socket.on("typing", ({ roomId }) => {
      socket.to(roomId).emit("typing", {
        userId: socket.userId,
        userName: socket.user.fullName,
      });
    });

    socket.on("message:edit", async ({ messageId, text, roomId }) => {
      try {
        if (!text?.trim()) return;

        const mensaje = await Message.findById(messageId);
        if (!mensaje) return;
        if (mensaje.sender.toString() !== socket.userId) return;

        mensaje.text = text.trim();
        mensaje.edited = true;
        mensaje.editedAt = new Date();
        await mensaje.save();

        io.to(roomId).emit("message:edited", {
          messageId: mensaje._id,
          text: mensaje.text,
          editedAt: mensaje.editedAt,
        });
      } catch (error) {
        console.error("Error en message:edit:", error.message);
      }
    });

    socket.on("message:delete", async ({ messageId, roomId }) => {
      try {
        const mensaje = await Message.findById(messageId);
        if (!mensaje) return;
        if (mensaje.sender.toString() !== socket.userId) return;

        mensaje.text = "DELETED";
        mensaje.deletedForEveryone = true;
        await mensaje.save();

        io.to(roomId).emit("message:deleted", { messageId: mensaje._id });
      } catch (error) {
        console.error("Error en message:delete:", error.message);
      }
    });

    socket.on("message:delete-for-me", async ({ messageId }) => {
      try {
        const mensaje = await Message.findById(messageId);
        if (!mensaje) return;

        if (!mensaje.deletedFor.some((id) => id.toString() === socket.userId)) {
          mensaje.deletedFor.push(socket.userId);
          await mensaje.save();
        }

        socket.emit("message:deleted-for-me", { messageId: mensaje._id });
      } catch (error) {
        console.error("Error en message:delete-for-me:", error.message);
      }
    });

    socket.on("message:pin", async ({ messageId, roomId }) => {
      try {
        const mensaje = await Message.findById(messageId);
        if (!mensaje) return;

        mensaje.pinned = true;
        mensaje.pinnedAt = new Date();
        await mensaje.save();

        io.to(roomId).emit("message:pinned", { messageId: mensaje._id, pinnedAt: mensaje.pinnedAt });
      } catch (error) {
        console.error("Error en message:pin:", error.message);
      }
    });

    socket.on("message:unpin", async ({ messageId, roomId }) => {
      try {
        const mensaje = await Message.findById(messageId);
        if (!mensaje) return;

        mensaje.pinned = false;
        mensaje.pinnedAt = null;
        await mensaje.save();

        io.to(roomId).emit("message:unpinned", { messageId: mensaje._id });
      } catch (error) {
        console.error("Error en message:unpin:", error.message);
      }
    });

    socket.on("message:star", async ({ messageId }) => {
      try {
        const mensaje = await Message.findById(messageId);
        if (!mensaje) return;

        if (!mensaje.starredBy.some((id) => id.toString() === socket.userId)) {
          mensaje.starredBy.push(socket.userId);
          await mensaje.save();
        }

        socket.emit("message:starred", { messageId: mensaje._id });
      } catch (error) {
        console.error("Error en message:star:", error.message);
      }
    });

    socket.on("message:unstar", async ({ messageId }) => {
      try {
        const mensaje = await Message.findById(messageId);
        if (!mensaje) return;

        mensaje.starredBy = mensaje.starredBy.filter((id) => id.toString() !== socket.userId);
        await mensaje.save();

        socket.emit("message:unstarred", { messageId: mensaje._id });
      } catch (error) {
        console.error("Error en message:unstar:", error.message);
      }
    });

    socket.on("messages:read", async ({ roomId, userId }) => {
      try {
        const conversation = await Conversation.findOne({ roomId });
        if (!conversation) return;

        if (conversation.participantA.toString() === userId) {
          conversation.unreadCountA = 0;
        } else if (conversation.participantB.toString() === userId) {
          conversation.unreadCountB = 0;
        }
        await conversation.save();

        await Message.updateMany(
          { conversation: conversation._id, readBy: { $ne: userId } },
          { $push: { readBy: userId } }
        );

        io.to(roomId).emit("messages:read", { roomId, readerId: userId });
      } catch (error) {
        console.error("Error en messages:read:", error.message);
      }
    });
  });
}
