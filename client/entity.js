import { calculateCanvasCoordinate } from "./calculateCanvasCoordinate.js";
export { Entity}


class Entity {
    x;
    y;
    width;
    height;
    type;
    constructor({x, y, width, height}) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
    tick() {

    }
    draw() {
        const canvasX = calculateCanvasCoordinate({ maxCanvasValue:window.gameCanvasWidth, realPlayerPosition: window.thePlayer.x, realObjectPosition: this.x });
        const canvasY = calculateCanvasCoordinate({ maxCanvasValue:window.gameCanvasHeight, realPlayerPosition: window.thePlayer.y, realObjectPosition: this.y });
        globalThis.context.fillRect(canvasX, canvasY, this.width, this.height);
    }
}
