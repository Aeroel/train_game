import { Entity_Forces } from "#root/Entities/Entity_Forces.js";
import { Game_Loop } from "#root/Game_Loop.js";
import { Simple_Auto_Increment_Id_Generator } from "#root/Simple_Auto_Increment_Id_Generator.js";


export { Base_Entity };
class Base_Entity {
  id = Simple_Auto_Increment_Id_Generator.generateId();
  possibleForces = ["left", "right", "up", "down"];
  forces = new Entity_Forces(this);
  friction = 0.5;
  x = 0;
  y = 0;
  width = 0;
  height = 0;
  color = "white";
  tags = new Array();
  defaultVisionRange = 200;
  visionRange = this.defaultVisionRange;
  constructor() {

    this.addTag("Entity");
  }
  Get_No_Movement_Forces() {
    return {up:0,down:0, right:0,left:0};
  }
  calculateNextPositionBasedOnForcesAndDeltaTime() {
    const netHorizontalForce = this.forces.sumComponents("right") - this.forces.sumComponents("left");
    const netVerticalForce = this.forces.sumComponents("down") - this.forces.sumComponents("up");
    
    const position = {};
    position.x = (this.x + (netHorizontalForce * Game_Loop.deltaTime));
    position.y = (this.y + (netVerticalForce * Game_Loop.deltaTime));
    return position;
  }
  updateState() {
    const nextPosition = this.calculateNextPositionBasedOnForcesAndDeltaTime();

    this.x = nextPosition.x;
    this.y = nextPosition.y;

    this.forces.applyFriction();

  }
  getCenterX() {
    return this.x + (this.width / 2);
  }
  getCenterY() {
    return this.y + (this.height / 2);
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