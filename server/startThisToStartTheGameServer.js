import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Player } from "./Player.js"
import { Ground } from "./Ground.js"
import { World } from "./World.js";
import { SocketStorage } from "./SocketStorage.js";
import { Movable_Entity } from "./Movable_Entity.js";
import { EmitStuff } from "./EmitStuff.js"
import { SocketDataStorage } from "./SocketDataStorage.js";
import { EntitySorter } from "./EntitySorter.js"
import { Helper_Functions } from "./Helper_Functions.js";
import { Rail } from "./train_stuff/Rail.js";

const app = express();
const httpServer = createServer(app);

const allowAnyOrigin = true;
const options = {
  cors: {
    origin:
      allowAnyOrigin
  }
}

Helper_Functions.spawnSomeEntities();

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


const tickRate = 50; // Updates per second
const msPerTick = 1000 / tickRate; // Duration of each update in milliseconds
let lastUpdateTime = Date.now();
let lag = 0;

function gameLoop() {
  const currentTime = Date.now();
  const elapsed = currentTime - lastUpdateTime;
  lastUpdateTime = currentTime;

  lag += elapsed;

  // Process game logic in fixed-size steps
  while (lag >= msPerTick) {
    updateGameState(msPerTick / 1000); // Convert to seconds
    lag -= msPerTick;
  }

  // Schedule the next iteration
  setImmediate(gameLoop); // More precise than setTimeout in Node.js
}

function updateGameState(deltaTime) {
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
}

// Start the loop
gameLoop();
