import { Entity } from "./Entity.js";
import { Game_Loop } from "./Game_Loop.js";
export { Movable_Entity }
class Movable_Entity extends Entity {
  forces = {
    "up": 0,
    "down": 0,
    "left": 0,
    "right": 0,
  };
  speedX = 100;
  speedY = 100;
  friction = 0.5;
  constructor() {
    super();
    this.addTag("Movable_Entity");
  }
  updateState() {
    const netHorizontalForce = this.forces.right - this.forces.left;
    const netVerticalForce = this.forces.down - this.forces.up;

    this.x += (netHorizontalForce * Game_Loop.deltaTime)
    this.y += (netVerticalForce * Game_Loop.deltaTime)

    Object.keys(this.forces).forEach(forceName => {

      this.forces[forceName] *= this.friction;
    });
    this.ifAnyForceGetsBelowHundredthsPlaceSetItToZero();

  }
  // Why? Well... No reason in particular. I guess I have an irrational fear that numbers that look like 0.00001 might cause issues, often see people say something like "decimals bad, bad, bad, hehehe, hahaha"
  ifAnyForceGetsBelowHundredthsPlaceSetItToZero() {
    Object.keys(this.forces).forEach(forceName => {
      if (this.forces[forceName] > 0.01) {
        return;
      }
      this.forces[forceName] = 0;
    });
  }
}