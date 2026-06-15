import express from "express";
import protegerRuta from "../middleware/authMiddleware.js";
import {
  obtenerConversaciones,
  actualizarConversacion,
  eliminarConversacion
} from "../controllers/conversationController.js";

const router = express.Router();

// GET conversaciones del usuario
router.get("/", protegerRuta, obtenerConversaciones);

// PATCH estado de la conversación (archivar, fijar, silenciar, marcar leído)
router.patch("/:id", protegerRuta, actualizarConversacion);

// DELETE eliminar conversación y sus mensajes
router.delete("/:id", protegerRuta, eliminarConversacion);

export default router;
