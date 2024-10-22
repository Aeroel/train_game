import { Entity } from "./Entity.js";
import { rectIntersectsRect } from "./rectIntersectsRect.js";

class Forcefield extends Entity {
    distanceBetween = 3;
    fieldSize = 17;
    type = "forcefield";
    player;
    canvasX;
    canvasY;
    constructor({ player }) {
        super({ x: 0, y: 0, width: 0, height: 0 });
        this.player = player;
        this.makeSureForcefieldIsFollowingPlayer();
    }
    makeSureForcefieldIsFollowingPlayer() {
        this.x = this.player.x - this.distanceBetween;
        this.y = this.player.y - this.distanceBetween;
        this.canvasX = this.player.canvasX - this.distanceBetween;
        this.canvasY = this.player.canvasY - this.distanceBetween;
        this.height = this.fieldSize;
        this.width = this.fieldSize;
    }
    tick({ timestamp, context }) {
        this.makeSureForcefieldIsFollowingPlayer();
        globalThis.gameEntities.forEach(entity => {
            if (!(entity.type === 'projectile')) {
                return;
            }
            if (!entity.isMoving()) {
                return;
            }

            if (this.isProjectileCollidingWithEntity({ entity })) {
                entity.flipMovementDirection();
            }
            
        }, this);
        this.draw({ context });

    }
    isProjectileCollidingWithEntity({ entity }) {
        let isColliding = false;
        entity.movingInDirections.forEach(direction => {
            for (let subStep = 1; subStep < entity.singleMovementDistance; subStep++) {
                let mockEntityPosition = null;
                if (direction === 'right') {
                    mockEntityPosition = { x: entity.x + subStep, y: entity.y, width: entity.width, height: entity.height };
                } else if (direction === 'left') {
                    mockEntityPosition = { x: entity.x - subStep, y: entity.y, width: entity.width, height: entity.height };
                } else if (direction === 'up') {
                    mockEntityPosition = { x: entity.x, y: entity.y - subStep, width: entity.width, height: entity.height };
                } else if (direction === 'down') {
                    mockEntityPosition = { x: entity.x, y: entity.y + subStep, width: entity.width, height: entity.height };
                }                
                if(rectIntersectsRect(mockEntityPosition, this)) {
                    isColliding = true;
                    return;
                }
            }
        }, this);

        return isColliding;
    }
    draw({ context }) {
        context.save();
        context.strokeStyle = "blue";
        context.strokeRect(this.canvasX, this.canvasY, this.width, this.height);
        context.restore();
    }
}

export { Forcefield }