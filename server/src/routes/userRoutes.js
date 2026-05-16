import express from "express";

import {
  actualizarPerfil,
  obtenerUsuarios,
  buscarUsuarios,
  feedUsuarios
} from "../controllers/userController.js";

import protegerRuta from "../middleware/authMiddleware.js";

const router = express.Router();

// Obtener usuarios
router.get("/", protegerRuta, obtenerUsuarios);

// Actualizar perfil
router.put("/profile", protegerRuta, actualizarPerfil);

// Buscar usuarios
router.get("/search", protegerRuta, buscarUsuarios);

//Feed
router.get("/feed", protegerRuta, feedUsuarios);

export default router;