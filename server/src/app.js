import express from "express";

import cors from "cors";

import authRoutes from "./routes/authRoutes.js";

import userRoutes from "./routes/userRoutes.js";

import connectionRoutes from "./routes/connectionRoutes.js";

import institutionRoutes from "./routes/institutionRoutes.js";

import conversationRoutes from "./routes/conversationRoutes.js";



const app = express();

app.use(cors());

app.use(express.json());

// Auth
app.use("/api/auth", authRoutes);

// Users
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.use("/api/connections", connectionRoutes);

app.use("/api/institutions", institutionRoutes);

app.use("/api/conversations", conversationRoutes);

export default app;



