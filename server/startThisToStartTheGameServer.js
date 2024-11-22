import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Player } from "./Player.js"
import { World } from "./World.js";
import { Helper_Functions } from "./Helper_Functions.js";
import { Game_Loop } from "./Game_Loop.js";
import { Add_Some_Entities_To_The_World } from "./Add_Some_Entities_To_The_World.js";

const app = express();
const httpServer = createServer(app);

const allowAnyOrigin = true;
const options = {
  cors: {
    origin:
      allowAnyOrigin
  }
}

Add_Some_Entities_To_The_World.doItNow();

const io = new Server(httpServer, options);
io.on("connection", (socket) => {
  console.log("A socket connected"); Helper_Functions.runThisFunctionUponInitiationOfASocketConnection(socket);
  socket.emit("welcome", "You have successfully connected to the server. Welcome!");
  const newPlayerEntity = new Player();
  newPlayerEntity.setX(0);
  newPlayerEntity.setY(0);
  newPlayerEntity.setWidth(50);
  newPlayerEntity.setHeight(50);
  newPlayerEntity.setVisionRange(1000);
  newPlayerEntity.setSocketId(socket.id);
  World.addEntity(newPlayerEntity);

  socket.on("disconnect", () => {
    Helper_Functions.runThisUponSocketDisconnect(socket);
  })
  socket.on("movement", (receivedMovement) => {
    /*
    Presumably, someone spamming movement requests does not receive any advantages. So, this cooldown is implemented mainly for fun.
    The idea is we don't want the server to process too many movement requests from a client in a short time period, that would be pointless. Although neither does this cooldown really affect much, since all that happens if no cooldown is present is flipping control key bits to true... 
    */
    if (socket.isMovementRequestFunctionalityOnCooldown(socket)) {
      return;
    }
    socket.aMovementRequestHappenedJustNow(socket);
    const playerAssociatedWithSocket = World.state.entities.find(entity => entity.socketId === socket.id);

    const playerPossibleMovementDirections = Object.keys(playerAssociatedWithSocket.controls);
    playerPossibleMovementDirections.forEach(direction => {
      playerAssociatedWithSocket.controls[direction] = receivedMovement.includes(direction);
    });
  })
});
const port = 3000;
httpServer.listen(port);
console.log(`Started a server on port ${port}`);


// Start the loop
Game_Loop.theLoop();
