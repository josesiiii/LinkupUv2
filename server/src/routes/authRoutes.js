import express from "express";

import {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
  cambiarPassword        // ← nuevo
} from "../controllers/authController.js";

import protegerRuta from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register",         registrarUsuario);
router.post("/login",            iniciarSesion);
router.get("/me",                protegerRuta, obtenerPerfil);
router.put("/change-password",   protegerRuta, cambiarPassword);  // ← nuevo

export default router;