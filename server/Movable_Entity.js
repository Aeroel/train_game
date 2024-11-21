import { Entity } from "./Entity.js";
import { Game_Loop } from "./Game_Loop.js";
export { Movable_Entity}
class Movable_Entity extends Entity {
    forces = {
      "up": 0,
      "down": 0,
      "left": 0,
      "right": 0,
    };
    speedX = 100;
    speedY = 100;
    constructor() {
        super();
        this.addTag("Movable_Entity");
    }
    update() {
      const netHorizontalForce = this.forces.right - this.forces.left;
      const netVerticalForce = this.forces.down - this.forces.up;

      this.x += netHorizontalForce * (this.speedX * Game_Loop.deltaTime)
      this.y += netVerticalForce * (this.speedY * Game_Loop.deltaTime)

      this.forces.right = 0;
      this.forces.left = 0;
      this.forces.down = 0;
      this.forces.up = 0;
    }
}