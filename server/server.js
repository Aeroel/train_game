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
io.on("connection", (socket) => {
  console.log("A socket connected");
  socket.emit("welcome", "You have successfully connected to the server. Welcome!");
  const newPlayerEntity = new Player();
  newPlayerEntity.setX(0);
  newPlayerEntity.setY(0);
  newPlayerEntity.setWidth(50);
  newPlayerEntity.setHeight(40);
  newPlayerEntity.setColor(`black`);
  newPlayerEntity.setVisionRange(200);
  newPlayerEntity.setAssociatedSocketConnectionId(socket.id);
  World.addEntity(newPlayerEntity);


  socket.on("movement", (movement) => {
    const playerAssociatedWithSocket = World.state.entities.find((entity) => {
      return entity.socketConnectionId === socket.id
    })
    if (movement.includes("right")) {
      playerAssociatedWithSocket.forces.right = 1;
    }
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
function loop() {
  currTimeMs = Date.now();
  elapsedTimeMs += (currTimeMs - lastTimeMs);
  lastTimeMs = currTimeMs;
  timeToTick = (elapsedTimeMs >= tickEveryMs)
  if (!timeToTick) {
    setTimeout(function () {
      loop();
    }, loopEveryMs);
    return;
  }
  elapsedTimeMs = 0;
  World.state.entities.forEach(entity => {
    entity.x += entity.forces.right;
    entity.forces.right = 0;

  })

  io.emit("newWorldState", World.state)

  setTimeout(function () {
    loop();
  }, loopEveryMs);

}
loop()