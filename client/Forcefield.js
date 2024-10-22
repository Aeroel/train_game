import { MovingEntity } from "./MovingEntity.js";
import { rectIntersectsRect } from "./rectIntersectsRect.js";
import { calculateCanvasCoordinate } from "./calculateCanvasCoordinate.js";

class Forcefield extends MovingEntity {
    distanceBetween = 3;
    fieldSize = 17;
    type = "forcefield";
    player;
    constructor({ player }) {
        super({ x: 0, y: 0, width: 0, height: 0 });
        this.player = player;
        this.x = this.player.x - this.distanceBetween;
        this.y = this.player.y - this.distanceBetween;
        this.width = Math.ceil(this.player.width * (1 + 0.58));
        this.height = Math.ceil(this.player.height * (1 + 0.58));
    }
    tick({ timestamp, context }) {
        globalThis.gameEntities.forEach(entity => {
            if (!(entity.type === 'projectile')) {
                return;
            }
            if (!entity.isMoving()) {
                return;
            }

            if (this.isCollidingWithEntity({ entity })) {
                entity.flipMovementDirection();
            }

        }, this);
        super.tick({ timestamp, context });

    }
    handleMovement() {
        this.player.movingInDirections.forEach(direction => {
            this.addMovementDirection({ directionName: direction });
        }, this);
        if (this.player.movingInDirections.size === 0) {
            this.movingInDirections.clear();
        }
        super.handleMovement();
    }
    isCollidingWithEntity({ entity }) {
        let isColliding = false;
        entity.movingInDirections.forEach(entityDirection => {
            let endGoal = null;
            for (let subStep = 1; subStep < entity.singleMovementDistance; subStep++) {
                let mockEntityPosition = null;
                if (entityDirection === 'right') {
                    endGoal = entity.x + entity.singleMovementDistance;
                    mockEntityPosition = { x: entity.x + subStep, y: entity.y, width: entity.width, height: entity.height };
                } else if (entityDirection === 'left') {
                    endGoal = entity.x - entity.singleMovementDistance;
                    mockEntityPosition = { x: entity.x - subStep, y: entity.y, width: entity.width, height: entity.height };
                } else if (entityDirection === 'up') {
                    endGoal = entity.y - entity.singleMovementDistance;
                    mockEntityPosition = { x: entity.x, y: entity.y - subStep, width: entity.width, height: entity.height };
                } else if (entityDirection === 'down') {
                    endGoal = entity.y + entity.singleMovementDistance;
                    mockEntityPosition = { x: entity.x, y: entity.y + subStep, width: entity.width, height: entity.height };
                }
                if (rectIntersectsRect(mockEntityPosition, this)) {
                    isColliding = true;
                    return;
                }
            }
        }, this);

        if (!this.isMoving()) {
            return isColliding;
        }

        // if both are moving the check algo is different
        for (let subStep = 1; subStep < this.singleMovementDistance; subStep++) {
            let nextFieldX;
            let nextFieldY;
            if (this.movingInDirections.has("right")) {
                nextFieldX = this.x + subStep;
            }
            if (this.movingInDirections.has("left")) {
                nextFieldX = this.x - subStep;
            }
            if (this.movingInDirections.has("down")) {
                nextFieldY = this.y + subStep;
            }
            if (this.movingInDirections.has("up")) {
                nextFieldY = this.y - subStep;
            }
            let simulatedFieldObject = {x: nextFieldX, y: nextFieldY, height: this.height, width:this.width};
            for (let entitySubstep = 1; entitySubstep < entity.singleMovementDistance; entitySubstep++) {
                let nextEntityX;
                let nextEntityY;
                if (this.movingInDirections.has("right")) {
                    nextEntityX = entity.x + entitySubstep;
                }
                if (entity.movingInDirections.has("left")) {
                    nextEntityX = entity.x - entitySubstep;
                }
                if (entity.movingInDirections.has("down")) {
                    nextEntityY = entity.y + entitySubstep;
                }
                if (entity.movingInDirections.has("up")) {
                    nextEntityY = entity.y - entitySubstep;
                }
                let simulatedEntityObject = {x: nextEntityX, y: nextEntityY, height: entity.height, width:entity.width};
                if(rectIntersectsRect(simulatedEntityObject, simulatedFieldObject)) {
                    isColliding = true;
                }
            }

        }

        return isColliding;
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