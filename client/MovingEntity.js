import { Entity } from "./Entity.js"
import { move } from "./entityMovementImplementation.js";

class MovingEntity extends Entity {
    movingInDirections = new Set();
    maxSpeed = 5;
    currentSpeed = 5;
    slowDownByPerTick = 0.1;
    constructor({x, y, width, height}){
        super({ x, y, width, height });
    }
    addMovementDirection({directionName}) {
        this.movingInDirections.add(directionName);
        const opposingDirection = MovingEntity.getOpposingDirection({directionName});
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
    setSpeed(speed) {
        this.currentSpeed = speed;
    }
    static getOpposingDirection({directionName}){
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
        if(this.movingInDirections.size > 0) {
            this.currentSpeed = this.currentSpeed - this.slowDownByPerTick;
            if(this.currentSpeed < 0) {
                this.movingInDirections.clear();
                this.currentSpeed = 0;
            }
        }
        if (this.movingInDirections.has("left")) {
            move({ direction: "left", stepDistance: this.currentSpeed, selfEntity: this, entities: globalThis.gameEntities });
        }
        if (this.movingInDirections.has("right")) {
            move({ direction: "right", stepDistance: this.currentSpeed, selfEntity: this, entities: globalThis.gameEntities });
        }
        if (this.movingInDirections.has("down")) {
            move({ direction: "down", stepDistance: this.currentSpeed, selfEntity: this, entities: globalThis.gameEntities });
        }
        if (this.movingInDirections.has("up")) {
            move({direction:"up", stepDistance:this.currentSpeed, selfEntity:this, entities:globalThis.gameEntities});
        }
    }
}

export {
    MovingEntity,
}