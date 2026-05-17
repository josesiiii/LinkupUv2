import express from "express";
import { INSTITUTIONS } from "../config/institutions.js";

const router = express.Router();

router.get("/campuses", (req, res) => {
  try {
    const { email, city } = req.query;

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        message: "Email inválido"
      });
    }

    // FIX IMPORTANTE: normalización
    const domain = email
      .split("@")[1]
      ?.trim()
      .toLowerCase();

    const institution = INSTITUTIONS[domain];

    if (!institution) {
      return res.status(404).json({
        message: "Institución no registrada"
      });
    }

    let campuses = institution.campuses;

    if (city) {
      campuses = campuses.filter(
        c => c.city.toLowerCase() === city.toLowerCase()
      );
    }

    res.json({
      institution: institution.name,
      domain,
      campuses
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

export default router;