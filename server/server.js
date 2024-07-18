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

io.on("connection", onConnection);

function onConnection(socket) {
    console.log("Socket connection established...");
    socket.emit("testMessage", "hehe");
    observers.push({
        socket,
        x: 400,
        y: 400,
        visionRange: 100,

    });
    socket.on("moveRequest", (moveReq) => {
        const observer = observers.find(obs => obs.socket === socket);


    });
}

httpServer.listen(3000);
console.log("Started server");

const observers = [];
const MAP_WIDTH = 50000;
const MAP_HEIGHT = 50000;


class Shared {
    x;
    y;

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
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.y < 0) {
            this.y = 0;
        }

        if (this.y > MAP_HEIGHT) {
            this.y = MAP_HEIGHT;
        }
        if (this.x > MAP_WIDTH) {
            this.x = MAP_WIDTH;
        }
    }

}

class Observer extends Shared {
    visionRange;
    socket;
    constructor({x, y, visionRange, socket}) {
        super();
        this.visionRange = visionRange;
        this.socket = socket;
        this.x = x;
        this.y = y;
    }
}
class Object extends Shared {
    constructor({ x, y, width, height, color }) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.distancePerMove = 5;
    }

}
const objects = [];
objects.push(new Object(
    { x: 0, y: 0, width: 10, height: 10, color: 'red' }
));
objects.push(new Object(
    { x: 100, y: 100, width: 10, height: 10, color: 'black' }
));
objects.push(new Object(
    { x: 400, y: 400, width: 10, height: 10, color: 'blue' }
));
objects.push(new Object(
    { x: 500, y: 500, width: 10, height: 10, color: 'green' }
));

setInterval(gameLoop, 50);
function gameLoop() {
    objects.forEach(object => {
        const xDirection = utiliy_functions.chooseRandomlyFromPossibilities({ possibilities: ["left", "right"] });
        const yDirection = utiliy_functions.chooseRandomlyFromPossibilities({ possibilities: ["up", "down"] });
        object.move({ axis: "x", direction: xDirection });
        object.move({ axis: "y", direction: yDirection });

    });

    observers.forEach(observer => {

        const minXToBeVisible = observer.x - observer.visionRange;
        const maxXToBeVisible = observer.x + observer.visionRange;

        const minYToBeVisible = observer.y - observer.visionRange;
        const maxYToBeVisible = observer.y + observer.visionRange;

        const visibleObjects = [];

        objects.forEach(object => {
            const objectIsVisible = (object.x >= minXToBeVisible && object.x <= maxXToBeVisible &&
                object.y >= minYToBeVisible && object.y <= maxYToBeVisible);
            if (objectIsVisible) {
                visibleObjects.push(object);
            }

        });
        console.log(visibleObjects)
        observer.socket.emit("objects", visibleObjects);
    });

}
