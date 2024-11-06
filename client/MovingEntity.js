import { Entity } from "./Entity.js"
import { getPositionsPerTick } from "./entityMovementImplementation.js";

class MovingEntity extends Entity {
    directionX = 0;
    directionY = 0;
    speedX = 0.025;
    speedY = 0.025;
    tags = ["Entity", "MovingEntity"];
    constructor({ x, y, width, height }) {
        super({ x, y, width, height });
    }
    getPositionsPerTick() {
       return getPositionsPerTick(this);
    }
    ceaseMovement() {
        if (!this.isMoving()) {
            return false;
        }
        this.directionX = 0;
        this.directionY = 0;
        return true;
    }
    isMoving() {
        const isMovingOnXAxis = !this.directionX === 0 && !this.speedX === 0;
        const isMovingOnYAxis = !this.directionY === 0 && !this.speedY === 0;
        const isMovingAtAll = isMovingOnXAxis || isMovingOnYAxis;
        return isMovingAtAll;
    }
    flipMovementDirection() {
        this.directionX *= -1;
        this.directionY *= -1;
    }
    tick() {
        this.handleMovement();
        super.tick();
    }
    handleMovement() {
        if (!this.isMoving()) {
            return;
        }
    }

}

export {
    MovingEntity,
}