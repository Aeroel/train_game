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
            this.velocityX = this.speedX * -1;
        } else {
            this.velocityX = 0;
        }

        if (this.keyboard.currentlyPressedKeys.includes("ArrowRight")) {
            this.velocityX = this.speedX;
        } else {
            this.velocityX = 0;
        }

        if (this.keyboard.currentlyPressedKeys.includes("ArrowDown")) {
            this.velocityY = this.speedY;
        } else {
            this.velocityY = 0;
        }

        if (this.keyboard.currentlyPressedKeys.includes("ArrowUp")) {
            this.velocityY = this.speedY * -1;
        } else {
            this.velocityY = 0;
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