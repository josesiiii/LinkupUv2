import User from "../models/User.js";

export const actualizarPerfil = async (req, res) => {

  try {

    const usuario = await User.findById(req.usuario._id);

    if (!usuario) {

      return res.status(404).json({
        message: "Usuario no encontrado"
      });

    }

    // Actualizar campos
    usuario.fullName =
      req.body.fullName || usuario.fullName;

    usuario.interests =
      req.body.interests || usuario.interests;

    usuario.objectives =
      req.body.objectives || usuario.objectives;

    if (req.body.isActive !== undefined) {
      usuario.isActive = req.body.isActive;
    }

    // Guardar cambios
    const usuarioActualizado = await usuario.save();

    // Respuesta
    res.status(200).json({
      message: "Perfil actualizado",
      usuario: usuarioActualizado
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

export const obtenerUsuarios = async (req, res) => {

  try {

    // Obtener todos los usuarios
    const usuarios = await User.find()
      .select("-password");

    res.status(200).json(usuarios);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

export const buscarUsuarios = async (req, res) => {

  try {

    const { q } = req.query;

    const usuarioId = req.usuario._id;

    // si no hay query
    if (!q) {
      return res.status(400).json({
        message: "Debes enviar un término de búsqueda"
      });
    }

    const usuarios = await User.find({
      _id: { $ne: usuarioId }, // excluirte a ti mismo
      fullName: { 
        $regex: q,
        $options: "i" // insensitive case
      }
    }).select("fullName email interests");

    res.status(200).json(usuarios);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

export const feedUsuarios = async (req, res) => {

  try {

    const usuarioId = req.usuario._id;

    const usuario = await User.findById(usuarioId);

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    const feed = await User.find({
      _id: { $ne: usuarioId },
      $or: [
        // gente que sabe lo que yo quiero aprender
        { interests: { $in: usuario.objectives } },

        // gente que quiere aprender lo que yo sé
        { objectives: { $in: usuario.interests } }
      ]
    }).select("fullName interests objectives email");

    res.status(200).json(feed);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};