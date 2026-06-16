import express from "express";

import {
  registrarUsuario,
  iniciarSesion,
  obtenerPerfil,
  cambiarPassword,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

import protegerRuta from "../middleware/authMiddleware.js";
import { checkRecaptcha } from "../middleware/recaptcha.middleware.js";

const router = express.Router();

router.post("/register",          checkRecaptcha, registrarUsuario);
router.post("/login",             checkRecaptcha, iniciarSesion);
router.get("/me",                 protegerRuta, obtenerPerfil);
router.put("/change-password",    protegerRuta, cambiarPassword);
router.post("/forgot-password",   checkRecaptcha, forgotPassword);
router.post("/reset-password",    resetPassword);

export default router;
