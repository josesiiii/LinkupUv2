import express from "express";

import {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil
} from "../controllers/authController.js";

import protegerRuta from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registrarUsuario);

router.post("/login", iniciarSesion);

router.get("/me", protegerRuta, obtenerPerfil);

export default router;