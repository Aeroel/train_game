import { Entity } from "./Entity.js";
export { Movable_Entity}
class Movable_Entity extends Entity {
    forces = {
      "up": 0,
      "down": 0,
      "left": 0,
      "right": 0,
    };
    constructor() {
        super();
        this.addTag("Movable_Entity");
    }
}