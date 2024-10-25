import { Entity } from "./Entity.js"
import { move } from "./entityMovementImplementation.js";

class MovingEntity extends Entity {
    movingInDirections = new Set();
    singleMovementDistance = 5;
    constructor({x, y, width, height}){
        super({ x, y, width, height });
    }
    addMovementDirection({directionName}) {
        this.movingInDirections.add(directionName);
        const opposingDirection = this.getOpposingDirection({directionName});
        if(this.movingInDirections.has(opposingDirection)) {
            this.removeMovementDirection({directionName: opposingDirection});
        }
    }
    ceaseMovement() {
        if(!this.isMoving()) {
            return false;
        }
        this.movingInDirections.clear();
        return true;
    }
    isMoving() {
        return (this.movingInDirections.size > 0);
    }
    getOpposingDirection({directionName}){
        const relationships = {right: "left", left: "right", down: "up", up: "down"};
        return relationships[directionName];
    }
    removeMovementDirection({directionName}) {
        this.movingInDirections.delete(directionName);
    }
    tick({ timestamp }) {
        this.handleMovement();
        super.tick({ timestamp });
    }
    handleMovement() {
        if (this.movingInDirections.has("left")) {
            move({ dir: "left", step: this.singleMovementDistance, selfEntity: this, entities: globalThis.gameEntities });
        }
        if (this.movingInDirections.has("right")) {
            move({ dir: "right", step: this.singleMovementDistance, selfEntity: this, entities: globalThis.gameEntities });
        }
        if (this.movingInDirections.has("down")) {
            move({ dir: "down", step: this.singleMovementDistance, selfEntity: this, entities: globalThis.gameEntities });
        }
        if (this.movingInDirections.has("up")) {
            move({dir:"up", step:this.singleMovementDistance, selfEntity:this, entities:globalThis.gameEntities});
        }
    }
}

export {
    MovingEntity,
}