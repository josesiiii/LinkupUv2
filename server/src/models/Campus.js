import mongoose from "mongoose";

const campusSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    shortName: {
      type: String
    },

    city: {
      type: String
    },

    institution: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Institution",
  required: true
},

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Campus = mongoose.model(
  "Campus",
  campusSchema
);

export default Campus;