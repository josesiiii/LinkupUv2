import dotenv from "dotenv";

import app from "./app.js";

import connectDB from "./config/db.js";

import messageRoutes from "./routes/messageRoutes.js";

import savedProfileRoutes from "./routes/savedProfileRoutes.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

app.use(
  "/api/messages",
  messageRoutes
);

app.use(
  "/api/savedprofiles",
  savedProfileRoutes
);