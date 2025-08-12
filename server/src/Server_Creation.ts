// here I import external packages
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { Socket_Processor } from "#root/Socket_Processor.js"

export { Server_Creation }

class Server_Creation {
  static create() {
    
   const { httpServer, io } = Server_Creation.getHttpServerAndIO();
   
  io.on("connection", (socket) => {
  Socket_Processor.onNewConnection(socket);
  Socket_Processor.onDisconnect(socket);
  Socket_Processor.onControl(socket);
  Socket_Processor.onPing(socket);
  
    });
    
      return httpServer;
  }
    static getHttpServerAndIO() {
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
        return {httpServer, io};
    }
}