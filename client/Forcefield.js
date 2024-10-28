import { Entity } from "./Entity.js";
import { calculateCanvasCoordinate } from "./calculateCanvasCoordinate.js";
import { handleCollisionForForcefield } from "./entityCollisionImplementation.js";

class Forcefield extends Entity {
    distanceBetween = 3;
    type = "forcefield";
    entityThatGeneratesIt;
    constructor({ entityThatGeneratesIt }) {
        super({ x: 0, y: 0, width: 0, height: 0 });
        this.entityThatGeneratesIt = entityThatGeneratesIt;
        this.movingInDirections = this.entityThatGeneratesIt.movingInDirections;
        this.handlePosition();
        this.width = Math.ceil(this.entityThatGeneratesIt.width * (1 + 0.58));
        this.height = Math.ceil(this.entityThatGeneratesIt.height * (1 + 0.58));
    }
    tick(){
        this.handlePosition();
        handleCollisionForForcefield({forcefield: this, entities: globalThis.game.entities})
        super.tick();
    }
    handlePosition() {
        this.x = this.entityThatGeneratesIt.x - this.distanceBetween;
        this.y = this.entityThatGeneratesIt.y - this.distanceBetween;
    }
    draw() {
        const canvasX = calculateCanvasCoordinate({ maxCanvasValue: window.gameCanvasWidth, realPlayerPosition: window.thePlayer.x, realObjectPosition: this.x });
        const canvasY = calculateCanvasCoordinate({ maxCanvasValue: window.gameCanvasHeight, realPlayerPosition: window.thePlayer.y, realObjectPosition: this.y });
        globalThis.context.save();
        globalThis.context.strokeStyle = "blue";
        globalThis.context.strokeRect(canvasX, canvasY, this.width, this.height);
        globalThis.context.restore();
    }
}

export { Forcefield }