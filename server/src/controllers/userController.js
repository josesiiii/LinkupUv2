import User from "../models/User.js";

// ALGORITMO DE COMPATIBILIDAD
const calcCompatibility = (userA, userB) => {

  let score = 0;

  // MISMA INSTITUCIÓN
  if (userA.institution?.toString() !== userB.institution?.toString()) {
    return 0;
  }

  // MISMO CAMPUS ACTUAL — compara los dos campos posibles
  const campusA = userA.currentCampus || userA.campus;
  const campusB = userB.currentCampus || userB.campus;

  if (campusA !== campusB) {
    return 0;
  }

  // INTERESES COMPARTIDOS (40%)
  const sharedInterests = userA.interests.filter(i =>
    userB.interests.includes(i)
  );
  const maxInt = Math.max(userA.interests.length, userB.interests.length, 1);
  score += (sharedInterests.length / maxInt) * 40;

  // OBJETIVOS COMPARTIDOS (30%)
  const sharedObj = userA.objectives.filter(o =>
    userB.objectives.includes(o)
  );
  const maxObj = Math.max(userA.objectives.length, userB.objectives.length, 1);
  score += (sharedObj.length / maxObj) * 30;

  // MISMA FACULTAD (20%)
  if (userA.faculty && userB.faculty && userA.faculty === userB.faculty) {
    score += 20;
  }

  // SEMESTRES CERCANOS ±2 (10%)
  if (Math.abs((userA.semester || 1) - (userB.semester || 1)) <= 2) {
    score += 10;
  }

  return Math.round(score);

};

// OBTENER TODOS LOS USUARIOS
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find()
      .select("-password -__v");
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
      return res.status(400).json({
        message: "Debes enviar un término de búsqueda"
      });
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

    if (!yo) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Usar cualquiera de los dos campos que tenga el usuario
    const miCampus = yo.currentCampus || yo.campus;
    const miInstitucion = yo.institution;

    const candidatos = await User.find({
      _id:      { $ne: yo._id },
      institution: miInstitucion,
      $or: [
        { currentCampus: miCampus },
        { campus:        miCampus }
      ],
      isActive: true,
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
    const usuario = await User.findById(req.params.id)
      .select("-password -__v");

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(usuario);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ACTUALIZAR PERFIL
export const actualizarPerfil = async (req, res) => {
  try {
    const usuario = await User.findById(req.usuario._id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const campos = [
      "fullName",
      "bio",
      "career",
      "faculty",
      "semester",
      "interests",
      "objectives",
      "profilePicture",
      "isActive",
      "currentCampus",
      "campus"
    ];

    campos.forEach(campo => {
      if (req.body[campo] !== undefined) {
        usuario[campo] = req.body[campo];
      }
    });

    const usuarioActualizado = await usuario.save();
    const { password, __v, ...safeUser } = usuarioActualizado.toObject();

    res.status(200).json({
      message: "Perfil actualizado",
      usuario: safeUser
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};