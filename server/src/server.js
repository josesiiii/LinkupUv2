import dotenv from "dotenv";

import http from "http";

import { Server } from "socket.io";

import app from "./app.js";

import connectDB from "./config/db.js";

import messageRoutes from "./routes/messageRoutes.js";

import savedProfileRoutes from "./routes/savedProfileRoutes.js";

dotenv.config();

connectDB();



// ROUTES
app.use(
  "/api/messages",
  messageRoutes
);

app.use(
  "/api/savedprofiles",
  savedProfileRoutes
);



// HTTP SERVER
const server = http.createServer(app);



// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});



// USUARIOS ONLINE
const onlineUsers = {};



// CONEXIÓN SOCKET
io.on("connection", (socket) => {

  console.log(
    "Usuario conectado:",
    socket.id
  );



  // REGISTRAR USUARIO
  socket.on("registerUser", (userId) => {

    onlineUsers[userId] = socket.id;

    console.log("Usuarios online:");
    console.log(onlineUsers);

  });



  // UNIRSE A ROOM
  socket.on("joinRoom", (roomId) => {

    socket.join(roomId);

    console.log(
      `Socket ${socket.id} unido a room ${roomId}`
    );

  });



  // ENVIAR MENSAJE REALTIME
  socket.on("sendMessage", (data) => {

    io.to(data.roomId).emit(
      "receiveMessage",
      data
    );

  });



  // DESCONECTAR
  socket.on("disconnect", () => {

    console.log(
      "Usuario desconectado:",
      socket.id
    );

    // eliminar usuario online
    for (const userId in onlineUsers) {

      if (
        onlineUsers[userId] === socket.id
      ) {

        delete onlineUsers[userId];

      }

    }

  });

});



const PORT = process.env.PORT || 5000;



server.listen(PORT, () => {

  console.log(
    `Servidor corriendo en puerto ${PORT}`
  );

});