import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// ALGORITMO DE COMPATIBILIDAD
const calcCompatibility = (userA, userB) => {
  let score = 0;

  if (userA.institution?.toString() !== userB.institution?.toString()) return 0;

  const campusA = userA.currentCampus || userA.campus;
  const campusB = userB.currentCampus || userB.campus;
  if (campusA !== campusB) return 0;

  const sharedInterests = userA.interests.filter(i => userB.interests.includes(i));
  const maxInt = Math.max(userA.interests.length, userB.interests.length, 1);
  score += (sharedInterests.length / maxInt) * 40;

  const sharedObj = userA.objectives.filter(o => userB.objectives.includes(o));
  const maxObj = Math.max(userA.objectives.length, userB.objectives.length, 1);
  score += (sharedObj.length / maxObj) * 30;

  if (userA.faculty && userB.faculty && userA.faculty === userB.faculty) score += 20;
  if (Math.abs((userA.semester || 1) - (userB.semester || 1)) <= 2) score += 10;

  return Math.round(score);
};

// OBTENER TODOS LOS USUARIOS
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select("-password -__v");
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// BUSCAR USUARIOS
export const buscarUsuarios = async (req, res) => {
  try {
    const { q } = req.query;
    const usuarioId = req.usuario._id;

    if (!q) {
      return res.status(400).json({ message: "Debes enviar un término de búsqueda" });
    }

    const usuarios = await User.find({
      _id:      { $ne: usuarioId },
      fullName: { $regex: "^" + q, $options: "i" }
    }).select("fullName email interests currentCampus campus institution");

    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FEED CONTEXTUAL
export const feedUsuarios = async (req, res) => {
  try {
    const yo = await User.findById(req.usuario._id);
    if (!yo) return res.status(404).json({ message: "Usuario no encontrado" });

    const miCampus = yo.currentCampus || yo.campus;
    const miInstitucion = yo.institution;

    const candidatos = await User.find({
      _id:         { $ne: yo._id },
      institution: miInstitucion,
      $or: [
        { currentCampus: miCampus },
        { campus:        miCampus }
      ],
      isActive:  true,
      interests: { $exists: true, $not: { $size: 0 } }
    }).select("-password -__v");

    const feed = candidatos
      .map(usuario => ({
        usuario,
        compatibilidad: calcCompatibility(yo, usuario)
      }))
      .filter(r => r.compatibilidad > 0)
      .sort((a, b) => b.compatibilidad - a.compatibilidad);

    res.status(200).json(feed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// OBTENER USUARIO POR ID
export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id).select("-password -__v");
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ACTUALIZAR PERFIL
export const actualizarPerfil = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario._id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    const campos = [
      "fullName", "bio", "career", "faculty",
      "semester", "interests", "objectives",
      "isActive", "currentCampus", "campus"
    ];

    campos.forEach(campo => {
      if (req.body[campo] !== undefined) usuario[campo] = req.body[campo];
    });

    const usuarioActualizado = await usuario.save();
    const { password, __v, ...safeUser } = usuarioActualizado.toObject();
    res.status(200).json({ message: "Perfil actualizado", usuario: safeUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── FOTO DE PERFIL ─────────────────────────────────────────────────

// Subir o reemplazar foto de perfil
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se recibió ninguna imagen"
      });
    }

    const usuario = await User.findById(req.usuario._id);
    if (!usuario) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    // Si ya tenía foto de perfil, eliminarla de Cloudinary
    if (usuario.profilePicture) {
      const publicId = usuario.profilePicture
        .split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    usuario.profilePicture = req.file.path;
    await usuario.save();

    res.status(200).json({
      success: true,
      profilePicture: usuario.profilePicture
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar foto de perfil
export const deleteProfilePicture = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario._id);
    if (!usuario) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    if (!usuario.profilePicture) {
      return res.status(400).json({ success: false, message: "No tienes foto de perfil" });
    }

    // Eliminar de Cloudinary
    const publicId = usuario.profilePicture
      .split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId).catch(() => {});

    usuario.profilePicture = "";
    await usuario.save();

    res.status(200).json({ success: true, message: "Foto de perfil eliminada" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── GALERÍA PERSONAL ───────────────────────────────────────────────

// Subir foto a la galería
export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No se recibió ninguna imagen"
      });
    }

    const usuario = await User.findById(req.usuario._id);
    if (!usuario) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    if (usuario.photos.length >= 6) {
      return res.status(400).json({
        success: false,
        message: "Límite de 6 fotos alcanzado. Elimina una antes de subir otra."
      });
    }

    usuario.photos.push({
      url:   req.file.path,
      order: usuario.photos.length
    });

    await usuario.save();

    res.status(200).json({
      success: true,
      photos:  usuario.photos,
      total:   usuario.photos.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Ver mis fotos de galería
export const obtenerMisPhotos = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario._id)
      .select("photos profilePicture");

    res.status(200).json({
      profilePicture: usuario.profilePicture,
      photos:         usuario.photos.sort((a, b) => a.order - b.order),
      total:          usuario.photos.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar foto de la galería
export const deletePhoto = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario._id);
    if (!usuario) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    const foto = usuario.photos.id(req.params.photoId);
    if (!foto) return res.status(404).json({ success: false, message: "Foto no encontrada" });

    // Eliminar de Cloudinary
    const publicId = foto.url
      .split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId).catch(() => {});

    // Eliminar del array
    usuario.photos.pull({ _id: req.params.photoId });

    // Recalcular orden
    usuario.photos.forEach((p, i) => { p.order = i; });

    await usuario.save();

    res.status(200).json({
      success: true,
      photos:  usuario.photos,
      total:   usuario.photos.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reordenar fotos de la galería
export const reorderPhotos = async (req, res) => {
  try {
    // orderedIds = ["id1", "id2", "id3"] en el nuevo orden deseado
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debes enviar orderedIds como array de IDs"
      });
    }

    const usuario = await User.findById(req.usuario._id);
    if (!usuario) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    // Asignar el nuevo order según la posición en el array
    orderedIds.forEach((id, index) => {
      const foto = usuario.photos.id(id);
      if (foto) foto.order = index;
    });

    await usuario.save();

    res.status(200).json({
      success: true,
      photos:  usuario.photos.sort((a, b) => a.order - b.order)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};