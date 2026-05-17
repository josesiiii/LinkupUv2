// src/routes/userRoutes.js
import express from "express";
import {
  actualizarPerfil,
  obtenerUsuarios,
  buscarUsuarios,
  feedUsuarios,
  obtenerUsuarioPorId
} from "../controllers/userController.js";
import protegerRuta from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/feed",    protegerRuta, feedUsuarios);       // ← primero las rutas específicas
router.get("/search",  protegerRuta, buscarUsuarios);
router.get("/",        protegerRuta, obtenerUsuarios);
router.put("/profile", protegerRuta, actualizarPerfil);
router.get("/:id",     protegerRuta, obtenerUsuarioPorId); // ← /:id siempre al final

export default router;