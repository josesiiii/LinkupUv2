import Campus from "../models/Campus.js";
import User from "../models/User.js";
import UniversityRequest from "../models/UniversityRequest.js";



// CREAR CAMPUS
export const crearCampus = async (req, res) => {

  try {

    const campus = await Campus.create(
      req.body
    );

    res.status(201).json(campus);

  } catch (error) {

    res.status(500).json({ message: "Error interno del servidor" });

  }

};



// OBTENER CAMPUS
export const obtenerCampus = async (req, res) => {

  try {

    const campus = await Campus.find();

    res.status(200).json(campus);

  } catch (error) {

    res.status(500).json({ message: "Error interno del servidor" });

  }

};



// CAMBIAR CAMPUS ACTUAL
export const cambiarCampusActual = async (
  req,
  res
) => {

  try {

    const { campusId } = req.body;

    const usuario = await User.findById(
      req.usuario._id
    );

    usuario.currentCampus = campusId;

    await usuario.save();

    res.status(200).json({
      message:
        "Campus actualizado correctamente",
      usuario
    });

  } catch (error) {

    res.status(500).json({ message: "Error interno del servidor" });

  }

};



// SOLICITAR REGISTRO DE UNIVERSIDAD
export const solicitarUniversidad = async (req, res) => {
  try {
    const { universityName, city, contactName, contactEmail, message } = req.body;
    if (!universityName?.trim() || !city?.trim() || !contactName?.trim() || !contactEmail?.trim()) {
      return res.status(400).json({ message: "Todos los campos obligatorios son requeridos" });
    }
    await UniversityRequest.create({ universityName, city, contactName, contactEmail, message });
    res.status(201).json({ message: "Solicitud enviada correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// FEED POR CAMPUS
export const feedCampus = async (
  req,
  res
) => {

  try {

    const usuario = await User.findById(
      req.usuario._id
    );

    const usuarios = await User.find({
      currentCampus:
        usuario.currentCampus,

      _id: {
        $ne: usuario._id
      }
    })
      .populate(
        "currentCampus",
        "name shortName"
      )
      .select("-password");

    res.status(200).json(usuarios);

  } catch (error) {

    res.status(500).json({ message: "Error interno del servidor" });

  }

};