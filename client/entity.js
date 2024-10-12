import { calculateCanvasCoordinate } from "./calculateCanvasCoordinate.js";

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
    tick({timestamp, context}) {
        this.draw({context});
    }
    draw({context}) {
        const canvasX = calculateCanvasCoordinate({ maxCanvasValue:window.gameCanvasWidth, realPlayerPosition: window.thePlayer.x, realObjectPosition: this.x });
        const canvasY = calculateCanvasCoordinate({ maxCanvasValue:window.gameCanvasHeight, realPlayerPosition: window.thePlayer.y, realObjectPosition: this.y });
        context.fillRect(canvasX, canvasY, this.width, this.height);
    }
}

export { Entity}