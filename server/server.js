import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Player } from "./Player.js"
import { World } from "./World.js"

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
let anyS = false
io.on("connection", async (socket) => {
    console.log("A socket connected");
    socket.emit("welcome", "You have successfully connected to the server. Welcome!");
    const newPlayerEntity = new Player();
    newPlayerEntity.setX(100);
    newPlayerEntity.setY(100);
    newPlayerEntity.setWidth(50);
    newPlayerEntity.setHeight(40);
    newPlayerEntity.setColor(`black`);
    newPlayerEntity.setVisionRange(200);
    newPlayerEntity.setAssociatedSocketConnectionId(socket.id);
    World.addEntity(newPlayerEntity);
    anyS = true

});

const port = 3000;
httpServer.listen(port);
console.log(`Started a server on port ${port}`);

let currTimeMs = Date.now();
let lastTimeMs = currTimeMs;
let elapsedTimeMs = 0;
const tickEveryMs = 20;
function loop() {
  currTimeMs = Date.now();
  elapsedTimeMs += (currTimeMs - lastTimeMs);
 if(elapsedTimeMs >= tickEveryMs) {
   elapsedTimeMs = 0;
   if(anyS) {
   World.state.entities.forEach(entity => {
     entity.y += 1
     entity.x += 1
   })
     
   }
   io.emit("newWorldState", World.state)
   
 }
    setTimeout(function() {
      loop();
  }, 10);
  
}
loop()