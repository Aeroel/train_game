import { Entity } from "./Entity.js";
export { Mobile_Entity}
class Mobile_Entity extends Entity {
    velocityX;
    velocityY;
    speedX;
    speedY;
    constructor({x, y, width, height}) {
        super({x, y, width, height});
    }
}