import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Forzar la ruta absoluta al .env desde la raíz del proyecto
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// DEBUG — confirmar que las variables llegan
console.log("CLOUD NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API KEY:",    process.env.CLOUDINARY_API_KEY ? "OK" : "undefined");
console.log("API SECRET:", process.env.CLOUDINARY_API_SECRET ? "OK" : "undefined");

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;