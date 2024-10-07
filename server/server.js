'use strict';

import { createServer } from "http";
import { Server as SocketIO } from "socket.io";
import { chooseRandomlyFromPossibilities } from "./utility_functions.js";
import { AIObject, PlayerObject, World, WorldsContainer, } from "./classes.js";
import { log } from "console";

function getSocket(playerObject) {
return sockets.find(socket => playerObject.socketId = socket.id);
}

const sockets = [];

const worldsContainer = new WorldsContainer();

const options = {
    cors: {
        origin: "http://127.0.0.1:5500"
    }
};
const httpServer = createServer();
const io = new SocketIO(httpServer, options);
httpServer.listen(3000);
console.log("Started server");

io.on("connection", onConnection);

function onConnection(socket) {
    console.log("A socket has connected");
    let socketLastRequest = Date.now();
    const ignoreForMs = 200;
    sockets.push(socket);

    socket.emit("testMessage", "hehe");
    const randomWorld = worldsContainer.giveMeARandomWorld();
    socket.emit("mapSize", {width: randomWorld.width, height: randomWorld.height});


    const playerObject = new PlayerObject({ x: 100, y: 100, width: 10, height: 5, visionRange: 100, socketId: socket.id });
    randomWorld.addObject(playerObject);

    socket.on("disconnect", () => {
        console.log("socket disconnected");
        const player = randomWorld.objects.find(player => player.socketId === socket.id);
        randomWorld.removeObject(player);
        console.log(randomWorld.objects);
    })
    socket.on("startAcknowledged", () => {
        console.log("yep");
        const player = randomWorld.objects.find(player => player.socketId === socket.id);
        player.started = true;
        console.log(player);
    });
    socket.on("moveRequest", (moveReq) => {
        if(socketLastRequest + ignoreForMs > Date.now()) {
            return null;
        }
        const player = randomWorld.objects.find(player => player.socketId === socket.id);
        if(!player) {
            console.log(randomWorld.objects);
            
        }
        player.move(moveReq.direction);
        
    });
}



const world = new World({width: 1000, height: 1000});
worldsContainer.addWorld(world);

world.addObject(new AIObject({ x: 90, y: 90, width: 10, height: 10, visionRange: 10, color: "black" })
);
world.addObject(new AIObject({ x: 90, y: 90, width: 10, height: 10, visionRange: 10, color: "yellow" })
);
world.addObject(new AIObject({ x: 90, y: 90, width: 10, height: 10, visionRange: 10, color: "blue" })
);
world.addObject(new AIObject({ x: 90, y: 90, width: 10, height: 10, visionRange: 10, color: "pink" })
);

function server_loop() {
    worldsContainer.getAllWorlds().forEach((world, worldIdButNotUsed) => {
        world_tick(world);
    });
}
const how_often_server_loop_runs_in_ms = 50;
setInterval(server_loop, how_often_server_loop_runs_in_ms);

function world_tick(world) {

    
    const AIObjects = world.getObjectsOfClass("AIObject");
    const playerObjects = world.getObjectsOfClass("PlayerObject");

    AIObjects.forEach(object => {
        const xDirection = chooseRandomlyFromPossibilities({ possibilities: ["left", "right"] });
        const yDirection = chooseRandomlyFromPossibilities({ possibilities: ["up", "down"] });
        object.move( xDirection );
        object.move(yDirection);

    });

    playerObjects.forEach(playerObject => {
        console.log(playerObject);
        
        if (!playerObject.started) {
            const playerSocket = getSocket(playerObject);
            playerSocket.emit("started", true);
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

        const playerSocket = getSocket(playerObject);
        playerSocket.emit("objects", visibleObjects);
    });

}
