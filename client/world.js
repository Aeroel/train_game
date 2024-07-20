'use strict';

class World {
    canvas;
    canvasContext;

    objects = [];

    keyControlsObject;

    socket;

    player = {};

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
        const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio


        const scaledPlayerX = this.player.x * scale;
        const scaledPlayerY = this.player.y * scale;
        const scaledPlayerWidth = this.player.width * scale;
        const scaledPlayerHeight = this.player.height * scale;
        this.canvasContext.fillRect(scaledPlayerX, scaledPlayerY, scaledPlayerWidth, scaledPlayerHeight);

        this.objects.forEach(object => {
            if(object.sameAsPlayer) {
                return;
            }
            const scaledObjectX = object.x * scale;
            const scaledObjectY = object.y * scale;
            const scaledObjectWidth = object.width * scale;
            const scaledObjectHeight = object.height * scale;
            console.log(object, scale);

            this.canvasContext.fillStyle = object.color;
            this.canvasContext.fillRect(scaledObjectX, scaledObjectY, scaledObjectWidth, scaledObjectHeight);
        }, this);

        requestAnimationFrame((timeStamp) => this.motion(timeStamp));
    }
    start() {
        this.motion(0);
    }

    receiveObjects(objectsToReceive) {
        this.objects = objectsToReceive;
        this.playerObject = objectsToReceive.find(object => (isPlayer in object));
    }
    receivePlayer(player) {
        this.player = player;
    }
    receiveMapSize(mapSize) {
        this.mapSize = mapSize;
    }
    moveRequest({ axis, direction }) {
        this.socket.emit("moveRequest", { axis, direction });
    }

}

export {
    World,
}