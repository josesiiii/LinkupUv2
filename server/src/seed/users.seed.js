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
  {
    fullName: "Juan Pérez",
    email: "juan@example.com",
    password: "123456",
    interests: ["React", "Node.js", "JavaScript"],
    objectives: ["MongoDB", "Arquitectura de software"],
    isActive: true
  },
  {
    fullName: "Ana Gómez",
    email: "ana@example.com",
    password: "123456",
    interests: ["MongoDB", "Express", "Node.js"],
    objectives: ["Frontend", "React Native"],
    isActive: true
  },
  {
    fullName: "Carlos Rodríguez",
    email: "carlos@example.com",
    password: "123456",
    interests: ["Python", "Data Science"],
    objectives: ["React", "Web Development"],
    isActive: true
  },
  {
    fullName: "Laura Martínez",
    email: "laura@example.com",
    password: "123456",
    interests: ["UI/UX", "Figma"],
    objectives: ["Backend", "Node.js"],
    isActive: true
  },
  {
    fullName: "David López",
    email: "david@example.com",
    password: "123456",
    interests: ["DevOps", "Docker"],
    objectives: ["MongoDB", "Backend"],
    isActive: true
  }
];

const seedUsuarios = async () => {
  try {
    await conectarDB();

    // limpiar colección
    await User.deleteMany();

    console.log("Usuarios eliminados");

    // hashear passwords
    const usuariosConPasswordHash = await Promise.all(
      usuarios.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10)
      }))
    );

    // insertar
    await User.insertMany(usuariosConPasswordHash);

    console.log("Usuarios insertados correctamente");

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedUsuarios();