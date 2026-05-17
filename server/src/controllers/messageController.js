import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// ENVIAR MENSAJE
export const enviarMensaje = async (req, res) => {
  try {
    const { to, text } = req.body;

    let conversation = await Conversation.findOne({
      $or: [
        {
          participantA: req.usuario._id,
          participantB: to
        },
        {
          participantA: to,
          participantB: req.usuario._id
        }
      ]
    });

    if (!conversation) {
      conversation = await Conversation.create({
        roomId: [req.usuario._id.toString(), to.toString()]
          .sort()
          .join("_"),

        participantA: req.usuario._id,
        participantB: to,

        lastMessage: text,
        lastMessageSender: req.usuario._id,
        lastMessageAt: new Date(),

        unreadCountA: 0,
        unreadCountB: 1
      });

    } else {
      conversation.lastMessage = text;
      conversation.lastMessageSender = req.usuario._id;
      conversation.lastMessageAt = new Date();

      if (
        conversation.participantA.toString() ===
        req.usuario._id.toString()
      ) {
        conversation.unreadCountB += 1;
      } else {
        conversation.unreadCountA += 1;
      }

      await conversation.save();
    }

    const mensaje = await Message.create({
      conversation: conversation._id,
      sender: req.usuario._id,
      text,
      readBy: [req.usuario._id]
    });

    res.status(201).json({
      conversation,
      mensaje
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// OBTENER MENSAJES
export const obtenerMensajes = async (req, res) => {
  try {
    const mensajes = await Message.find({
      conversation: req.params.id
    })
      .populate("sender", "fullName email")
      .sort({ createdAt: 1 })
      .limit(100);

    res.status(200).json(mensajes);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// EDITAR MENSAJE
export const editarMensaje = async (req, res) => {
  try {
    const { text } = req.body;

    const mensaje = await Message.findById(req.params.id);

    if (!mensaje) {
      return res.status(404).json({
        message: "Mensaje no encontrado"
      });
    }

    if (
      mensaje.sender.toString() !== req.usuario._id.toString()
    ) {
      return res.status(403).json({
        message: "No autorizado"
      });
    }

    mensaje.text = text;
    mensaje.edited = true;
    mensaje.editedAt = new Date();

    await mensaje.save();

    res.status(200).json(mensaje);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};