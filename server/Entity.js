import { Game_Loop } from "./Game_Loop.js";


export { Entity };
class Entity {
  forces = {
    "up": 0,
    "down": 0,
    "left": 0,
    "right": 0,
  };
  friction = 0.5;
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  color = "white";
  tags = new Array();
  constructor() {
    this.addTag("Entity");
  }
  calculateNextPositionBasedOnForcesAndDeltaTime() {
    const netHorizontalForce = this.forces.right - this.forces.left;
    const netVerticalForce = this.forces.down - this.forces.up;

    const position = {};
    position.x = (this.x + (netHorizontalForce * Game_Loop.deltaTime));
    position.y = (this.y + (netVerticalForce * Game_Loop.deltaTime));
    return position;
  }
  updateState() {
    const nextPosition = this.calculateNextPositionBasedOnForcesAndDeltaTime();

    this.x = nextPosition.x;
    this.y = nextPosition.y;

    Object.keys(this.forces).forEach(forceName => {

      this.forces[forceName] *= (1 - this.friction);
    });
    this.ifAnyForceGetsBelowThisSetItToZero(0.001);

  }
  /**
    * Sets forces that is below a threshold to zero.
    * @param {number} threshold - Minimum force threshold.
    */
  ifAnyForceGetsBelowThisSetItToZero(threshold) {
    Object.keys(this.forces).forEach(forceName => {
      if (this.forces[forceName] < threshold) {
        this.forces[forceName] = 0;
      }
    });
  }
  /**
   * Adds calculated forces to the current forces.
   * @param {object} forces - Forces to add {left, right, up, down}.
   */
  addToForces(forces) {
    Object.keys(forces).forEach(forceName => {
      this.forces[forceName] += forces[forceName];
    });
  }
  subtractFromForces(forces) {
    Object.keys(forces).forEach(forceName => {
      this.forces[forceName] -= forces[forceName];
    });
  }
  propagateForcesTo(target) {
    Object.keys(this.forces).forEach(forceName => {
      target.forces[forceName] += this.forces[forceName];
    });
  }


  addTag(tag) {
    this.tags.push(tag);
  }
  removeTag(tag) {
    const tagIndex = this.tags.indexOf(tag);
    const tagExistsInArray = (tagIndex !== -1);
    if (!tagExistsInArray) {
      return false;
    }
    this.tags.splice(tagIndex, 1);
  }
  hasTag(tag) {
    const answer = (this.tags.includes(tag));
    return answer;
  }
  setX(x) {
    this.x = x;
  }
  setY(y) {
    this.y = y;
  }
  setWidth(width) {
    this.width = width;
  }
  setHeight(height) {
    this.height = height;
  }
  setColor(color) {
    this.color = color;
  }
  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }

}