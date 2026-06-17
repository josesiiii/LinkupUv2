import express from "express";
import {
  actualizarPerfil,
  obtenerUsuarios,
  buscarUsuarios,
  feedUsuarios,
  obtenerFacets,
  obtenerUsuarioPorId,
  uploadPhoto,
  obtenerMisPhotos,
  deletePhoto,
  reorderPhotos,
  uploadProfilePicture,
  deleteProfilePicture,
  uploadProfileBanner,
  deleteProfileBanner,
  bloquearUsuario,
  desbloquearUsuario,
  estadisticasPublicas,
} from "../controllers/userController.js";
import protegerRuta from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// ── Público (sin auth) ─────────────────────
router.get("/stats", estadisticasPublicas);

// ── Usuarios ───────────────────────────────
router.get("/feed",    protegerRuta, feedUsuarios);
router.get("/facets",  protegerRuta, obtenerFacets);
router.get("/search",  protegerRuta, buscarUsuarios);
router.get("/",        protegerRuta, obtenerUsuarios);
router.put("/profile", protegerRuta, actualizarPerfil);

// ── Foto de perfil ─────────────────────────
router.post(
  "/profile-picture",
  protegerRuta,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      next();
    });
  },
  uploadProfilePicture
);

router.delete("/profile-picture", protegerRuta, deleteProfilePicture);

// ── Banner de perfil ───────────────────────
router.post(
  "/profile-banner",
  protegerRuta,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      next();
    });
  },
  uploadProfileBanner
);

router.delete("/profile-banner", protegerRuta, deleteProfileBanner);

// ── Galería personal ───────────────────────
router.post(
  "/photos",
  protegerRuta,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      next();
    });
  },
  uploadPhoto
);

router.get("/my-photos",           protegerRuta, obtenerMisPhotos);
router.patch("/photos/reorder",    protegerRuta, reorderPhotos);
router.delete("/photos/:photoId",  protegerRuta, deletePhoto);

// ── Bloqueo de usuarios ─────────────────────
router.post("/:id/block",   protegerRuta, bloquearUsuario);
router.delete("/:id/block", protegerRuta, desbloquearUsuario);

// ── /:id siempre al final ──────────────────
router.get("/:id", protegerRuta, obtenerUsuarioPorId);

export default router;