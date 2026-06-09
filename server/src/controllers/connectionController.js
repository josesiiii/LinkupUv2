import Connection from "../models/Connection.js";
import User from "../models/User.js";

export const enviarConexion = async (req, res) => {
  console.log("=== CONEXION DEBUG ===");
  console.log("Body:", req.body);
  console.log("Usuario:", req.usuario);
  try {
    const from = req.usuario._id;
    const { to } = req.body;

    if (from.toString() === to) {
      return res.status(400).json({
        message: "No puedes conectarte contigo mismo"
      });
    }

    const existe = await Connection.findOne({
      $or: [
        { from, to },
        { from: to, to: from }
      ],
      status: { $in: ["pending", "accepted"] }
    });

    if (existe) {
      return res.status(400).json({
        message: "Ya existe una conexión o solicitud"
      });
    }

    const conexion = await Connection.create({ from, to });

    res.status(201).json({
      message: "Solicitud enviada",
      conexion
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const aceptarConexion = async (req, res) => {
  try {
    const { id } = req.params;

    const conexion = await Connection.findById(id);

    if (!conexion) {
      return res.status(404).json({
        message: "Conexión no encontrada"
      });
    }

    conexion.status = "accepted";
    await conexion.save();

    res.status(200).json({
      message: "Conexión aceptada",
      conexion
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const obtenerPendientes = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;

    const solicitudes = await Connection.find({
      to: usuarioId,
      status: "pending"
    })
      .populate("from", "fullName email")
      .populate("to", "fullName email");

    res.status(200).json(solicitudes);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const obtenerAceptadas = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;

    const conexiones = await Connection.find({
      status: "accepted",
      $or: [{ from: usuarioId }, { to: usuarioId }]
    })
      .populate("from", "fullName email")
      .populate("to", "fullName email");

    res.status(200).json(conexiones);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const rechazarConexion = async (req, res) => {
  try {
    const { id } = req.params;

    const conexion = await Connection.findById(id);

    if (!conexion) {
      return res.status(404).json({
        message: "Conexión no encontrada"
      });
    }

    conexion.status = "rejected";
    await conexion.save();

    res.status(200).json({
      message: "Conexión rechazada",
      conexion
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const misContactos = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;

    const conexiones = await Connection.find({
      status: "accepted",
      $or: [{ from: usuarioId }, { to: usuarioId }]
    });

    const contactos = conexiones.map(conn =>
      conn.from.toString() === usuarioId.toString()
        ? conn.to
        : conn.from
    );

    const usuarios = await User.find({
      _id: { $in: contactos }
    }).select("fullName email interests");

    res.status(200).json(usuarios);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};