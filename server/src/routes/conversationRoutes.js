import express from "express";
import protegerRuta from "../middleware/authMiddleware.js";
import { obtenerConversaciones } from "../controllers/conversationController.js";

const router = express.Router();

// GET conversaciones del usuario
router.get("/", protegerRuta, obtenerConversaciones);

export default router;