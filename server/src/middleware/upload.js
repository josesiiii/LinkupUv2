import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "linkup-users",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes JPG, PNG y WEBP"), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});