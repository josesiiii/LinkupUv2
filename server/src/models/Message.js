import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    text: {
      type: String,
      required: true
    },

    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    edited: {
      type: Boolean,
      default: false
    },

    editedAt: {
      type: Date
    },

    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null
    },

    pinned: {
      type: Boolean,
      default: false
    },

    pinnedAt: {
      type: Date
    },

    starredBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    deletedFor: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    deletedForEveryone: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Query principal del chat: mensajes de una conversación en orden
messageSchema.index({ conversation: 1, createdAt: 1 });
// Mensajes fijados dentro de una conversación
messageSchema.index({ conversation: 1, pinned: 1 });

const Message = mongoose.model(
  "Message",
  messageSchema
);

export default Message;