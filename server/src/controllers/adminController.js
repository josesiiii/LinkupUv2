import User from "../models/User.js";
import Connection from "../models/Connection.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Story from "../models/Story.js";
import SavedProfile from "../models/SavedProfile.js";

export const obtenerTodosUsuarios = async (req, res) => {
  try {
    const { q, status, page = 1, limit = 30 } = req.query;
    const filter = {};
    if (q) {
      filter.$or = [
        { fullName: { $regex: q, $options: "i" } },
        { email:    { $regex: q, $options: "i" } },
      ];
    }
    if (status === "active")   filter.isActive = true;
    if (status === "inactive") filter.isActive = false;

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const [usuarios, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      usuarios,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    if (req.params.id === req.usuario._id.toString())
      return res.status(400).json({ message: "No puedes eliminarte a ti mismo" });
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const toggleActivarUsuario = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });
    usuario.isActive = !usuario.isActive;
    await usuario.save();
    res.status(200).json({
      message: `Usuario ${usuario.isActive ? "activado" : "desactivado"}`,
      isActive: usuario.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Rellena los días sin actividad con count: 0
const fillDays = (data, numDays) => {
  const map = {};
  data.forEach(d => { map[d._id] = d.count; });
  const result = [];
  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    result.push({ _id: key, count: map[key] || 0 });
  }
  return result;
};

export const getEstadisticas = async (req, res) => {
  try {
    const days = Math.min(Math.max(parseInt(req.query.days) || 30, 7), 90);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      totalUsuarios,
      usuariosActivos,
      usuariosNuevosHoy,
      usuariosNuevosSemana,
      totalConexiones,
      conexionesPendientes,
      conexionesAceptadas,
      conexionesRechazadas,
      totalConversaciones,
      totalMensajes,
      mensajesLeidos,
      totalHistorias,
      totalGuardados,
      usuariosConFoto,
      usuariosCompletos,
      crecimientoUsuarios,
      actividadConexiones,
      actividadMensajes,
      actividadGuardados,
      usuariosPorInstitucion,
      usuariosPorFacultad,
      distribucionIntereses,
      usuariosPorSemestre,
      historiasPorTipo,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }),
      Connection.countDocuments(),
      Connection.countDocuments({ status: "pending" }),
      Connection.countDocuments({ status: "accepted" }),
      Connection.countDocuments({ status: "rejected" }),
      Conversation.countDocuments(),
      Message.countDocuments(),
      Message.countDocuments({ "readBy.0": { $exists: true } }),
      Story.countDocuments(),
      SavedProfile.countDocuments(),
      User.countDocuments({ profilePicture: { $nin: [null, ""] } }),
      User.countDocuments({
        profilePicture: { $nin: [null, ""] },
        bio: { $nin: [null, ""] },
        career: { $nin: [null, ""] },
        interests: { $exists: true, $not: { $size: 0 } },
      }),
      User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Connection.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Message.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      SavedProfile.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      User.aggregate([
        { $match: { institution: { $nin: [null, ""] } } },
        {
          $group: {
            _id: { $trim: { input: { $toLower: "$institution" } } },
            count: { $sum: 1 },
            displayName: { $first: "$institution" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { _id: "$displayName", count: 1 } },
      ]),
      User.aggregate([
        { $match: { faculty: { $nin: [null, ""] } } },
        { $group: { _id: "$faculty", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      User.aggregate([
        { $unwind: "$interests" },
        { $match: { interests: { $nin: [null, ""] } } },
        { $group: { _id: "$interests", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 12 },
      ]),
      User.aggregate([
        { $match: { semester: { $exists: true, $ne: null } } },
        { $group: { _id: "$semester", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Story.aggregate([
        { $group: { _id: "$mediaType", count: { $sum: 1 } } },
      ]),
    ]);

    const tasaAceptacion = totalConexiones > 0
      ? Math.round((conexionesAceptadas / totalConexiones) * 100) : 0;
    const tasaLectura = totalMensajes > 0
      ? Math.round((mensajesLeidos / totalMensajes) * 100) : 0;
    const adoptionFoto = totalUsuarios > 0
      ? Math.round((usuariosConFoto / totalUsuarios) * 100) : 0;
    const completitudPerfil = totalUsuarios > 0
      ? Math.round((usuariosCompletos / totalUsuarios) * 100) : 0;

    res.status(200).json({
      overview: {
        totalUsuarios,
        usuariosActivos,
        usuariosInactivos: totalUsuarios - usuariosActivos,
        usuariosNuevosHoy,
        usuariosNuevosSemana,
        totalConexiones,
        conexionesPendientes,
        conexionesAceptadas,
        conexionesRechazadas,
        tasaAceptacion,
        totalConversaciones,
        totalMensajes,
        mensajesLeidos,
        tasaLectura,
        totalHistorias,
        totalGuardados,
        adoptionFoto,
        completitudPerfil,
      },
      timeSeries: {
        crecimientoUsuarios: fillDays(crecimientoUsuarios, days),
        actividadConexiones: fillDays(actividadConexiones, days),
        actividadMensajes:   fillDays(actividadMensajes, days),
        actividadGuardados:  fillDays(actividadGuardados, days),
      },
      breakdowns: {
        usuariosPorInstitucion,
        usuariosPorFacultad,
        distribucionIntereses,
        usuariosPorSemestre,
        historiasPorTipo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
