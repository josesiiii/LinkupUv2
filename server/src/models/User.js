import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
   
    role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    googleId: {
      type: String,
      sparse: true,
      unique: true,
      default: null
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },

    password: {
      type: String,
      required: function () {
        return this.authProvider === "local"
      }
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

    // ── Perfil ─────────────────────────────
    bio: {
      type: String,
      maxlength: 300,
      default: ""
    },

    // Foto de perfil — avatar independiente
    profilePicture: {
      type: String,
      default: ""
    },

    // Galería personal — carrusel del perfil público (máx 4)
    photos: [
      {
        url:   { type: String, required: true },
        order: { type: Number, default: 0 }
      }
    ],

    // ── Institución y contexto ─────────────
    institution: {
      type: String,
      trim: true,
      default: ""
    },

    currentCampus: {
      type: String,
      trim: true,
      default: null
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

    // ── Estado ─────────────────────────────
    isActive: {
      type: Boolean,
      default: true
    },

    // ── Presencia / actividad ───────────────
    lastSeen: {
      type: Date,
      default: Date.now
    },

    doNotDisturb: {
      type: Boolean,
      default: false
    },

    blockedUsers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: []
    }
  },
  {
    timestamps: true
  }
);

// ── Índices ───────────────────────────────
usuarioSchema.index({ institution: 1, currentCampus: 1 });
usuarioSchema.index({ interests: 1 });

const User = mongoose.model("User", usuarioSchema);
export default User;