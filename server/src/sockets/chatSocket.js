import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

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

    socket.on("join:room", ({ roomId }) => {
      socket.join(roomId);
    });

    socket.on("leave:room", ({ roomId }) => {
      socket.leave(roomId);
    });

    socket.on("message:send", async ({ roomId, text }) => {
      try {
        if (!text?.trim()) return;

        let conversation = await Conversation.findOne({ roomId });

        if (!conversation) {
          const [idA, idB] = roomId.split("_");
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

        const mensaje = await Message.create({
          conversation: conversation._id,
          sender: socket.userId,
          text: text.trim(),
          readBy: [socket.userId],
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
        await mensaje.save();

        io.to(roomId).emit("message:deleted", { messageId: mensaje._id });
      } catch (error) {
        console.error("Error en message:delete:", error.message);
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
