import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },

  password: {
    type: String,
    required: true
  },

  interests: {
    type: [String],
    default: []
  },

  objectives: {
    type: [String],
    default: []
  },

  isActive: {
    type: Boolean,
    default: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

const User = mongoose.model("User", usuarioSchema);

export default User;