import Conversation from "../models/Conversation.js";

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
        "participantA participantB lastMessage lastMessageAt unreadCountA unreadCountB"
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