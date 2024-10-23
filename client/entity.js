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
        this.frozenForTicks = 0;;
    }
    isFrozen() {
        return (this.frozenForTicks > 0);
    }
    freeze({amount}) {
        this.frozenForTicks = amount;
    }
    tick({timestamp}) {
        if(this.frozenForTicks > 0) {
            this.frozenForTicks--;
        }
    }
    draw({context}) {
        const canvasX = calculateCanvasCoordinate({ maxCanvasValue:window.gameCanvasWidth, realPlayerPosition: window.thePlayer.x, realObjectPosition: this.x });
        const canvasY = calculateCanvasCoordinate({ maxCanvasValue:window.gameCanvasHeight, realPlayerPosition: window.thePlayer.y, realObjectPosition: this.y });
        context.fillRect(canvasX, canvasY, this.width, this.height);
    }
}

export { Entity}