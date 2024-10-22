import { MovingEntity } from "./MovingEntity.js";

class Projectile extends MovingEntity {
    type = "projectile"
    constructor({x, y, width, height}) {
        super({ x, y, width, height });
    }
    flipMovementDirection() {
        if(this.movingInDirections.has("left")) {
            this.movingInDirections.delete("left");
            this.movingInDirections.add("right");
            return;
        }
        if(this.movingInDirections.has("right")) {
            this.movingInDirections.delete("right");
            this.movingInDirections.add("left");
        }
        if(this.movingInDirections.has("up")) {
            this.movingInDirections.delete("up");
            this.movingInDirections.add("down");
            return;
        }
        if(this.movingInDirections.has("down")) {
            this.movingInDirections.delete("down");
            this.movingInDirections.add("up");
        }
    }
}

export {
    Projectile,
}