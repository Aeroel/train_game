import { Entity } from "./entity.js"

class Player extends Entity {
    type = "player";
    hp;
    keyboard;
    singleMovementDistance = 5;
    constructor({keyboard, x, y, width, height}) {
        super({x, y, width, height});
        this.keyboard = keyboard;
    }
    tick({timestamp, context}) {
        this.handleMovement();
        super.draw({context});
    }
    handleMovement() {
        if(this.keyboard.currentlyPressedKeys.includes("ArrowLeft")) {
            this.x -= this.singleMovementDistance;
        }
        if(this.keyboard.currentlyPressedKeys.includes("ArrowRight")) {
            this.x += this.singleMovementDistance;
        }
        if(this.keyboard.currentlyPressedKeys.includes("ArrowUp")) {
            this.y -= this.singleMovementDistance;
        }
        if(this.keyboard.currentlyPressedKeys.includes("ArrowDown")) {
            this.y += this.singleMovementDistance;
        }
    }
    
}

export {
    Player
}