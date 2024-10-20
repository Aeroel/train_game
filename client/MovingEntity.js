import { Entity } from "./Entity.js"
import { move } from "./entityMovementCode.js";

class MovingEntity extends Entity {
    movingInDirections = new Set();
    singleMovementDistance = 5;
    constructor({x, y, width, height}){
        super({ x, y, width, height });
    }
    addMovementDirection({directionName}) {
        this.movingInDirections.add(directionName);
    }
    removeMovementDirection({directionName}) {
        this.movingInDirections.delete(directionName);
    }
    tick({ timestamp, context }) {
        this.handleMovement();
        super.tick({ context });
    }
    handleMovement() {
        if (this.movingInDirections.has("left")) {
            move({ dir: "left", step: this.singleMovementDistance, player: this, entities: globalThis.gameEntities });
        }
        if (this.movingInDirections.has("right")) {
            move({ dir: "right", step: this.singleMovementDistance, player: this, entities: globalThis.gameEntities });
        }
        if (this.movingInDirections.has("down")) {
            move({ dir: "down", step: this.singleMovementDistance, player: this, entities: globalThis.gameEntities });
        }
        if (this.movingInDirections.has("up")) {
            move({dir:"up", step:this.singleMovementDistance, player:this, entities:globalThis.gameEntities});
        }
    }
}

export {
    MovingEntity,
}