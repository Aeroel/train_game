// here I import external packages
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { Socket_Processor } from "#root/Socket_Processor.js"
import { Helper_Functions } from "./Helper_Functions.js";


export { Server_Stuff }

class Server_Stuff {
  static create() {
    
   const { httpServer, io } = this.getHttpServerAndIO();
   
  io.on("connection", (socket) => {
  Socket_Processor.onNewConnection(socket);
  Socket_Processor.onDisconnect(socket);
  Socket_Processor.onControl(socket);
  Socket_Processor.onPing(socket);
  
    });
    
      return httpServer;
  } 
 static  createAndStartServer() {
  const httpServer = this.create();
 const arbitrary_number = 3000;
 const port = arbitrary_number;
 
      httpServer.listen(port);

const LANIP = Helper_Functions.getLocalIP();
const localhostIP = "127.0.0.1";
console.log(`Yaaaay. Started a server on port ${port}.`);
console.log(`LAN IP: ${LANIP}:${port}`);
console.log(`localhost IP: ${localhostIP}:${port}.`);

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