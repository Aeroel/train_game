'use strict';

class World {
    canvas;
    canvasContext;

    objects = [];

    keyControlsObject;

    socket;

    mapSize;


    constructor() {
        this.canvas = document.getElementById("world");
        this.canvas.width = (window.innerWidth - 15);
        this.canvas.height = (window.innerHeight - 30);
        console.log(`cw: ${this.canvas.width}, ch: ${this.canvas.height}`)

        this.canvasContext = this.canvas.getContext('2d');


    }
    setKeyControlsObject(keyControlsObject) {
        this.keyControlsObject = keyControlsObject;
    }
    setSocket(socket) {
        this.socket = socket;
    }


    handleMovementRequest() {
        const ac = this.keyControlsObject.activeControls;

        if (ac.length === 0) {
            return;
        }

        if (ac.includes("ArrowUp")) {
            this.moveRequest({ direction: "up" });
        }
        if (ac.includes("ArrowDown")) {
            this.moveRequest({ direction: "down" });
        }
        if (ac.includes("ArrowLeft")) {
            this.moveRequest({ direction: "left" });
        }
        if (ac.includes("ArrowRight")) {
            this.moveRequest({ direction: "right" });
        }
    }

    motion(timeStamp) {
        this.handleMovementRequest();
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.canvasContext.fillStyle = 'black';

        // Calculate scaling factor
        const scaleX = this.canvas.width / this.mapSize.width;
        const scaleY = this.canvas.height / this.mapSize.height;

        this.objects.forEach(object => {

            const scaledObjectX = object.x * scaleX;
            const scaledObjectY = object.y * scaleX;
            const scaledObjectWidth = object.width * scaleY;
            const scaledObjectHeight = object.height * scaleY;

            this.canvasContext.fillStyle = object.color;
            this.canvasContext.fillRect(scaledObjectX, scaledObjectY, scaledObjectWidth, scaledObjectHeight);
        }, this);

        requestAnimationFrame((timeStamp) => this.motion(timeStamp));
    }
    start() {
        console.log("world start")
        this.motion(0);
    }

    receiveObjects(objectsToReceive) {
        this.objects = objectsToReceive;
    }
    receiveMapSize(mapSize) {
        this.mapSize = mapSize;
    }
    moveRequest({ direction }) {
        this.socket.emit("moveRequest", { direction });
    }

}

export {
    World,
}