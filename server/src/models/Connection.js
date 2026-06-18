import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({

  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "archived"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

// Índices para las queries más frecuentes del feed y conexiones
connectionSchema.index({ from: 1, status: 1 });
connectionSchema.index({ to: 1, status: 1 });
connectionSchema.index({ from: 1, to: 1 });
connectionSchema.index({ status: 1 });

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;