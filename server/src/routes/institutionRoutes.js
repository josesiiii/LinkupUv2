import express from "express";
import { INSTITUTIONS } from "../config/institutions.js";

const router = express.Router();

// GET /api/institutions/campuses?email=juan@itm.edu.co
router.get("/campuses", (req, res) => {
  const { email, city } = req.query;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Email inválido" });
  }

  const domain = email.split("@")[1];
  const institution = INSTITUTIONS[domain];

  if (!institution) {
    return res.status(404).json({
      message: "Institución no registrada"
    });
  }

  const campuses = city
    ? institution.campuses.filter(c => c.city === city)
    : institution.campuses;

  // Respuesta explícita con id y label diferenciados
  res.json({
    institution: institution.name,
    domain,
    campuses: campuses.map(c => ({
      id:    c.id,      // ← este es el valor que debe enviar el frontend
      label: c.label,   // ← este es el texto visible en el select
      city:  c.city,
      department: c.department
    }))
  });
});

export default router;