import { MovingEntity } from "./MovingEntity.js"

class Player extends MovingEntity {
    canvasX;
    canvasY;
    type = "player";
    keyboard;
    singleMovementDistance = 5;
    constructor({ keyboard, x, y, width, height }) {
        super({ x, y, width, height });
        this.keyboard = keyboard;
    }
    tick({ timestamp }) {
        this.updatePlayerCanvasPosition();
        super.tick({ });
    }
    updatePlayerCanvasPosition() {
        this.canvasX = window.gameCanvasWidth / 2;
        this.canvasY = window.gameCanvasHeight / 2;
    }
    draw({ context }) {
        
        context.fillRect(this.canvasX, this.canvasY, this.width, this.height);
        return;
    }
    adjustMovementDirectionBasedOnKeyboardState() {
        if (this.keyboard.currentlyPressedKeys.includes("ArrowLeft")) {
           this.addMovementDirection({directionName: "left"})
        } else {
            this.removeMovementDirection({directionName: "left"})
        }

        if (this.keyboard.currentlyPressedKeys.includes("ArrowRight")) {
            this.addMovementDirection({directionName: "right"})
         } else {
             this.removeMovementDirection({directionName: "right"})
         }

         if (this.keyboard.currentlyPressedKeys.includes("ArrowDown")) {
            this.addMovementDirection({directionName: "down"})
         } else {
             this.removeMovementDirection({directionName: "down"})
         }

         if (this.keyboard.currentlyPressedKeys.includes("ArrowUp")) {
            this.addMovementDirection({directionName: "up"})
         } else {
             this.removeMovementDirection({directionName: "up"})
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