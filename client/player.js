import { MovingEntity } from "./MovingEntity.js"

class Player extends MovingEntity {
    canvasX;
    canvasY;
    tags = ["Entity", "MovingEntity", "Player",];
    keyboard;
    constructor({ keyboard, x, y, width, height }) {
        super({ x, y, width, height });
        this.keyboard = keyboard;
    }
    tick() {
        this.updatePlayerCanvasPosition();
        super.tick();
    }
    updatePlayerCanvasPosition() {
        this.canvasX = window.gameCanvasWidth / 2;
        this.canvasY = window.gameCanvasHeight / 2;
    }
    draw() {

        globalThis.context.fillRect(this.canvasX, this.canvasY, this.width, this.height);
        return;
    }
    adjustMovementDirectionBasedOnKeyboardState() {
        if (this.keyboard.currentlyPressedKeys.includes("ArrowLeft")) {
            this.directionX = -1;
        } else if (this.keyboard.currentlyPressedKeys.includes("ArrowRight")) {
            this.directionX = 1;
        } else {
            this.directionX = 0;
        }

        if (this.keyboard.currentlyPressedKeys.includes("ArrowUp")) {
            this.directionY = -1;
        } else if (this.keyboard.currentlyPressedKeys.includes("ArrowDown")) {
            this.directionY = 1;
        } else {
            this.directionY = 0;
        }

    }
    handleMovement() {
        this.adjustMovementDirectionBasedOnKeyboardState();
        super.handleMovement();
    }

}

export {
    Player
}