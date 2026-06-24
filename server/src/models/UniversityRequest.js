import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    universityName: { type: String, required: true, trim: true },
    city:           { type: String, required: true, trim: true },
    contactName:    { type: String, required: true, trim: true },
    contactEmail:   { type: String, required: true, trim: true, lowercase: true },
    message:        { type: String, trim: true, default: "" },
    status:         { type: String, enum: ["pending", "reviewed"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model("UniversityRequest", schema);
