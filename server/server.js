import { createServer } from "http";
import { Server } from "socket.io";
import utiliy_functions from "./utility_functions.js";

const httpServer = createServer();

const options = {
    cors: {
        origin: "http://127.0.0.1:5500"
    }
};
const io = new Server(httpServer, options);
const objects = [];

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 1000;

io.on("connection", onConnection);

function onConnection(socket) {
    console.log("Socket connection established...");
    socket.emit("testMessage", "hehe");
    socket.emit("mapSize", {width: MAP_WIDTH, height: MAP_HEIGHT});
    objects.push(new Player({
        socket,
        x: 400,
        y: 400,
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


class Object {
    x;
    y;
    color;
    width;
    height;
    constructor({x, y, color, width, height}) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
        this.height = height;
    }

    move({ axis, direction }) {
        let axisAddition = null;
        let axisSubtraction = null;

        switch (axis) {
            case 'x':
                axisAddition = 'right';
                axisSubtraction = 'left';
                break;

            case 'y':
                axisAddition = 'down';
                axisSubtraction = 'up';
                break;

            default:
                throw new Error(`Incorrect axis ${axis}`);
                break;
        }

        if (direction === axisAddition) {
            this[axis] += this.distancePerMove;
        } else if (direction === axisSubtraction) {
            this[axis] -= this.distancePerMove;
        }

        this.fixIfPositionGotOutOfMapBounds();
    }
    fixIfPositionGotOutOfMapBounds() {
        if (this.x <= 0) {
            this.x = 0;
        }
        if (this.y <= 0) {
            this.y = 0;
        }

        if (this.y >= MAP_HEIGHT) {
            this.y = MAP_HEIGHT;
        }
        if (this.x >= MAP_WIDTH) {
            this.x = MAP_WIDTH;
        }
    }

}

class Player extends Object {
    visionRange;
    socket;
    distancePerMove = 2;
    started;
    constructor({x, y, width, height, visionRange, socket}) {
        super({x, y, width, height, color:"black"});
        this.visionRange = visionRange;
        this.socket = socket;
    }
}

class AI extends Object {
    distancePerMove = 5;
    constructor({ x, y, width, height, color }) {
        super({x, y, width, height, color});

    }

}

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
