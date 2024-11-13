import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Player } from "./Player.js"
import { World } from "./World.js"
import { SocketStorage } from "./SocketStorage.js";

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
  SocketStorage.add(socket);
  socket.emit("welcome", "You have successfully connected to the server. Welcome!");
  const newPlayerEntity = new Player();
  newPlayerEntity.setX(0);
  newPlayerEntity.setY(0);
  newPlayerEntity.setWidth(50);
  newPlayerEntity.setHeight(40);
  newPlayerEntity.setVisionRange(200);
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
    
    const playerAssociatedWithSocket = World.state.entities.find((entity) => {
      return entity.socketId === socket.id
    })
    console.log(playerAssociatedWithSocket);
    
    if (movement.includes("right")) {
      playerAssociatedWithSocket.forces.right = 1;
    }
  })
});
const port = 3000;
httpServer.listen(port);
console.log(`Started a server on port ${port}`);

const virtualCanvasWidth = 1000;
const virtualCanvasHeight = 1000;

let currTimeMs = Date.now();
let lastTimeMs = currTimeMs;
let elapsedTimeMs = 0;
let timeToTick = false;
const tickEveryMs = 20;
const loopEveryMs = 20;
function isEntityVisible(playerCenterX, playerCenterY, playerVisionRange, entity) {
  const visibleX = Math.max(playerCenterX - playerVisionRange, entity.x)
  const visibleY = Math.max(playerCenterY - playerVisionRange, entity.y)
  const visibleWidth = Math.min(playerCenterX + playerVisionRange, entity.x + entity.width) - visibleX;
  const visibleHeight = Math.min(playerCenterY + playerVisionRange, entity.y + entity.height) - visibleY;
  return visibleWidth > 0 && visibleHeight > 0;
}
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

  const players = World.getCurrentEntities().filter(entity => entity.hasTag("Player"));
  players.forEach(player => {
    const playerSocket = SocketStorage.find(socket => socket.id === player.socketId);
    const visibleEntities = [];
    const playerCenterX = player.x + player.width / 2
    const playerCenterY = player.y + player.height / 2
    World.getCurrentEntities().forEach(entity => {
      if (!isEntityVisible(playerCenterX, playerCenterY, player.visionRange, entity)) {
        return;
      }
      const visibleX = Math.max(playerCenterX - player.visionRange, entity.x)
      const visibleY = Math.max(playerCenterY - player.visionRange, entity.y)
      const visibleWidth = Math.min(playerCenterX + player.visionRange, entity.x + entity.width) - visibleX;
      const visibleHeight = Math.min(playerCenterY + player.visionRange, entity.y + entity.height) - visibleY;

      visibleEntities.push({
        x: (visibleX - playerCenterX + player.visionRange) / virtualCanvasWidth,
        y: (visibleY - playerCenterY + player.visionRange) / virtualCanvasHeight,
        width: visibleWidth / virtualCanvasWidth,
        height: visibleHeight / virtualCanvasHeight,
        color: entity.color
      })
    });
    playerSocket.emit('newWorldState', {
      entities: visibleEntities, virtualCanvasHeight, virtualCanvasWidth
    });
  })
  World.getCurrentEntities().forEach(entity => {
    entity.x += entity.forces.right;
    entity.forces.right = 0;

  })

  setTimeout(function () {
    gameLoop();
  }, loopEveryMs);

}
gameLoop()