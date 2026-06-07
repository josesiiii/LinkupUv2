import User from "../models/User.js";

// GET /api/admin/users
export const obtenerTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/admin/users/:id
export const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // No permitir que el admin se elimine a sí mismo
    if (req.params.id === req.usuario._id.toString()) {
      return res.status(400).json({ message: "No puedes eliminarte a ti mismo" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/admin/users/:id/toggle
export const toggleActivarUsuario = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    usuario.isActive = !usuario.isActive;
    await usuario.save();

    res.status(200).json({
      message: `Usuario ${usuario.isActive ? "activado" : "desactivado"}`,
      isActive: usuario.isActive
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};