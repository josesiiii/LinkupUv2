import express from "express";

import cors from "cors";

import authRoutes from "./routes/authRoutes.js";

import userRoutes from "./routes/userRoutes.js";

import messageRoutes from "./routes/messageRoutes.js";

import savedProfileRoutes from "./routes/savedProfileRoutes.js";

import campusRoutes from "./routes/campusRoutes.js";

import dotenv from "dotenv";

import adminRoutes       from "./routes/adminRoutes.js"

dotenv.config();
process.env.Linkup;


const app = express();



// MIDDLEWARES
app.use(cors());

app.use(express.json());



// ROUTES
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

app.use(
  "/api/savedprofiles",
  savedProfileRoutes
);

app.use(
  "/api/campus",
  campusRoutes
);

app.use(
  "/api/admin",
   adminRoutes
);


// TEST
app.get("/", (req, res) => {

  res.send(
    "API funcionando 🚀"
  );

});

export default app;