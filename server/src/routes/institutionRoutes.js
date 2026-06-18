import express from "express";
import { INSTITUTIONS, INSTITUTION_LIST } from "../config/institutions.js";

const router = express.Router();

// GET /api/institutions — lista completa para selects en edición de perfil
router.get("/", (req, res) => {
  res.json({ institutions: INSTITUTION_LIST });
});

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

  res.json({
    institution: institution.name,
    domain,
    campuses: campuses.map(c => ({
      id:         c.id,
      label:      c.label,
      city:       c.city,
      department: c.department
    })),
    faculties: institution.faculties ?? []
  });
});

export default router;