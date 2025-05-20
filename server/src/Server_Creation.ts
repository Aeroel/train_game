// here I import external packages
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

export { Server_Creation }

class Server_Creation {
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