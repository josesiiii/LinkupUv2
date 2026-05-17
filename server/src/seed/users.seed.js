// src/seed/users.seed.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB conectado para seed");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const usuarios = [

  // ── ITM Robledo — 4 usuarios (compatibilidad alta entre ellos) ──
  {
    fullName: "Camilo Restrepo",
    email: "camilo@itm.edu.co",
    password: "12345678",
    institution: "Instituto Tecnológico Metropolitano",
    campus: "itm-robledo",
    city: "Medellín",
    department: "Antioquia",
    career: "Ingeniería de Sistemas",
    faculty: "Facultad de Ingeniería",
    semester: 5,
    bio: "Apasionado por el backend y las APIs REST.",
    interests: ["Node.js", "MongoDB", "Docker"],
    objectives: ["Networking", "Proyectos"],
    isActive: true
  },
  {
    fullName: "Valentina Torres",
    email: "valentina@itm.edu.co",
    password: "12345678",
    institution: "Instituto Tecnológico Metropolitano",
    campus: "itm-robledo",
    city: "Medellín",
    department: "Antioquia",
    career: "Ingeniería de Sistemas",
    faculty: "Facultad de Ingeniería",
    semester: 4,
    bio: "Me encanta el frontend y el diseño UI.",
    interests: ["React", "Node.js", "Figma"],
    objectives: ["Proyectos", "Networking"],
    isActive: true
  },
  {
    fullName: "Sebastián Muñoz",
    email: "sebastian@itm.edu.co",
    password: "12345678",
    institution: "Instituto Tecnológico Metropolitano",
    campus: "itm-robledo",
    city: "Medellín",
    department: "Antioquia",
    career: "Tecnología en Desarrollo de Software",
    faculty: "Facultad de Ingeniería",
    semester: 6,
    bio: "Full Stack developer en formación.",
    interests: ["Node.js", "React", "MongoDB"],
    objectives: ["Proyectos", "Emprendimiento"],
    isActive: true
  },
  {
    fullName: "Isabella Cardona",
    email: "isabella@itm.edu.co",
    password: "12345678",
    institution: "Instituto Tecnológico Metropolitano",
    campus: "itm-robledo",
    city: "Medellín",
    department: "Antioquia",
    career: "Ingeniería de Sistemas",
    faculty: "Facultad de Ingeniería",
    semester: 3,
    bio: "Interesada en IA y ciencia de datos.",
    interests: ["Python", "Machine Learning", "Docker"],
    objectives: ["Networking", "Investigación"],
    isActive: true
  },

  // ── ITM Fraternidad — 2 usuarios (mismo campus, institución diferente a Robledo)
  {
    fullName: "Andrés Ospina",
    email: "andres@itm.edu.co",
    password: "12345678",
    institution: "Instituto Tecnológico Metropolitano",
    campus: "itm-fraternidad",
    city: "Medellín",
    department: "Antioquia",
    career: "Ingeniería Electrónica",
    faculty: "Facultad de Ingeniería",
    semester: 7,
    bio: "Entusiasta del IoT y sistemas embebidos.",
    interests: ["IoT", "Arduino", "Python"],
    objectives: ["Proyectos", "Networking"],
    isActive: true
  },
  {
    fullName: "Manuela Ríos",
    email: "manuela@itm.edu.co",
    password: "12345678",
    institution: "Instituto Tecnológico Metropolitano",
    campus: "itm-fraternidad",
    city: "Medellín",
    department: "Antioquia",
    career: "Ingeniería Electrónica",
    faculty: "Facultad de Ingeniería",
    semester: 6,
    bio: "Me apasionan los sistemas embebidos.",
    interests: ["Arduino", "IoT", "Node.js"],
    objectives: ["Proyectos", "Investigación"],
    isActive: true
  },

  // ── UdeA Ciudad Universitaria — 2 usuarios
  {
    fullName: "Santiago Herrera",
    email: "santiago@udea.edu.co",
    password: "12345678",
    institution: "Universidad de Antioquia",
    campus: "udea-ciudadela",
    city: "Medellín",
    department: "Antioquia",
    career: "Ingeniería de Sistemas",
    faculty: "Facultad de Ingeniería",
    semester: 8,
    bio: "Investigador en seguridad informática.",
    interests: ["Ciberseguridad", "Python", "Linux"],
    objectives: ["Investigación", "Networking"],
    isActive: true
  },
  {
    fullName: "Daniela Vargas",
    email: "daniela@udea.edu.co",
    password: "12345678",
    institution: "Universidad de Antioquia",
    campus: "udea-ciudadela",
    city: "Medellín",
    department: "Antioquia",
    career: "Ciencia de Datos",
    faculty: "Facultad de Ingeniería",
    semester: 5,
    bio: "Apasionada por el análisis de datos.",
    interests: ["Python", "Machine Learning", "SQL"],
    objectives: ["Investigación", "Proyectos"],
    isActive: true
  },

  // ── SENA Medellín Centro — 2 usuarios
  {
    fullName: "Felipe Agudelo",
    email: "felipe@soy.sena.edu.co",
    password: "12345678",
    institution: "SENA",
    campus: "sena-medellin-centro",
    city: "Medellín",
    department: "Antioquia",
    career: "Análisis y Desarrollo de Software",
    faculty: "Tecnología",
    semester: 2,
    bio: "Desarrollador en formación, fan del diseño web.",
    interests: ["HTML", "CSS", "JavaScript"],
    objectives: ["Emprendimiento", "Proyectos"],
    isActive: true
  },
  {
    fullName: "Luisa Fernanda Cano",
    email: "luisa@soy.sena.edu.co",
    password: "12345678",
    institution: "SENA",
    campus: "sena-medellin-centro",
    city: "Medellín",
    department: "Antioquia",
    career: "Análisis y Desarrollo de Software",
    faculty: "Tecnología",
    semester: 3,
    bio: "Me gusta el desarrollo móvil y el diseño.",
    interests: ["JavaScript", "React", "Figma"],
    objectives: ["Proyectos", "Emprendimiento"],
    isActive: true
  }

];

const seedUsuarios = async () => {
  try {
    await conectarDB();

    // Limpiar colección
    await User.deleteMany();
    console.log("Colección limpiada");

    // Hashear passwords
    const usuariosConHash = await Promise.all(
      usuarios.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    // Insertar
    await User.insertMany(usuariosConHash);

    console.log(`✓ ${usuariosConHash.length} usuarios insertados`);
    console.log("");
    console.log("Distribución:");
    console.log("  ITM Robledo        → 4 usuarios (camilo, valentina, sebastian, isabella)");
    console.log("  ITM Fraternidad    → 2 usuarios (andres, manuela)");
    console.log("  UdeA Ciudadela     → 2 usuarios (santiago, daniela)");
    console.log("  SENA Centro        → 2 usuarios (felipe, luisa)");
    console.log("");
    console.log("Password de todos: 12345678");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedUsuarios();