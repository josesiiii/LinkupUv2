import User from "../models/User.js";

// Algoritmo de compatibilidad
const calcCompatibility = (userA, userB) => {
  let score = 0;

  if (userA.campus !== userB.campus) return 0;

  const sharedInterests = userA.interests.filter(i =>
    userB.interests.includes(i)
  );
  const maxInt = Math.max(userA.interests.length, userB.interests.length, 1);
  score += (sharedInterests.length / maxInt) * 40;

  const sharedObj = userA.objectives.filter(o =>
    userB.objectives.includes(o)
  );
  const maxObj = Math.max(userA.objectives.length, userB.objectives.length, 1);
  score += (sharedObj.length / maxObj) * 30;

  if (userA.faculty && userB.faculty && userA.faculty === userB.faculty) {
    score += 20;
  }

  if (Math.abs((userA.semester || 1) - (userB.semester || 1)) <= 2) {
    score += 10;
  }

  return Math.round(score);
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find().select("-password -__v");
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
      _id: { $ne: usuarioId },
      fullName: { $regex: "^" + q, $options: "i" }
    }).select("fullName email interests campus institution");

    res.status(200).json(usuarios);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const feedUsuarios = async (req, res) => {
  try {
    const yo = await User.findById(req.usuario._id);

    if (!yo) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const candidatos = await User.find({
      _id: { $ne: yo._id },
      campus: yo.campus,
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

export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id).select("-password -__v");

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json(usuario);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
      "isActive"
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