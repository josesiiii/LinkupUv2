// src/seed/newProfiles.seed.js
//
// Inserta/actualiza 4 perfiles de prueba en el campus "linkup-hq"
// (mismo campus que Oscar Gómez), SIN borrar la colección existente.
// Ejecutar desde server/: node src/seed/newProfiles.seed.js
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

const perfiles = [
  {
    fullName: "María José Restrepo",
    email: "mariajose.restrepo@linkup.com",
    password: "12345678",
    institution: "LinkUp",
    currentCampus: "linkup-hq",
    city: "Medellín",
    department: "Antioquia",
    career: "Diseño Gráfico",
    faculty: "Facultad de Artes y Diseño",
    semester: 2,
    bio: "Diseñadora apasionada por la identidad visual y la fotografía. Siempre buscando nuevos proyectos creativos.",
    interests: ["Diseño UX/UI", "Fotografía", "Branding"],
    objectives: ["Networking", "Proyectos"],
    isActive: true,
    photos: [
      { url: "https://images.unsplash.com/photo-1777971911576-de6d56a93681?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", order: 0 },
      { url: "https://images.unsplash.com/photo-1779406859387-5d6fd116b3ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8", order: 1 },
    ],
  },
  {
    fullName: "Juan Pablo Henao",
    email: "juanpablo.henao@linkup.com",
    password: "12345678",
    institution: "LinkUp",
    currentCampus: "linkup-hq",
    city: "Medellín",
    department: "Antioquia",
    career: "Ingeniería de Software",
    faculty: "Facultad de Ingeniería",
    semester: 1,
    bio: "Estudiante de primer semestre, me encanta programar y aprender sobre inteligencia artificial.",
    interests: ["Programación", "Videojuegos", "Inteligencia Artificial"],
    objectives: ["Proyectos", "Emprendimiento"],
    isActive: true,
    photos: [
      { url: "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D", order: 0 },
      { url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D", order: 1 },
    ],
  },
  {
    fullName: "Camila Zapata",
    email: "camila.zapata@linkup.com",
    password: "12345678",
    institution: "LinkUp",
    currentCampus: "linkup-hq",
    city: "Medellín",
    department: "Antioquia",
    career: "Administración de Empresas",
    faculty: "Facultad de Ciencias Económicas",
    semester: 3,
    bio: "Futura emprendedora, me interesa el marketing digital y las finanzas personales.",
    interests: ["Emprendimiento", "Marketing Digital", "Finanzas"],
    objectives: ["Emprendimiento", "Networking"],
    isActive: true,
    photos: [
      { url: "https://images.unsplash.com/photo-1632765854612-9b02b6ec2b15?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D", order: 0 },
      { url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D", order: 1 },
    ],
  },
  {
    fullName: "Andrés Felipe Gómez",
    email: "andresfelipe.gomez@linkup.com",
    password: "12345678",
    institution: "LinkUp",
    currentCampus: "linkup-hq",
    city: "Medellín",
    department: "Antioquia",
    career: "Comunicación Digital",
    faculty: "Facultad de Comunicaciones",
    semester: 2,
    bio: "Creador de contenido y amante del cine. Buscando conectar con gente creativa del campus.",
    interests: ["Fotografía", "Redes Sociales", "Cine"],
    objectives: ["Networking", "Proyectos"],
    isActive: true,
    photos: [
      { url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D", order: 0 },
      { url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cG9ydHJhaXR8ZW58MHx8MHx8fDA%3D", order: 1 },
    ],
  },
];

const seedPerfiles = async () => {
  try {
    await conectarDB();

    for (const perfil of perfiles) {
      const hashedPassword = await bcrypt.hash(perfil.password, 10);
      await User.findOneAndUpdate(
        { email: perfil.email },
        { ...perfil, password: hashedPassword },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`✓ ${perfil.fullName} (${perfil.email})`);
    }

    console.log("");
    console.log(`${perfiles.length} perfiles insertados/actualizados en el campus "linkup-hq".`);
    console.log("Ningún usuario existente fue eliminado.");
    console.log("Password de todos: 12345678");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedPerfiles();
