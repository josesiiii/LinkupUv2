import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import User from "../models/User.js";

import { INSTITUTIONS } from "../config/institutions.js";



// REGISTER
export const registrarUsuario = async (
  req,
  res
) => {

  try {

    const {

      fullName,

      email,

      password,

      interests,

      objectives,

      career,

      faculty,

      semester,

      bio,

      currentCampus,

      city,

      department

    } = req.body;

    // 1. VALIDAR DOMAIN
    const domain =
      email.split("@")[1];

    const institution =
      INSTITUTIONS[domain];

    if (!institution) {

      return res.status(400).json({
        message:
          "Debes usar tu correo institucional"
      });

    }

    // 2. VALIDAR CAMPUS
    const validCampus =
      institution.campuses.find(
        c =>
          c.id === currentCampus
      );

    if (!validCampus) {

      return res.status(400).json({
        message:
          "Campus inválido para la institución"
      });

    }

    // 3. VERIFICAR EXISTENCIA
    const usuarioExistente =
      await User.findOne({
        email
      });

    if (usuarioExistente) {

      return res.status(400).json({
        message:
          "El usuario ya existe"
      });

    }

    // 4. HASH PASSWORD
    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );

    // 5. CREAR USUARIO
    const nuevoUsuario =
      await User.create({

        fullName,

        email,

        password:
          passwordHash,

        interests:
          interests || [],

        objectives:
          objectives || [],

        career:
          career || "",

        faculty:
          faculty || "",

        semester:
          semester || 1,

        bio:
          bio || "",

        institution: institution.name,

        currentCampus,

        city:
          city ||
          validCampus.city,

        department:
          department ||
          validCampus.department

      });

    // 6. TOKEN
    const token = jwt.sign(

      {
        id:
          nuevoUsuario._id
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }

    );

    // 7. RESPONSE
    const {
      password: _,
      ...usuarioSinPassword
    } =
      nuevoUsuario.toObject();

    res.status(201).json({

      message:
        "Usuario creado correctamente",

      token,

      usuario:
        usuarioSinPassword

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// LOGIN
export const iniciarSesion = async (
  req,
  res
) => {

  try {

    const {
      email,
      password
    } = req.body;

    const usuario =
      await User.findOne({
        email
      });

    if (!usuario) {

      return res.status(400).json({
        message:
          "Usuario no encontrado"
      });

    }

    const passwordCorrecto =
      await bcrypt.compare(
        password,
        usuario.password
      );

    if (!passwordCorrecto) {

      return res.status(400).json({
        message:
          "Password incorrecto"
      });

    }

    const token = jwt.sign(

      {
        id:
          usuario._id
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }

    );

    const {
      password: _,
      ...usuarioSinPassword
    } =
      usuario.toObject();

    res.status(200).json({

      message:
        "Login exitoso",

      token,

      usuario:
        usuarioSinPassword

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// PERFIL
export const obtenerPerfil = async (
  req,
  res
) => {

  res.status(200).json(
    req.usuario
  );

};