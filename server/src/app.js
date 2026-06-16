import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import authRoutes         from "./routes/authRoutes.js";
import authGoogleRoutes   from "./routes/authGoogle.js";
import userRoutes         from "./routes/userRoutes.js";
import messageRoutes      from "./routes/messageRoutes.js";
import savedProfileRoutes from "./routes/savedProfileRoutes.js";
import campusRoutes       from "./routes/campusRoutes.js";
import adminRoutes        from "./routes/adminRoutes.js";
import connectionRoutes   from "./routes/connectionRoutes.js";
import institutionRoutes from "./routes/institutionRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import passportConfig     from "./config/passport.js";


dotenv.config();

const app = express();

// Passport (debe estar antes de las rutas)
app.use(passportConfig.initialize());

// ── SEGURIDAD ─────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: false }));

// Rate limiting general — todas las rutas
const limitadorGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000,                  // máximo 100 requests por IP
  message: {
    message: "Demasiadas solicitudes, intenta de nuevo en 15 minutos"
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting estricto — solo auth (login y register)
const limitadorAuth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,                   // máximo 10 intentos por IP
  message: {
    message: "Demasiados intentos, intenta de nuevo en 15 minutos"
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limitadorGeneral);

// ── MIDDLEWARES ───────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Body:", req.body);
  next();
});

// ── ROUTES ────────────────────────────────────
app.use("/api/auth",         limitadorAuth, authRoutes);
app.use("/api/auth",         authGoogleRoutes);
app.use("/api/users",        userRoutes);
app.use("/api/messages",     messageRoutes);
app.use("/api/savedprofiles", savedProfileRoutes);
app.use("/api/campus",       campusRoutes);
app.use("/api/admin",        adminRoutes);
app.use("/api/connections",   connectionRoutes);
app.use("/api/institutions", institutionRoutes);
app.use("/api/conversations", conversationRoutes);


// ── TEST ──────────────────────────────────────
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

export default app;