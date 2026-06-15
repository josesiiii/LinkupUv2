import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

const MAX_PINNED = 3;

// OBTENER CONVERSACIONES DEL USUARIO
export const obtenerConversaciones = async (req, res) => {
  try {
    const conversaciones = await Conversation.find({
      $or: [
        { participantA: req.usuario._id },
        { participantB: req.usuario._id }
      ]
    })
      .select(
        "participantA participantB lastMessage lastMessageAt unreadCountA unreadCountB archivedBy pinnedBy mutedBy"
      )
      .populate("participantA", "fullName email")
      .populate("participantB", "fullName email")
      .sort({ lastMessageAt: -1 })
      .lean();

    res.status(200).json(conversaciones);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ACTUALIZAR ESTADO DE LA CONVERSACIÓN PARA EL USUARIO ACTUAL
export const actualizarConversacion = async (req, res) => {
  try {
    const { action } = req.body;
    const userId = req.usuario._id;

    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversación no encontrada" });
    }

    const isParticipant =
      conversation.participantA.toString() === userId.toString() ||
      conversation.participantB.toString() === userId.toString();
    if (!isParticipant) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const removeFrom = (arr) => arr.filter((id) => id.toString() !== userId.toString());
    const addTo = (arr) => (arr.some((id) => id.toString() === userId.toString()) ? arr : [...arr, userId]);

    switch (action) {
      case "archive":
        conversation.archivedBy = addTo(conversation.archivedBy);
        break;
      case "unarchive":
        conversation.archivedBy = removeFrom(conversation.archivedBy);
        break;
      case "pin": {
        const alreadyPinned = conversation.pinnedBy.some((id) => id.toString() === userId.toString());
        if (!alreadyPinned) {
          const pinnedCount = await Conversation.countDocuments({ pinnedBy: userId });
          if (pinnedCount >= MAX_PINNED) {
            return res.status(400).json({ message: `Solo puedes fijar hasta ${MAX_PINNED} chats` });
          }
        }
        conversation.pinnedBy = addTo(conversation.pinnedBy);
        break;
      }
      case "unpin":
        conversation.pinnedBy = removeFrom(conversation.pinnedBy);
        break;
      case "mute":
        conversation.mutedBy = addTo(conversation.mutedBy);
        break;
      case "unmute":
        conversation.mutedBy = removeFrom(conversation.mutedBy);
        break;
      case "markRead":
        if (conversation.participantA.toString() === userId.toString()) {
          conversation.unreadCountA = 0;
        } else {
          conversation.unreadCountB = 0;
        }
        await Message.updateMany(
          { conversation: conversation._id, readBy: { $ne: userId } },
          { $push: { readBy: userId } }
        );
        break;
      default:
        return res.status(400).json({ message: "Acción no válida" });
    }

    await conversation.save();
    res.status(200).json(conversation);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ELIMINAR CONVERSACIÓN (y sus mensajes)
export const eliminarConversacion = async (req, res) => {
  try {
    const userId = req.usuario._id;
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversación no encontrada" });
    }

    const isParticipant =
      conversation.participantA.toString() === userId.toString() ||
      conversation.participantB.toString() === userId.toString();
    if (!isParticipant) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await Message.deleteMany({ conversation: conversation._id });
    await conversation.deleteOne();

    res.status(200).json({ message: "Conversación eliminada" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
