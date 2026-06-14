import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./config/db.js";
import registerChatSocket from "./sockets/chatSocket.js";

connectDB();

// HTTP SERVER
const server = http.createServer(app);



// SOCKET.IO
const io = new Server(server, {

  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }

});

registerChatSocket(io);



const PORT =
  process.env.PORT ||
  5001;


server.listen(
  PORT,
  () => {

    console.log(
      `Servidor corriendo en puerto ${PORT}`
    );

  }
);