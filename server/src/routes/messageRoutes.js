import express from "express";
import protegerRuta from "../middleware/authMiddleware.js";

import {
  enviarMensaje,
  obtenerMensajes,
  editarMensaje
} from "../controllers/messageController.js";

const router = express.Router();

// ENVIAR MENSAJE
router.post("/", protegerRuta, enviarMensaje);

// OBTENER MENSAJES DE UNA CONVERSACIÓN
router.get("/conversation/:id", protegerRuta, obtenerMensajes);

// EDITAR MENSAJE
router.put("/:id", protegerRuta, editarMensaje);

export default router;