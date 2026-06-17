import Connection from "../models/Connection.js";
import User from "../models/User.js";

export const enviarConexion = async (req, res) => {
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
      .populate("from", "fullName email profilePicture career")
      .populate("to", "fullName email profilePicture career");

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
      .populate("from", "fullName email profilePicture bio interests")
      .populate("to", "fullName email profilePicture bio interests");

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

export const obtenerArchivadas = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;

    const solicitudes = await Connection.find({
      to: usuarioId,
      status: "archived"
    })
      .populate("from", "fullName email profilePicture career")
      .populate("to", "fullName email profilePicture career");

    res.status(200).json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const archivarConexion = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario._id;

    const conexion = await Connection.findById(id);

    if (!conexion) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    if (conexion.to.toString() !== usuarioId.toString()) {
      return res.status(403).json({ message: "No autorizado" });
    }

    if (conexion.status !== "pending") {
      return res.status(400).json({ message: "Solo se pueden archivar solicitudes pendientes" });
    }

    conexion.status = "archived";
    await conexion.save();

    res.status(200).json({ message: "Solicitud archivada", conexion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const restaurarConexion = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario._id;

    const conexion = await Connection.findById(id);

    if (!conexion) {
      return res.status(404).json({ message: "Solicitud no encontrada" });
    }

    if (conexion.to.toString() !== usuarioId.toString()) {
      return res.status(403).json({ message: "No autorizado" });
    }

    if (conexion.status !== "archived") {
      return res.status(400).json({ message: "Solo se pueden restaurar solicitudes archivadas" });
    }

    conexion.status = "pending";
    await conexion.save();

    res.status(200).json({ message: "Solicitud restaurada", conexion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const eliminarConexion = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario._id;

    const conexion = await Connection.findById(id);

    if (!conexion) {
      return res.status(404).json({ message: "Conexión no encontrada" });
    }

    if (
      conexion.from.toString() !== usuarioId.toString() &&
      conexion.to.toString() !== usuarioId.toString()
    ) {
      return res.status(403).json({ message: "No autorizado" });
    }

    await conexion.deleteOne();

    res.status(200).json({ message: "Conexión eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const socialInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.usuario._id;

    const [totalConnections, myConns, theirConns] = await Promise.all([
      Connection.countDocuments({
        status: "accepted",
        $or: [{ from: userId }, { to: userId }]
      }),
      Connection.find({ status: "accepted", $or: [{ from: myId }, { to: myId }] }),
      Connection.find({ status: "accepted", $or: [{ from: userId }, { to: userId }] }),
    ]);

    const myFriendIds = myConns.map((c) =>
      c.from.toString() === myId.toString() ? c.to.toString() : c.from.toString()
    );

    const theirFriendIds = theirConns.map((c) =>
      c.from.toString() === userId ? c.to.toString() : c.from.toString()
    );

    const mutualIds = myFriendIds.filter((id) => theirFriendIds.includes(id));

    const mutualFriends = await User.find({ _id: { $in: mutualIds } })
      .select("fullName profilePicture career");

    res.status(200).json({ totalConnections, mutualFriends });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};