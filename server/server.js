import { log } from "console";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const allowAnyOrigin = true;
const options = {
    cors: {
      origin: 
      allowAnyOrigin
    }
  }
const io = new Server(httpServer, options);

io.on("connection", (socket) => {
    console.log("A socket connected");
    socket.emit("welcome", "You have successfully connected to the server. Welcome!");
    
});

const port = 3000;
httpServer.listen(port);
console.log(`Started a server on port ${port}`);
