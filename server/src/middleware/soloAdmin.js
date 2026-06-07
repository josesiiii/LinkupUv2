const soloAdmin = (req, res, next) => {
  if (req.usuario.role !== "admin") {
    return res.status(403).json({
      message: "Acceso denegado"
    });
  }
  next();
};

export default soloAdmin;