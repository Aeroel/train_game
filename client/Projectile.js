import { MovingEntity } from "./MovingEntity.js";

class Projectile extends MovingEntity {
    tags = ["Entity", "MovingEntity", "Projectile"];
    constructor({x, y, width, height}) {
        super({ x, y, width, height });
    }
}

export {
    Projectile,
}