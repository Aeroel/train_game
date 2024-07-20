import { createServer } from "http";
import { Server } from "socket.io";
import utiliy_functions from "./utility_functions.js";
import {World, ObjectInWorld, Player, AI, World, WorldMovement, WorldPosition,} from "./classes.js";

const httpServer = createServer();

const options = {
    cors: {
        origin: "http://127.0.0.1:5500"
    }
};
const io = new Server(httpServer, options);

const worldObject = new World();
worldObject.dimensions.addDimension({name:"x", size:1000, additionalName: "width"});
worldObject.dimensions.addDimension({name:"y", size:1000, additionalName: "height",});

io.on("connection", onConnection);

function onConnection(socket) {
    console.log("Socket connection established...");
    socket.emit("testMessage", "hehe");
    socket.emit("mapDimensionsAndSizes", worldObject.dimensions.getDimensions());
    const position = new ObjectPosition({
        dimensions: worldObject.dimensions.getDimensionNames()
    });

    position.setCoordinate({name: "x", value: 400});
    position.setCoordinate({name: "y", value: 400});

    objects.push(new Player({
        socket,
        position,
        width: 10,
        height: 10,
        visionRange: 100,
        started: false,

    }));
    socket.on("moveRequest", (moveReq) => {
        const player = objects.find(player => player.socket === socket);
        player.move(moveReq);

    });
}

httpServer.listen(3000);
console.log("Started server");

objects.push(new AI(
    { x: 0, y: 0, width: 10, height: 10, color: 'red' }
));
objects.push(new AI(
    { x: 100, y: 100, width: 10, height: 10, color: 'black' }
));
objects.push(new AI(
    { x: 400, y: 400, width: 10, height: 10, color: 'blue' }
));
objects.push(new AI(
    { x: 500, y: 500, width: 10, height: 10, color: 'green' }
));

setInterval(gameLoop, 50);
function gameLoop() {
    const AIObjects = objects.filter(object => {
        return object instanceof AI;   
    });
    const playerObjects = objects.filter(object => {
        return object instanceof Player;   
    });

    AIObjects.forEach(object => {
        const xDirection = utiliy_functions.chooseRandomlyFromPossibilities({ possibilities: ["left", "right"] });
        const yDirection = utiliy_functions.chooseRandomlyFromPossibilities({ possibilities: ["up", "down"] });
        object.move({ axis: "x", direction: xDirection });
        object.move({ axis: "y", direction: yDirection });

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

        objects.forEach(object => {
            const objectIsVisible = (object.x >= minXToBeVisible && object.x <= maxXToBeVisible &&
                object.y >= minYToBeVisible && object.y <= maxYToBeVisible);
            if (objectIsVisible) {
                const temp = object.socket;
                delete object.socket;
                const clone = structuredClone(object);
                visibleObjects.push(clone);
                object.socket = temp;
            }

        });
        const playerObjectToSend = {};
        playerObjectToSend.x = playerObject.x;
        playerObjectToSend.y = playerObject.y;
        playerObjectToSend.color = playerObject.color;
        playerObjectToSend.width = playerObject.width;
        playerObjectToSend.height = playerObject.height;
        
        playerObject.socket.emit("player", playerObjectToSend);
        playerObject.socket.emit("objects", visibleObjects);
    });

}
