import mongoose from "mongoose";

const savedProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    savedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Lookup por usuario + evitar duplicados a nivel de DB
savedProfileSchema.index({ user: 1, savedUser: 1 }, { unique: true });
// Listado de guardados de un usuario
savedProfileSchema.index({ user: 1 });

const SavedProfile = mongoose.model(
  "SavedProfile",
  savedProfileSchema
);

export default SavedProfile;