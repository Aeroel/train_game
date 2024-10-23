import { Entity } from "./Entity.js";
import { calculateCanvasCoordinate } from "./calculateCanvasCoordinate.js";

class Forcefield extends Entity {
    distanceBetween = 3;
    type = "forcefield";
    player;
    constructor({ player }) {
        super({ x: 0, y: 0, width: 0, height: 0 });
        this.player = player;
        this.handlePosition();
        this.width = Math.ceil(this.player.width * (1 + 0.58));
        this.height = Math.ceil(this.player.height * (1 + 0.58));
    }
    tick({timestamp,}){
        this.handlePosition();
        super.tick({timestamp,});
    }
    handlePosition() {
        this.x = this.player.x - this.distanceBetween;
        this.y = this.player.y - this.distanceBetween;
    }
    draw({ context }) {
        const canvasX = calculateCanvasCoordinate({ maxCanvasValue: window.gameCanvasWidth, realPlayerPosition: window.thePlayer.x, realObjectPosition: this.x });
        const canvasY = calculateCanvasCoordinate({ maxCanvasValue: window.gameCanvasHeight, realPlayerPosition: window.thePlayer.y, realObjectPosition: this.y });
        context.save();
        context.strokeStyle = "blue";
        context.strokeRect(canvasX, canvasY, this.width, this.height);
        context.restore();
    }
}

export { Forcefield }