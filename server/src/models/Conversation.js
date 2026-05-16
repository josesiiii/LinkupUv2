import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      unique: true
    },

    participantA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    participantB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    lastMessage: {
      type: String,
      default: ""
    },

    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    lastMessageAt: {
      type: Date
    },

    unreadCountA: {
      type: Number,
      default: 0
    },

    unreadCountB: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);

export default Conversation;