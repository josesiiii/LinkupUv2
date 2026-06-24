import express from "express";

import protegerRuta from "../middleware/authMiddleware.js";

import {
  crearCampus,
  obtenerCampus,
  cambiarCampusActual,
  feedCampus,
  solicitarUniversidad,
} from "../controllers/campusController.js";

const router = express.Router();



// CREAR CAMPUS
router.post(
  "/",
  protegerRuta,
  crearCampus
);



// OBTENER CAMPUS
router.get(
  "/",
  protegerRuta,
  obtenerCampus
);



// CAMBIAR CAMPUS ACTUAL
router.put(
  "/current",
  protegerRuta,
  cambiarCampusActual
);



// FEED CAMPUS
router.get(
  "/feed",
  protegerRuta,
  feedCampus
);

// SOLICITAR REGISTRO DE UNIVERSIDAD (pública — sin auth)
router.post("/solicitar", solicitarUniversidad);

export default router;