import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// ENVIAR MENSAJE
export const enviarMensaje = async (req, res) => {
  try {
    const { to, text } = req.body;

    let conversation = await Conversation.findOne({
      $or: [
        { participantA: req.usuario._id, participantB: to },
        { participantA: to, participantB: req.usuario._id }
      ]
    });

    if (!conversation) {
      conversation = await Conversation.create({
        roomId: [req.usuario._id.toString(), to.toString()]
          .sort()
          .join("_"),
        participantA:      req.usuario._id,
        participantB:      to,
        lastMessage:       text,
        lastMessageSender: req.usuario._id,
        lastMessageAt:     new Date(),
        unreadCountA:      0,
        unreadCountB:      1
      });
    } else {
      conversation.lastMessage       = text;
      conversation.lastMessageSender = req.usuario._id;
      conversation.lastMessageAt     = new Date();

      if (conversation.participantA.toString() === req.usuario._id.toString()) {
        conversation.unreadCountB += 1;
      } else {
        conversation.unreadCountA += 1;
      }

      await conversation.save();
    }

    const mensaje = await Message.create({
      conversation: conversation._id,
      sender:       req.usuario._id,
      text,
      readBy:       [req.usuario._id]
    });

    res.status(201).json({ conversation, mensaje });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// OBTENER MENSAJES DE UNA CONVERSACIÓN
export const obtenerMensajes = async (req, res) => {
  try {
    const mensajes = await Message.find({
      conversation: req.params.id,
      deletedFor: { $ne: req.usuario._id }
    })
      .populate("sender", "fullName email")
      .populate({
        path: "replyTo",
        select: "text sender",
        populate: { path: "sender", select: "fullName" }
      })
      .sort({ createdAt: 1 })
      .limit(100);

    res.status(200).json(mensajes);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REENVIAR MENSAJE A OTRO(S) USUARIO(S)
export const reenviarMensaje = async (req, res) => {
  try {
    const { messageId, toUserIds } = req.body;

    const original = await Message.findById(messageId);
    if (!original) {
      return res.status(404).json({ message: "Mensaje no encontrado" });
    }

    const results = [];

    for (const to of toUserIds) {
      let conversation = await Conversation.findOne({
        $or: [
          { participantA: req.usuario._id, participantB: to },
          { participantA: to, participantB: req.usuario._id }
        ]
      });

      if (!conversation) {
        conversation = await Conversation.create({
          roomId: [req.usuario._id.toString(), to.toString()].sort().join("_"),
          participantA:      req.usuario._id,
          participantB:      to,
          lastMessage:       original.text,
          lastMessageSender: req.usuario._id,
          lastMessageAt:     new Date(),
          unreadCountA:      0,
          unreadCountB:      1
        });
      } else {
        conversation.lastMessage       = original.text;
        conversation.lastMessageSender = req.usuario._id;
        conversation.lastMessageAt     = new Date();

        if (conversation.participantA.toString() === req.usuario._id.toString()) {
          conversation.unreadCountB += 1;
        } else {
          conversation.unreadCountA += 1;
        }

        await conversation.save();
      }

      const mensaje = await Message.create({
        conversation: conversation._id,
        sender:       req.usuario._id,
        text:         original.text,
        readBy:       [req.usuario._id]
      });

      results.push({ conversation, mensaje });
    }

    res.status(201).json({ results });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// EDITAR MENSAJE
export const editarMensaje = async (req, res) => {
  try {
    const { text } = req.body;
    const mensaje  = await Message.findById(req.params.id);

    if (!mensaje) {
      return res.status(404).json({ message: "Mensaje no encontrado" });
    }

    if (mensaje.sender.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ message: "No autorizado" });
    }

    mensaje.text     = text;
    mensaje.edited   = true;
    mensaje.editedAt = new Date();

    await mensaje.save();
    res.status(200).json(mensaje);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Escapa caracteres especiales de regex para que el término de búsqueda
// se trate como texto literal, no como patrón.
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// BUSCADOR GLOBAL: usuarios/conversaciones por nombre + mensajes por texto
export const buscarChat = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.status(200).json({ conversations: [], messages: [] });

    const regex = new RegExp(escapeRegex(q), "i");

    const conversaciones = await Conversation.find({
      $or: [{ participantA: req.usuario._id }, { participantB: req.usuario._id }]
    })
      .populate("participantA", "fullName profilePicture")
      .populate("participantB", "fullName profilePicture");

    const conversacionesCoincidentes = conversaciones.filter((c) => {
      const otro = c.participantA._id.toString() === req.usuario._id.toString() ? c.participantB : c.participantA;
      return regex.test(otro?.fullName || "");
    });

    const conversationIds = conversaciones.map((c) => c._id);
    const mensajes = await Message.find({
      conversation: { $in: conversationIds },
      text: regex,
      deletedForEveryone: { $ne: true },
      deletedFor: { $ne: req.usuario._id }
    })
      .populate("sender", "fullName")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      conversations: conversacionesCoincidentes,
      messages: mensajes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// OBTENER CONVERSACIONES DEL USUARIO
export const obtenerConversaciones = async (req, res) => {
  try {
    const conversaciones = await Conversation.find({
      $or: [
        { participantA: req.usuario._id },
        { participantB: req.usuario._id }
      ]
    })
      .populate("participantA", "fullName profilePicture campus")
      .populate("participantB", "fullName profilePicture campus")
      .populate("lastMessageSender", "fullName")
      .sort({ lastMessageAt: -1 });

    res.status(200).json(conversaciones);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};