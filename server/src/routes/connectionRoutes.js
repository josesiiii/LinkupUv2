import express from "express";

import {
  enviarConexion,
  aceptarConexion,
  obtenerPendientes,
  obtenerAceptadas,
  rechazarConexion,
  misContactos,
  obtenerArchivadas,
  archivarConexion,
  restaurarConexion,
  eliminarConexion,
  socialInfo,
} from "../controllers/connectionController.js";
import protegerRuta from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protegerRuta, enviarConexion);

router.get("/pending", protegerRuta, obtenerPendientes);
router.get("/accepted", protegerRuta, obtenerAceptadas);
router.get("/archived", protegerRuta, obtenerArchivadas);
router.get("/contacts", protegerRuta, misContactos);
router.get("/social-info/:userId", protegerRuta, socialInfo);

router.put("/:id/accept", protegerRuta, aceptarConexion);
router.put("/:id/reject", protegerRuta, rechazarConexion);
router.put("/:id/archive", protegerRuta, archivarConexion);
router.put("/:id/restore", protegerRuta, restaurarConexion);
router.delete("/:id", protegerRuta, eliminarConexion);

export default router;