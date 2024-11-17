import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Player } from "./Player.js"
import { Ground } from "./Ground.js"
import { World } from "./World.js";
import { SocketStorage } from "./SocketStorage.js";
import { Movable_Entity } from "./Movable_Entity.js";
import { EmitStuff } from "./EmitStuff.js"

const app = express();
const httpServer = createServer(app);

const allowAnyOrigin = true;
const options = {
  cors: {
    origin:
      allowAnyOrigin
  }
}
const newEntity = new Movable_Entity();
newEntity.setX(0);
newEntity.setY(0);
newEntity.setWidth(50);
newEntity.setHeight(40);
World.addEntity(newEntity);
const ground = new Ground();
ground.setX(0);
ground.setY(0);
ground.setWidth(10000);
ground.setHeight(10000);
World.addEntity(ground);
const io = new Server(httpServer, options);
io.on("connection", (socket) => {
  console.log("A socket connected");
  SocketStorage.add(socket);
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
    SocketStorage.remove(socket);
    const playerAssociatedWithSocket = World.state.entities.find((entity) => {
      return entity.socketId === socket.id
    })
    const index = World.state.entities.indexOf(playerAssociatedWithSocket);
    World.state.entities.splice(index, 1);
  })
  socket.on("movement", (movement) => {
    const movementRequestFunctionalityIsOnCooldown = Boolean((Date.now() - socketData.find(socket => socket.id ).lastMovementRequestTime) > movementRequestCooldownTime);
    /*
    Presumably, someone spamming movement requests does not receive any advantages. So, this cooldown is implemented mainly for fun.
    The idea is we don't want the server to process too many movement requests from a client in a short time period, that would be pointless. Although neither does this cooldown really affect much, since all that happens if no cooldown is present is flipping control key bits to true... 
    */
    if(movementRequestFunctionalityIsOnCooldown) {
      return;
    }
    const playerAssociatedWithSocket = World.state.entities.find((entity) => {
      return entity.socketId === socket.id
    })
    
      playerAssociatedWithSocket.controls.right = movement.includes("right");
      playerAssociatedWithSocket.controls.left = movement.includes("left");
      playerAssociatedWithSocket.controls.up = movement.includes("up");
      playerAssociatedWithSocket.controls.down = movement.includes("down");
  })
});
const port = 3000;
httpServer.listen(port);
console.log(`Started a server on port ${port}`);


let currTimeMs = Date.now();
let lastTimeMs = currTimeMs;
let elapsedTimeMs = 0;
let timeToTick = false;
const tickEveryMs = 20;
const loopEveryMs = 20;
function gameLoop() {
  currTimeMs = Date.now();
  elapsedTimeMs += (currTimeMs - lastTimeMs);
  lastTimeMs = currTimeMs;
  timeToTick = (elapsedTimeMs >= tickEveryMs)
  if (!timeToTick) {
    setTimeout(gameLoop);
    return;
  }
  elapsedTimeMs = 0;
EntitySorter.sortAllEntitiesInOrderOfAppearanceForTheTopDownCamera();
EmitStuff.emitToAllPlayersWorldStateStuff()
  World.getCurrentEntities().forEach(entity => {
    if(!entity.hasTag("Movable_Entity")) {
      return;
    }
    entity.x += entity.forces.right;
    entity.forces.right = 0;
    entity.x -= entity.forces.left;
    entity.forces.left = 0;
    entity.y += entity.forces.down;
    entity.forces.down = 0;
    entity.y -= entity.forces.up;
    entity.forces.up =0;

  })

  setTimeout(function () {
    gameLoop();
  }, loopEveryMs);

}
gameLoop()