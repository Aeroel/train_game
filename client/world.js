'use strict';

class World {
    canvas;
    canvasContext;

    objects = [];

    observer = {
        canvasX: null,
        canvasY: null,
        serverX: null,
        serverY: null,
        offsetX: null,
        offsetY: null,
    };

    keyControls;

    constructor() {
        this.canvas = document.getElementById("world");
        this.canvas.width = (window.innerWidth - 15);
        this.canvas.height = (window.innerHeight - 30);

        this.observer.canvasX = this.canvas.width / 2;
        this.observer.canvasY = this.canvas.height / 2;

        this.canvasContext = this.canvas.getContext('2d');

    }
    objectServerPositionToCanvasPosition({ serverX, serverY }) {
        const x = serverX - this.observer.offsetX;
        const y = serverY - this.observer.offsetY;
        return { x, y };
    }
    motion(timeStamp) {
        if (window.keyControls.activeControls.length > 0) {
            const ac = window.keyControls.activeControls;
            if (ac.includes("ArrowUp")) {
                this.observerMoveRequest({ axis: "y", direction: "up" });
            }
            if (ac.includes("ArrowDown")) {
                this.observerMoveRequest({ axis: "y", direction: "down" });
            }
            if (ac.includes("ArrowLeft")) {
                this.observerMoveRequest({ axis: "x", direction: "left" });
            }
            if (ac.includes("ArrowRight")) {
                this.observerMoveRequest({ axis: "x", direction: "right" });
            }
        }
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.canvasContext.fillStyle = 'black';

        this.canvasContext.fillRect(this.observer.canvasX, this.observer.canvasY, 10, 10);

        this.objects.forEach(object => {
            this.canvasContext.fillStyle = object.color;
            const objectCanvasPosition = this.objectServerPositionToCanvasPosition({ serverX: object.x, serverY: object.y });
            this.canvasContext.fillRect(objectCanvasPosition.x, objectCanvasPosition.y, object.width, object.height);
        }, this);

        requestAnimationFrame((timeStamp) => this.motion(timeStamp));
    }
    start() {
        this.motion(0);
    }

    receiveObjects(objectsToReceive) {
        this.objects = objectsToReceive;
    }
    receiveObserverServerPosition(position) {
        this.observer.serverX = position.x;
        this.observer.serverY = position.y;

        this.observer.offsetX = this.observer.serverX - this.observer.canvasX;
        this.observer.offsetY = this.observer.serverY - this.observer.canvasY;
    }
    observerMoveRequest({ axis, direction }) {
        window.socket.emit("moveRequest", {axis, direction});
    }

}

export {
    World,
}