import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const registrarUsuario = async (req, res) => {

  try {

    const {
      fullName,
      email,
      password,
      interests,
      objectives
    } = req.body;

    // Verificar usuario existente
    const usuarioExistente = await User.findOne({ email });

    if (usuarioExistente) {

      return res.status(400).json({
        message: "El usuario ya existe"
      });

    }

    // Encriptar password
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = await User.create({
      fullName,
      email,
      password: passwordHash,
      interests,
      objectives
    });

    // Generar token
    const token = jwt.sign(
      {
        id: nuevoUsuario._id
      },
      "secretkey",
      {
        expiresIn: "7d"
      }
    );

    // Respuesta
    res.status(201).json({
      message: "Usuario creado correctamente",
      token,
      usuario: nuevoUsuario
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



export const iniciarSesion = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    // Buscar usuario
    const usuario = await User.findOne({ email });

    if (!usuario) {

      return res.status(400).json({
        message: "Usuario no encontrado"
      });

    }

    // Comparar password
    const passwordCorrecto = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!passwordCorrecto) {

      return res.status(400).json({
        message: "Password incorrecto"
      });

    }

    // Generar token
    const token = jwt.sign(
      {
        id: usuario._id
      },
      "secretkey",
      {
        expiresIn: "7d"
      }
    );

    // Respuesta
    res.status(200).json({
      message: "Login exitoso",
      token,
      usuario
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
export const obtenerPerfil = async (req, res) => {

  res.status(200).json(req.usuario);

};