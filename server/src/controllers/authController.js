import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { INSTITUTIONS } from "../config/institutions.js";

// REGISTER
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
      campus,         // ← acepta "campus"
      currentCampus,  // ← y también "currentCampus"
      city,
      department
    } = req.body;

    // 1. VALIDAR DOMAIN
    const domain = email.split("@")[1];
    const institution = INSTITUTIONS[domain];

    if (!institution) {
      return res.status(400).json({
        message: "Debes usar tu correo institucional"
      });
    }

    // 2. VALIDAR CAMPUS
    // Acepta cualquiera de los dos nombres de campo que envíe el frontend
    // y también acepta el label por si el frontend envía el texto visible
    const campusRecibido = currentCampus || campus;

    const validCampus = institution.campuses.find(
      c => c.id === campusRecibido || c.label === campusRecibido
    );

    if (!validCampus) {
      console.log("Campus recibido:", campusRecibido);
      console.log("Campus válidos:", institution.campuses.map(c => c.id));
      return res.status(400).json({
        message: "Campus inválido para la institución",
        campusRecibido,
        campusValidos: institution.campuses.map(c => ({
          id: c.id,
          label: c.label
        }))
      });
    }

    // 3. VERIFICAR EXISTENCIA
    const usuarioExistente = await User.findOne({ email });

    if (usuarioExistente) {
      return res.status(400).json({
        message: "El usuario ya existe"
      });
    }

    // 4. HASH PASSWORD
    const passwordHash = await bcrypt.hash(password, 10);

    // 5. CREAR USUARIO
    const nuevoUsuario = await User.create({
      fullName,
      email,
      password:    passwordHash,
      interests:   interests  || [],
      objectives:  objectives || [],
      career:      career     || "",
      faculty:     faculty    || "",
      semester:    semester   || 1,
      bio:         bio        || "",
      institution: institution.name,
      campus:      validCampus.id,  // ← siempre guarda el id limpio
      currentCampus: validCampus.id,
      city:        city       || validCampus.city,
      department:  department || validCampus.department
    });

    // 6. TOKEN
    const token = jwt.sign(
      { id: nuevoUsuario._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 7. RESPONSE
    const { password: _, ...usuarioSinPassword } = nuevoUsuario.toObject();

    res.status(201).json({
      message: "Usuario creado correctamente",
      token,
      usuario: usuarioSinPassword
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
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
    res.status(500).json({ message: error.message });
  }
};

// PERFIL
export const obtenerPerfil = async (req, res) => {
  res.status(200).json(req.usuario);
};