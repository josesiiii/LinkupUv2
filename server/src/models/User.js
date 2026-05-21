import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(

  {

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



    // ── Perfil ─────────────────────────────

    bio: {
      type: String,
      maxlength: 300,
      default: ""
    },

    profilePicture: {
      type: String,
      default: ""
    },



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
    }

  },

  {
    timestamps: true
  }

);



// ── Índices ───────────────────────────────

// Búsqueda rápida por institución y campus
usuarioSchema.index({
  institution: 1,
  currentCampus: 1
});

// Búsqueda rápida por intereses
usuarioSchema.index({
  interests: 1
});




const User = mongoose.model(
  "User",
  usuarioSchema
);

export default User;