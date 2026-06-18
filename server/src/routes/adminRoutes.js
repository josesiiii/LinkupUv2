import express from "express";
import protegerRuta from "../middleware/authMiddleware.js";
import soloAdmin from "../middleware/soloAdmin.js";
import {
  obtenerTodosUsuarios,
  eliminarUsuario,
  toggleActivarUsuario,
  getEstadisticas,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/stats",              protegerRuta, soloAdmin, getEstadisticas);
router.get("/users",              protegerRuta, soloAdmin, obtenerTodosUsuarios);
router.delete("/users/:id",       protegerRuta, soloAdmin, eliminarUsuario);
router.patch("/users/:id/toggle", protegerRuta, soloAdmin, toggleActivarUsuario);

export default router;