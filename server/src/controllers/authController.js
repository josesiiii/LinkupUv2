import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { INSTITUTIONS } from "../config/institutions.js";

export const registrarUsuario = async (req, res) => {

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
      campus,
      city,
      department
    } = req.body;

    // 1. Validar dominio institucional
    const domain = email.split("@")[1];
    const institution = INSTITUTIONS[domain];

    if (!institution) {
      return res.status(400).json({
        message: "Debes usar tu correo institucional (.edu.co)"
      });
    }

    // 2. Validar que el campus pertenezca a la institución
    const validCampus = institution.campuses.find(c => c.id === campus);
    if (!validCampus) {
      return res.status(400).json({
        message: "El campus no corresponde a tu institución"
      });
    }

    // 3. Verificar usuario existente
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({
        message: "El usuario ya existe"
      });
    }

    // 4. Encriptar password
    const passwordHash = await bcrypt.hash(password, 10);

    // 5. Crear usuario — institution se asigna automáticamente
    const nuevoUsuario = await User.create({
      fullName,
      email,
      password: passwordHash,
      interests:   interests   || [],
      objectives:  objectives  || [],
      career:      career      || "",
      faculty:     faculty     || "",
      semester:    semester    || 1,
      bio:         bio         || "",
      institution: institution.name, // ← automático por dominio
      campus,
      city:        city        || validCampus.city,
      department:  department  || validCampus.department
    });

    // 6. Generar token
    const token = jwt.sign(
      { id: nuevoUsuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 7. Respuesta sin password
    const { password: _, ...usuarioSinPassword } = nuevoUsuario.toObject();

    res.status(201).json({
      message: "Usuario creado correctamente",
      token,
      usuario: usuarioSinPassword
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

export const iniciarSesion = async (req, res) => {

  try {

    const { email, password } = req.body;

    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        message: "Usuario no encontrado"
      });
    }

    const passwordCorrecto = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecto) {
      return res.status(400).json({
        message: "Password incorrecto"
      });
    }

    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...usuarioSinPassword } = usuario.toObject();

    res.status(200).json({
      message: "Login exitoso",
      token,
      usuario: usuarioSinPassword
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