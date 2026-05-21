import dotenv from "dotenv";

import http from "http";

import { Server } from "socket.io";

import app from "./app.js";

import connectDB from "./config/db.js";

dotenv.config();

connectDB();



// HTTP SERVER
const server = http.createServer(app);



// SOCKET.IO
export const io = new Server(server, {

  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }

});



// USUARIOS ONLINE
const onlineUsers = {};



// SOCKET CONNECTION
io.on("connection", (socket) => {

  console.log(
    "Usuario conectado:",
    socket.id
  );



  // REGISTRAR USUARIO
  socket.on(
    "registerUser",
    (userId) => {

      onlineUsers[userId] =
        socket.id;

      console.log(
        "Usuarios online:"
      );

      console.log(
        onlineUsers
      );

    }
  );



  // JOIN ROOM
  socket.on(
    "joinRoom",
    (roomId) => {

      socket.join(roomId);

      console.log(
        `Socket ${socket.id} unido a room ${roomId}`
      );

    }
  );



  // SEND MESSAGE
  socket.on(
    "sendMessage",
    (data) => {

      io.to(data.roomId).emit(
        "receiveMessage",
        data
      );

    }
  );



  // DISCONNECT
  socket.on(
    "disconnect",
    () => {

      console.log(
        "Usuario desconectado:",
        socket.id
      );

      for (const userId in onlineUsers) {

        if (
          onlineUsers[userId] ===
          socket.id
        ) {

          delete onlineUsers[userId];

        }

      }

      console.log(
        "Usuarios online:"
      );

      console.log(
        onlineUsers
      );

    }
  );

});



const PORT =
  process.env.PORT || 5000;



server.listen(
  PORT,
  () => {

    console.log(
      `Servidor corriendo en puerto ${PORT}`
    );

  }
);