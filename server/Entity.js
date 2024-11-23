import { Game_Loop } from "./Game_Loop.js";


export { Entity }
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
  width = 0 ;
  height = 0;
  color = "white";
  tags = new Array();
  constructor() {
    this.addTag("Entity");
  }
  updateState() {
    const netHorizontalForce = this.forces.right - this.forces.left;
    const netVerticalForce = this.forces.down - this.forces.up;

    this.x += (netHorizontalForce * Game_Loop.deltaTime)
    this.y += (netVerticalForce * Game_Loop.deltaTime)

    Object.keys(this.forces).forEach(forceName => {

      this.forces[forceName] *= (1 - this.friction);
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
    const answer = (this.tags.includes(tag))
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