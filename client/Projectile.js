import { MovingEntity } from "./MovingEntity.js";

class Projectile extends MovingEntity {
    type = "projectile"
    constructor({x, y, width, height}) {
        super({ x, y, width, height });
    }

}

export {
    Projectile,
}