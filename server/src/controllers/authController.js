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
      campus,
      currentCampus,
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
    const campusRecibido = currentCampus || campus;

    const validCampus = institution.campuses.find(
      c => c.id === campusRecibido || c.label === campusRecibido
    );

    if (!validCampus) {
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
      password:     passwordHash,
      interests:    interests  || [],
      objectives:   objectives || [],
      career:       career     || "",
      faculty:      faculty    || "",
      semester:     semester   || 1,
      bio:          bio        || "",
      institution:  institution.name,
      campus:       validCampus.id,
      currentCampus: validCampus.id,
      city:         city       || validCampus.city,
      department:   department || validCampus.department
    });

    // 6. TOKEN
    const token = jwt.sign(
      { id: nuevoUsuario._id, role: nuevoUsuario.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 7. RESPONSE
    const { password: _, ...usuarioSinPassword } = nuevoUsuario.toObject();

    res.status(201).json({
      message: "Registro exitoso",
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

    // TOKEN — con role
    const token = jwt.sign(
      { id: usuario._id, role: usuario.role },
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
// CAMBIAR PASSWORD
export const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNuevo } = req.body;

    // 1. VALIDAR QUE LLEGARON LOS DOS CAMPOS
    if (!passwordActual || !passwordNuevo) {
      return res.status(400).json({
        message: "Debes enviar passwordActual y passwordNuevo"
      });
    }

    // 2. VALIDAR LONGITUD MÍNIMA
    if (passwordNuevo.length < 8) {
      return res.status(400).json({
        message: "La nueva contraseña debe tener al menos 8 caracteres"
      });
    }

    // 3. BUSCAR USUARIO CON PASSWORD (select lo excluye por defecto)
    const usuario = await User.findById(req.usuario._id).select("+password");

    // 4. VERIFICAR PASSWORD ACTUAL
    const passwordCorrecto = await bcrypt.compare(
      passwordActual,
      usuario.password
    );

    if (!passwordCorrecto) {
      return res.status(400).json({
        message: "La contraseña actual es incorrecta"
      });
    }

    // 5. VERIFICAR QUE LA NUEVA SEA DIFERENTE
    const esIgual = await bcrypt.compare(passwordNuevo, usuario.password);

    if (esIgual) {
      return res.status(400).json({
        message: "La nueva contraseña debe ser diferente a la actual"
      });
    }

    // 6. HASHEAR Y GUARDAR
    usuario.password = await bcrypt.hash(passwordNuevo, 10);
    await usuario.save();

    res.status(200).json({
      message: "Contraseña actualizada correctamente"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};