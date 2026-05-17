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

  // ── Campos académicos ──────────────────
  career: {
    type: String,
    trim: true,
    default: ""
  },

  faculty: {
    type: String,
    trim: true,
    default: ""
  },

  semester: {
    type: Number,
    min: 1,
    max: 12,
    default: 1
  },

  bio: {
    type: String,
    maxlength: 300,
    default: ""
  },

  profilePicture: {
    type: String,
    default: ""
  },

  // ── Campus e institución ───────────────
  institution: {
    type: String,
    trim: true,
    default: ""
  },

  campus: {
    type: String,
    trim: true,
    default: ""
  },

  city: {
    type: String,
    trim: true,
    default: ""
  },

  department: {
    type: String,
    trim: true,
    default: ""
  },

  // ── Intereses y objetivos ──────────────
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
  }

}, { timestamps: true }); // reemplaza createdAt manual

// Índices para búsquedas rápidas
usuarioSchema.index({ campus: 1 });
usuarioSchema.index({ institution: 1, campus: 1 });
usuarioSchema.index({ interests: 1 });

const User = mongoose.model("User", usuarioSchema);

export default User;