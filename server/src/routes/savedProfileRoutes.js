import express from "express";

import protegerRuta from "../middleware/authMiddleware.js";

import {
  guardarPerfil,
  obtenerGuardados,
  eliminarGuardado
} from "../controllers/savedProfileController.js";

const router = express.Router();



// Guardar perfil
router.post(
  "/",
  protegerRuta,
  guardarPerfil
);



// Ver guardados
router.get(
  "/",
  protegerRuta,
  obtenerGuardados
);



// Eliminar guardado
router.delete(
  "/:id",
  protegerRuta,
  eliminarGuardado
);

export default router;