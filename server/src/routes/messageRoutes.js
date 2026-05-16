import express from "express";

import protegerRuta from "../middleware/authMiddleware.js";

import {
  enviarMensaje,
  obtenerMensajes,
  obtenerConversaciones,
  editarMensaje
} from "../controllers/messageController.js";

const router = express.Router();



// ENVIAR MENSAJE
router.post(
  "/",
  protegerRuta,
  enviarMensaje
);



// OBTENER MENSAJES
router.get(
  "/conversation/:id",
  protegerRuta,
  obtenerMensajes
);



// OBTENER CONVERSACIONES
router.get(
  "/conversations",
  protegerRuta,
  obtenerConversaciones
);



// EDITAR MENSAJE
router.put(
  "/:id",
  protegerRuta,
  editarMensaje
);

export default router;