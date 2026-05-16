import express from "express";
    

import {
  enviarConexion,
  aceptarConexion,
  obtenerPendientes,
  obtenerAceptadas,
  rechazarConexion,
  misContactos
} from "../controllers/connectionController.js";
import protegerRuta from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protegerRuta, enviarConexion);

router.put("/:id/accept", protegerRuta, aceptarConexion);

router.get("/pending", protegerRuta, obtenerPendientes);

router.get("/accepted", protegerRuta, obtenerAceptadas);

router.put("/:id/reject", protegerRuta, rechazarConexion);

router.get("/contacts", protegerRuta, misContactos);

export default router;