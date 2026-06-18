import User from "../models/User.js";
import Connection from "../models/Connection.js";
import SavedProfile from "../models/SavedProfile.js";
import cloudinary from "../config/cloudinary.js";
import { INSTITUTIONS } from "../config/institutions.js";

// Si es true, usuarios de campus distinto dentro de la misma institución
// quedan completamente excluidos del feed (compatibilidad = 0).
// Si es false (recomendado), el campus ya no es un filtro duro: solo afecta
// la puntuación de forma indirecta a través de facultad/conexiones mutuas.
const STRICT_CAMPUS_FILTER = false;

// ALGORITMO DE COMPATIBILIDAD CON BREAKDOWN
// Pesos: intereses 35% + objetivos 25% + facultad 15% + semestre 10% + conexiones mutuas 15%
const calcCompatibility = (userA, userB, sharedConnectionsCount = 0, ignoreInstitution = false) => {
  let score = 0;
  const breakdown = {
    interests: 0,
    objectives: 0,
    faculty: 0,
    semester: 0,
    mutualConnections: 0,
    sharedInterests: [],
    sharedObjectives: [],
    sharedConnectionsCount: 0
  };

  if (!ignoreInstitution && userA.institution?.toString() !== userB.institution?.toString()) return { score: 0, breakdown };

  if (STRICT_CAMPUS_FILTER) {
    const campusA = userA.currentCampus || userA.campus;
    const campusB = userB.currentCampus || userB.campus;
    if (campusA !== campusB) return { score: 0, breakdown };
  }

  // Intereses (35%)
  const sharedInterests = userA.interests.filter(i => userB.interests.includes(i));
  const maxInt = Math.max(userA.interests.length, userB.interests.length, 1);
  breakdown.interests = Math.round((sharedInterests.length / maxInt) * 35);
  breakdown.sharedInterests = sharedInterests;
  score += breakdown.interests;

  // Objetivos (25%)
  const sharedObj = userA.objectives.filter(o => userB.objectives.includes(o));
  const maxObj = Math.max(userA.objectives.length, userB.objectives.length, 1);
  breakdown.objectives = Math.round((sharedObj.length / maxObj) * 25);
  breakdown.sharedObjectives = sharedObj;
  score += breakdown.objectives;

  // Facultad (15%)
  if (userA.faculty && userB.faculty && userA.faculty === userB.faculty) {
    breakdown.faculty = 15;
    score += 15;
  }

  // Semestre (10%, gradual según diferencia)
  const semDiff = Math.abs((userA.semester || 1) - (userB.semester || 1));
  if (semDiff === 0) breakdown.semester = 10;
  else if (semDiff === 1) breakdown.semester = 6;
  else if (semDiff <= 2) breakdown.semester = 3;
  score += breakdown.semester;

  // Conexiones mutuas (15%): hasta 5 conexiones compartidas otorgan el máximo
  breakdown.sharedConnectionsCount = sharedConnectionsCount;
  breakdown.mutualConnections = Math.round((Math.min(sharedConnectionsCount, 5) / 5) * 15);
  score += breakdown.mutualConnections;

  return { score: Math.round(score), breakdown };
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

// CAMPUS Y FACULTADES DISPONIBLES PARA FILTRAR EL FEED (misma institución)
export const obtenerFacets = async (req, res) => {
  try {
    const yo = await User.findById(req.usuario._id).select("institution");
    if (!yo) return res.status(404).json({ message: "Usuario no encontrado" });

    const [currentCampuses, legacyCampuses, faculties] = await Promise.all([
      User.distinct("currentCampus", { institution: yo.institution, currentCampus: { $nin: [null, ""] } }),
      User.distinct("campus", { institution: yo.institution, campus: { $nin: [null, ""] } }),
      User.distinct("faculty", { institution: yo.institution, faculty: { $nin: [null, ""] } }),
    ]);

    const campuses = [...new Set([...currentCampuses, ...legacyCampuses])].sort();

    res.status(200).json({ campuses, faculties: faculties.sort() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FEED CONTEXTUAL MEJORADO
export const feedUsuarios = async (req, res) => {
  try {
    const yo = await User.findById(req.usuario._id);
    if (!yo) return res.status(404).json({ message: "Usuario no encontrado" });

    const miCampus = yo.currentCampus || yo.campus;
    const miInstitucion = yo.institution;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(20, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;


    // Obtener conexiones ya existentes (pending o accepted)
    const conexionesExistentes = await Connection.find({
      $or: [
        { from: yo._id },
        { to: yo._id }
      ]
    }).select("from to");

    const usuariosConectados = new Set();
    conexionesExistentes.forEach(conn => {
      usuariosConectados.add(conn.from.toString());
      usuariosConectados.add(conn.to.toString());
    });

    // Obtener perfiles guardados
    const perfilesGuardados = await SavedProfile.find({ user: yo._id }).select("savedUser");
    const perfilesGuardadosSet = new Set(perfilesGuardados.map(p => p.savedUser.toString()));

    // Mis conexiones aceptadas (para calcular conexiones mutuas con cada candidato)
    const misConexionesAceptadas = await Connection.find({
      status: "accepted",
      $or: [{ from: yo._id }, { to: yo._id }]
    }).select("from to");

    const misConectadosSet = new Set();
    misConexionesAceptadas.forEach(conn => {
      misConectadosSet.add(conn.from.toString());
      misConectadosSet.add(conn.to.toString());
    });
    misConectadosSet.delete(yo._id.toString());

    const filterMode = req.query.filter || "myUniversity";

    let candidatos;
    if (filterMode === "all") {
      // Modo "Todos": mostrar usuarios de cualquier institución
      candidatos = await User.find({
        _id: { $ne: yo._id },
        isActive: true
      }).select("-password -__v");
    } else {
      // Modo "Mi Universidad": búsqueda por institución con fallback progresivo
      candidatos = await User.find({
        _id:         { $ne: yo._id },
        institution: miInstitucion,
        $or: [
          { currentCampus: miCampus },
          { campus:        miCampus }
        ],
        isActive: true
      }).select("-password -__v");

      if (candidatos.length === 0) {
        candidatos = await User.find({
          _id:         { $ne: yo._id },
          institution: miInstitucion,
          isActive:    true
        }).select("-password -__v");
      }

      if (candidatos.length === 0 && miCampus) {
        candidatos = await User.find({
          _id: { $ne: yo._id },
          $or: [{ currentCampus: miCampus }, { campus: miCampus }],
          isActive: true
        }).select("-password -__v");
      }

      if (candidatos.length === 0) {
        candidatos = await User.find({
          _id:      { $ne: yo._id },
          isActive: true
        }).select("-password -__v");
      }
    }

    // Conexiones aceptadas de los candidatos, para calcular conexiones mutuas
    const candidatoIds = candidatos.map(c => c._id);
    const candidatosConexiones = await Connection.find({
      status: "accepted",
      $or: [
        { from: { $in: candidatoIds } },
        { to:   { $in: candidatoIds } }
      ]
    }).select("from to");

    const candidatoConectadosMap = new Map();
    const candidatoIdsSet = new Set(candidatoIds.map(id => id.toString()));
    candidatosConexiones.forEach(conn => {
      const fromStr = conn.from.toString();
      const toStr = conn.to.toString();
      if (candidatoIdsSet.has(fromStr)) {
        if (!candidatoConectadosMap.has(fromStr)) candidatoConectadosMap.set(fromStr, new Set());
        candidatoConectadosMap.get(fromStr).add(toStr);
      }
      if (candidatoIdsSet.has(toStr)) {
        if (!candidatoConectadosMap.has(toStr)) candidatoConectadosMap.set(toStr, new Set());
        candidatoConectadosMap.get(toStr).add(fromStr);
      }
    });

    const sharedConnectionsFor = (candidatoId) => {
      const candidatoConectados = candidatoConectadosMap.get(candidatoId.toString());
      if (!candidatoConectados) return 0;
      let count = 0;
      candidatoConectados.forEach(id => { if (misConectadosSet.has(id)) count++; });
      return count;
    };

    const feed = candidatos
      .filter(usuario => !usuariosConectados.has(usuario._id.toString()))
      .map(usuario => {
        const { score, breakdown } = calcCompatibility(yo, usuario, sharedConnectionsFor(usuario._id), filterMode === "all");
        return {
          usuario,
          compatibilidad: score,
          breakdown,
          guardado: perfilesGuardadosSet.has(usuario._id.toString())
        };
      })
      .filter(r => r.compatibilidad > 0)
      .sort((a, b) => b.compatibilidad - a.compatibilidad)
      .slice(skip, skip + limit);

    const totalCompatibles = candidatos
      .filter(usuario => !usuariosConectados.has(usuario._id.toString()))
      .map(usuario => {
        const { score } = calcCompatibility(yo, usuario, sharedConnectionsFor(usuario._id), filterMode === "all");
        return { compatibilidad: score };
      })
      .filter(r => r.compatibilidad > 0).length;

    res.status(200).json({
      data: feed,
      pagination: {
        page,
        limit,
        total: totalCompatibles,
        pages: Math.ceil(totalCompatibles / limit)
      },
    });
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

    // Validar institution
    if (req.body.institution !== undefined && req.body.institution !== "") {
      const instValida = Object.values(INSTITUTIONS).find(i => i.name === req.body.institution);
      if (!instValida) return res.status(400).json({ message: "Institución inválida" });
    }

    // Validar currentCampus contra la institución resultante
    if (req.body.currentCampus !== undefined && req.body.currentCampus !== "") {
      const instName = req.body.institution ?? usuario.institution;
      const instData = Object.values(INSTITUTIONS).find(i => i.name === instName);
      if (instData && !instData.campuses.find(c => c.id === req.body.currentCampus)) {
        return res.status(400).json({ message: "Campus inválido para esa institución" });
      }
    }

    // Validar faculty contra la institución resultante
    if (req.body.faculty !== undefined && req.body.faculty !== "") {
      const instName = req.body.institution ?? usuario.institution;
      const instData = Object.values(INSTITUTIONS).find(i => i.name === instName);
      if (instData?.faculties?.length > 0) {
        const facultyNames = instData.faculties.map(f => f.name);
        if (!facultyNames.includes(req.body.faculty)) {
          return res.status(400).json({ message: "Facultad inválida para esa institución" });
        }
      }
    }

    // Validar career contra la institución resultante
    if (req.body.career !== undefined && req.body.career !== "") {
      const instName = req.body.institution ?? usuario.institution;
      const instData = Object.values(INSTITUTIONS).find(i => i.name === instName);
      if (instData?.faculties?.length > 0) {
        const allCareers = instData.faculties.flatMap(f => f.careers ?? []);
        if (allCareers.length > 0 && !allCareers.includes(req.body.career)) {
          return res.status(400).json({ message: "Carrera inválida para esa institución" });
        }
      }
    }

    const campos = [
      "fullName", "bio", "career", "faculty",
      "semester", "interests", "objectives",
      "isActive", "currentCampus", "city", "institution"
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

// ── BLOQUEO DE USUARIOS ─────────────────────────────────────────────

// Bloquear usuario
export const bloquearUsuario = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (targetId === req.usuario._id.toString()) {
      return res.status(400).json({ message: "No puedes bloquearte a ti mismo" });
    }

    const usuario = await User.findById(req.usuario._id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    if (!usuario.blockedUsers.some((id) => id.toString() === targetId)) {
      usuario.blockedUsers.push(targetId);
      await usuario.save();
    }

    res.status(200).json({ blockedUsers: usuario.blockedUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Desbloquear usuario
export const desbloquearUsuario = async (req, res) => {
  try {
    const targetId = req.params.id;

    const usuario = await User.findById(req.usuario._id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

    usuario.blockedUsers = usuario.blockedUsers.filter((id) => id.toString() !== targetId);
    await usuario.save();

    res.status(200).json({ blockedUsers: usuario.blockedUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── BANNER DE PERFIL ───────────────────────────────────────────────

export const uploadProfileBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No se recibió ninguna imagen" });

    const usuario = await User.findById(req.usuario._id);
    if (!usuario) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    if (usuario.profileBanner) {
      const publicId = usuario.profileBanner.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    usuario.profileBanner = req.file.path;
    await usuario.save();

    res.status(200).json({ success: true, profileBanner: usuario.profileBanner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProfileBanner = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario._id);
    if (!usuario) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    if (usuario.profileBanner) {
      const publicId = usuario.profileBanner.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    usuario.profileBanner = "";
    await usuario.save();

    res.status(200).json({ success: true, message: "Banner eliminado" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ESTADÍSTICAS PÚBLICAS (sin autenticación, para landing page)
export const estadisticasPublicas = async (req, res) => {
  try {
    const [totalUsuarios, instituciones, totalConexiones] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.distinct("institution", { institution: { $nin: [null, ""] } }),
      Connection.countDocuments({ status: "accepted" }),
    ]);
    res.status(200).json({
      usuarios: totalUsuarios,
      instituciones: instituciones.filter(Boolean).length,
      conexiones: totalConexiones,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};