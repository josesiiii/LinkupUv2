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

const SavedProfile = mongoose.model(
  "SavedProfile",
  savedProfileSchema
);

export default SavedProfile;