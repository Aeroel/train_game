import { Entity } from "./Entity.js"
import { getPositionsPerTick } from "./entityMovementImplementation.js";

class MovingEntity extends Entity {
    velocityX = 0;
    velocityY = 0;
    speedX = 5;
    speedY = 5;
    slowDownFactorX = 1;
    slowDownFactorY = 1;
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
        this.velocityX = 0;
        this.velocityY = 0;
        return true;
    }
    isMoving() {
        return (this.velocityX !== 0 || this.velocityY !== 0);
    }
    flipMovementDirection() {
        this.velocityX *= -1;
        this.velocityY *= -1;
    }
    tick() {
        this.handleMovement();
        super.tick();
    }
    handleMovement() {
        if (!this.isMoving()) {
            return;
        }
        this.slowDownMovementSpeedToPercentOfOriginal();
    }
    slowDownMovementSpeedToPercentOfOriginal() {
        let currentSpeedX = Math.abs(this.velocityX);
        let currentSpeedY = Math.abs(this.velocityY);

        let currentDirectionX = Math.sign(this.velocityX);
        let currentDirectionY = Math.sign(this.velocityY);

        let slowedSpeedX = currentSpeedX * this.slowDownFactorX;
        let slowedSpeedY = currentSpeedY * this.slowDownFactorY;

        let futureVelocityX;
        let futureVelocityY;
        if (slowedSpeedX <= 0) {
            futureVelocityX = 0;
        } else {
            futureVelocityX = currentDirectionX * slowedSpeedX;
        }
        if (slowedSpeedY <= 0) {
            futureVelocityY = 0;
        } else {
            futureVelocityY = currentDirectionY * slowedSpeedY;
        }

        this.velocityX = futureVelocityX;
        this.velocityY = futureVelocityY;
    }
}

export {
    MovingEntity,
}