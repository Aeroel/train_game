import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Player } from "./Player.js"
import { Ground } from "./Ground.js"
import { World } from "./World.js";
import { SocketStorage } from "./SocketStorage.js";
import { Movable_Entity } from "./Movable_Entity.js";
import { EmitStuff } from "./EmitStuff.js"
import { Settings } from './Settings.js';
import { SocketDataStorage } from "./SocketDataStorage.js";
import { EntitySorter } from "./EntitySorter.js"
import { log } from "console";

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
  SocketDataStorage.addSocketDataSlot(socket.id);
  const currTimeMs = Date.now()
  SocketDataStorage.set(socket.id, "lastMovementRequestTimeMs", currTimeMs);
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
    SocketDataStorage.removeSocketDataSlot(socket.id);
    const playerAssociatedWithSocket = World.state.entities.find((entity) => {
      return entity.socketId === socket.id
    })
    const index = World.state.entities.indexOf(playerAssociatedWithSocket);
    World.state.entities.splice(index, 1);
  })
  socket.on("movement", (movement) => {
    const currTimeMs = Date.now()
    const lastMovementRequestTimeMs = SocketDataStorage.get(socket.id, "lastMovementRequestTimeMs");
    const howMuchTimePassedMs = (currTimeMs - lastMovementRequestTimeMs);
    const movementRequestFunctionalityIsOnCooldown = Boolean(
      howMuchTimePassedMs < Settings.movementRequestCooldownDurationMs
    );
    /*
    Presumably, someone spamming movement requests does not receive any advantages. So, this cooldown is implemented mainly for fun.
    The idea is we don't want the server to process too many movement requests from a client in a short time period, that would be pointless. Although neither does this cooldown really affect much, since all that happens if no cooldown is present is flipping control key bits to true... 
    */
    if (movementRequestFunctionalityIsOnCooldown) {

      return;
    }
    SocketDataStorage.set(socket.id, "lastMovementRequestTimeMs", currTimeMs);
    const playerAssociatedWithSocket = World.state.entities.find((entity) => {
      return entity.socketId === socket.id
    });

    Object.keys(playerAssociatedWithSocket.controls).forEach(direction => {
      playerAssociatedWithSocket.controls[direction] = movement.includes(direction);
    });
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
    if (!entity.hasTag("Player")) {
      return;
    }

    entity.x += Number(entity.controls.right);
    //entity.controls.right = 0;
    entity.x -= Number(entity.controls.left);
    //entity.controls.left = 0;
    entity.y += Number(entity.controls.down);
   // entity.controls.down = 0;
    entity.y -= Number(entity.controls.up);
   // entity.controls.up = 0;

  })

  setTimeout(function () {
    gameLoop();
  }, loopEveryMs);

}
gameLoop()