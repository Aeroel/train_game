import { Entity } from "./entity.js"
import { move } from "./move.js";

class Player extends Entity {
    type = "player";
    hp;
    keyboard;
    singleMovementDistance = 10;
    constructor({ keyboard, x, y, width, height }) {
        super({ x, y, width, height });
        this.keyboard = keyboard;
    }
    tick({ timestamp, context }) {
        this.handleMovement();
        super.draw({ context });
    }
    draw({ context }) {
        const middleOfCanvasX = window.gameCanvasWidth / 2;
        const middleOfCanvasY = window.gameCanvasHeight / 2;
        context.fillRect(middleOfCanvasX, middleOfCanvasY, this.width, this.height);
        return;
    }
    handleMovement() {
        if (this.keyboard.currentlyPressedKeys.includes("ArrowLeft")) {
            move({ dir: "left", step: this.singleMovementDistance, player: this, entities: globalThis.gameEntities });
        }
        if (this.keyboard.currentlyPressedKeys.includes("ArrowRight")) {
            move({ dir: "right", step: this.singleMovementDistance, player: this, entities: globalThis.gameEntities });
        }
        if (this.keyboard.currentlyPressedKeys.includes("ArrowUp")) {
            move({ dir: "up", step: this.singleMovementDistance, player: this, entities: globalThis.gameEntities });
        }
        if (this.keyboard.currentlyPressedKeys.includes("ArrowDown")) {
            move({dir:"down", step:this.singleMovementDistance, player:this, entities:globalThis.gameEntities});
        }
    }

}

export {
    Player
}