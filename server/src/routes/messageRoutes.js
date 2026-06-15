import express from "express";
import protegerRuta from "../middleware/authMiddleware.js";
import {
  enviarMensaje,
  obtenerMensajes,
  editarMensaje,
  obtenerConversaciones,
  reenviarMensaje
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/",                    protegerRuta, enviarMensaje);
router.post("/forward",             protegerRuta, reenviarMensaje);
router.get("/conversations",        protegerRuta, obtenerConversaciones);
router.get("/conversation/:id",     protegerRuta, obtenerMensajes);
router.put("/:id",                  protegerRuta, editarMensaje);

export default router;