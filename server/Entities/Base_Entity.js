import { Game_Loop } from "#root/Game_Loop.js";
import { Simple_Auto_Increment_Id_Generator } from "#root/Simple_Auto_Increment_Id_Generator.js";


export { Base_Entity };
class Base_Entity {
  id = Simple_Auto_Increment_Id_Generator.generateId();
  possibleForces = ["left", "right", "up", "down"];
  forces = {
    "up": [],
    "down": [],
    "left": [],
    "right": [],
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
  sumForceObjects(force) {
    if(!possibleForces.includes(force)) {
      throw new Error (`Invalid force ${force}, possible values are ${this.possibleForces.toString()}`);
    }
    this.forces[force].forEach(force);
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
    this.ifAnyForceGetsBelowThisSetItToZero(0.9);

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
  getCenterX() {
    return this.x + (this.width / 2);
  }
  getCenterY() {
    return this.y + (this.height / 2);
  }
  setForces(forces) {
    Object.keys(forces).forEach(forceName => {
      if (forces[forceName] < 0) {
        throw new Error(`Trying to set force "${forceName}" to a negative value is invalid.`);
      }
      this.forces[forceName] = forces[forceName];
    });
  }
  /**
   * Adds calculated forces to the current forces.
   * @param {object} forces - Forces to add {left, right, up, down}.
   */
  addToForces(forces) {
    Object.keys(forces).forEach(forceName => {
      this.addToForce(forceName, forces[forceName]);

    });
  }
  addToForce(forceName, Value_To_Add) {
    // I am currently using a system of forces.up/down/left/right. So one of the four having a negative value makes no sense, since its counterpart is the one that is supposed to hold the value, 
    // so for example I do not want to have right -4, I would want to set left to 4.
    //  This is why this makes setting force to negative value an error somewhere in the caller.
    const potentialNewValue = this.forces[forceName] + Value_To_Add;
    if (potentialNewValue < 0) {
      throw new Error(`Attempt to set ${forceName} to a negative value "${potentialNewValue}" is invalid.`);
    }
    this.forces[forceName] = potentialNewValue;
  }
  propagateForcesTo(target) {
    target.addToForces(this.forces);
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
  Set_To_Square_Of_Size(size) {
    this.setWidth(size);
    this.setHeight(size);
  }
  setWidth(width) {
    this.width = width;
  }
  setHeight(height) {
    this.height = height;
  }
  setXYWH(x, y, w, h) {
    this.setX(x);
    this.setY(y);
    this.setWidth(w);
    this.setHeight(h);
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