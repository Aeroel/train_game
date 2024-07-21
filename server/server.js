import { createServer } from "http";
import { Server } from "socket.io";
import { chooseRandomlyFromPossibilities } from "./utility_functions.js";
import {World, WorldDimensions } from "./classes.js";

const httpServer = createServer();

const options = {
    cors: {
        origin: "http://127.0.0.1:5500"
    }
};
const io = new Server(httpServer, options);
sockets = [];

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

io.on("connection", onConnection);

function onConnection(socket) {
    console.log("Socket connection established...");

    global.sockets.push(socket);
    
    socket.emit("testMessage", "hehe");
    socket.emit("mapSize", global.worldObject.dimensions.getAlternativeNamesSizes());

    world.addObject(new Player({
        socketId: socket.id,
        position,
        width: 10,
        height: 10,
        visionRange: 100,
        started: false,

    }));
    socket.on("moveRequest", (moveReq) => {
        const player = objects.find(player => player.socketId === socket.id);
        player.move(moveReq);

    });
}

httpServer.listen(3000);
console.log("Started server");

world.addObject(new AI(
    { x: 0, y: 0, width: 10, height: 10, color: 'red' }
));
world.addObject(new AI(
    { x: 100, y: 100, width: 10, height: 10, color: 'black' }
));
world.addObject(new AI(
    { x: 400, y: 400, width: 10, height: 10, color: 'blue' }
));
world.addObject(new AI(
    { x: 500, y: 500, width: 10, height: 10, color: 'green' }
));

setInterval(gameLoop, 50);
function gameLoop() {
    const AIObjects = world.getObjectsOfClass(AI);.filter(object => {
        return object instanceof AI;   
    });
    const playerObjects = world.objects.filter(object => {
        return object instanceof Player;   
    });

    AIObjects.forEach(object => {
        const xDirection = chooseRandomlyFromPossibilities({ possibilities: ["left", "right"] });
        const yDirection = chooseRandomlyFromPossibilities({ possibilities: ["up", "down"] });
        object.move({ direction: xDirection });
        object.move({ direction: yDirection });

    });

    playerObjects.forEach(playerObject => {
        if(!playerObject.started) {
            playerObject.socket.emit("started", true);
            playerObject.started = true;
            playerObject.sameAsPlayer = true;
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
                const dataToPush = {x: object.x, y: object.y, color: object.color, width: object.width, height: object.height};
                if(object === playerObject) {
                    dataToPush.isPlayer = true;
                }
                visibleObjects.push(dataToPush);
            }

        });
        
        const playerSocket = global.sockets.find(socket => playerObject.socketId = socket.id);
        playerSocket.emit("objects", visibleObjects);
    });

}
