import jwt from "jsonwebtoken";

import User from "../models/User.js";

const protegerRuta = async (req, res, next) => {

  try {

    let token;

    // Verificar header authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token = req.headers.authorization.split(" ")[1];

      // Verificar token
const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET
);
      // Buscar usuario
      req.usuario = await User.findById(decoded.id).select("-password");

      next();

    } else {

      return res.status(401).json({
        message: "No autorizado"
      });

    }

  } catch (error) {

    return res.status(401).json({
      message: "Token inválido"
    });

  }

};

export default protegerRuta;