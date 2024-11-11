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
io.on("connection", async (socket) => {
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
    entity.y += 1
    entity.x += 1
  })

  io.emit("newWorldState", World.state)

  setTimeout(function () {
    loop();
  }, loopEveryMs);

}
loop()