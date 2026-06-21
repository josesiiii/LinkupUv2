import SavedProfile from "../models/SavedProfile.js";



// GUARDAR PERFIL
export const guardarPerfil = async (req, res) => {

  try {
    const { savedUser } = req.body;

    // Evitar guardarse a sí mismo
    if (savedUser === req.usuario._id.toString()) {

      return res.status(400).json({
        message: "No puedes guardarte a ti mismo"
      });

    }

    // Verificar si ya existe
    const existente = await SavedProfile.findOne({
      user: req.usuario._id,
      savedUser
    });

    if (existente) {

      return res.status(400).json({
        message: "Perfil ya guardado"
      });

    }

    // Crear guardado
    const guardado = await SavedProfile.create({
      user: req.usuario._id,
      savedUser
    });

    res.status(201).json(guardado);

  } catch (error) {

    res.status(500).json({ message: "Error interno del servidor" });

  }

};



// VER PERFILES GUARDADOS
export const obtenerGuardados = async (req, res) => {

  try {

    const guardados = await SavedProfile.find({
      user: req.usuario._id
    })
      .populate(
        "savedUser",
        "fullName email bio profilePicture interests objectives hasActiveStory"
      );

    res.status(200).json(guardados);

  } catch (error) {

    res.status(500).json({ message: "Error interno del servidor" });

  }

};



// ELIMINAR GUARDADO
export const eliminarGuardado = async (req, res) => {

  try {

    const eliminado = await SavedProfile.findOneAndDelete({
      user: req.usuario._id,
      savedUser: req.params.id
    });

    if (!eliminado) {

      return res.status(404).json({
        message: "Guardado no encontrado"
      });

    }

    res.status(200).json({
      message: "Perfil eliminado de guardados"
    });

  } catch (error) {

    res.status(500).json({ message: "Error interno del servidor" });

  }

};