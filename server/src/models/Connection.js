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

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;