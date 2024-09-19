'use strict';

import { createServer } from "http";
import { Server } from "socket.io";
import { chooseRandomlyFromPossibilities } from "./utility_functions.js";
import { WorldsContainer, World, WorldDimensions } from "./classes.js";

const httpServer = createServer();

const options = {
    cors: {
        origin: "http://127.0.0.1:5500"
    }
};
const io = new Server(httpServer, options);

httpServer.listen(3000);
console.log("Started server");

io.on("connection", onConnection);

function onConnection(socket) {
    console.log("Socket connection established...");

    global.sockets.push(socket);

    socket.emit("testMessage", "hehe");
    socket.emit("mapSize", global.worldObject.dimensions.getAlternativeNamesSizes());

    const randomWorld = worldsContainer.giveMeARandomWorld();

    randomWorld.addObject({ type: "player", position:"random",  data: { socketId: socket.id, visionRange: 100, started: false } });
    socket.on("moveRequest", (moveReq) => {
        const player = objects.find(player => player.socketId === socket.id);
        player.move(moveReq);

    });
}


const worldsContainer = new WorldsContainer;

const worldDimensions = new WorldDimensions();
worldDimensions.addDimension({
    name: "x",
    alternativeName: "width",
    movementOperations: {
        subtraction: "left",
        addition: "right",
    },
    size: 1000
});
worldDimensions.addDimension({
    name: "y",
    alternativeName: "height",
    movementOperations: {
        subtraction: "up",
        addition: "down",
    },
    size: 1000
});

const world = new World(worldDimensions);
world.addObject({ type: "AI", position: "random", data: {color: "yellow" } });
world.addObject({ type: "AI", position: "random", data: {color: "black" } });
world.addObject({ type: "AI", position: "random", data: {color: "blue"} });
world.addObject({ type: "AI", position: "random", data: {color: "green"} });

worldsContainer.addWorld(world);

const howOftenLoopRunsInMs = 50;
setInterval(serverLoop, howOftenLoopRunsInMs);
function serverLoop() {
    worldsContainer.getAllWorlds().forEach((world, worldId) => {
        worldTick(world);
    });
}
function worldTick(world) {
    const AIObjects = world.getObjectsOfClass("AIObject");
    const playerObjects = world.getObjectsOfClass("PlayerObject");

    AIObjects.forEach(object => {
        const xDirection = chooseRandomlyFromPossibilities({ possibilities: ["left", "right"] });
        const yDirection = chooseRandomlyFromPossibilities({ possibilities: ["up", "down"] });
        object.move({ direction: xDirection });
        object.move({ direction: yDirection });

    });

    playerObjects.forEach(playerObject => {
        if (!playerObject.started) {
            playerObject.socket.emit("started", true);
            playerObject.started = true;
        }

        const minXToBeVisible = playerObject.x - playerObject.visionRange;
        const maxXToBeVisible = playerObject.x + playerObject.visionRange;

        const minYToBeVisible = playerObject.y - playerObject.visionRange;
        const maxYToBeVisible = playerObject.y + playerObject.visionRange;

        const visibleObjects = [];

        world.objects.forEach(object => {
            const objectIsVisible = (object.x >= minXToBeVisible && object.x <= maxXToBeVisible &&
                object.y >= minYToBeVisible && object.y <= maxYToBeVisible);
            if (objectIsVisible) {
                const dataToPush = { x: object.x, y: object.y, color: object.color, width: object.width, height: object.height };
                visibleObjects.push(dataToPush);
            }

        });

        const playerSocket = global.sockets.find(socket => playerObject.socketId = socket.id);
        playerSocket.emit("objects", visibleObjects);
    });

}
