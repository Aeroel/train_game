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

                this.movingInDirections.forEach(direction => {
                    for (let subStep = 1; subStep < this.singleMovementDistance; subStep++) {
                        let mockPosition = null;
                        if (direction === 'right') {
                            mockPosition = { x: this.x + subStep, y: this.y, width: this.width, height: this.height };
                        } else if (direction === 'left') {
                            mockPosition = { x: this.x - subStep, y: this.y, width: this.width, height: this.height };
                        } else if (direction === 'up') {
                            mockPosition = { x: this.x, y: this.y - subStep, width: this.width, height: this.height };
                        } else if (direction === 'down') {
                            mockPosition = { x: this.x, y: this.y + subStep, width: this.width, height: this.height };
                        }
                        if (rectIntersectsRect(mockPosition, mockEntityPosition)) {
                            isColliding = true;
                            return;
                        }
                    }
                }, this);
            }
        }, this);


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