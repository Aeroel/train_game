import { Entity_Movement_Forces } from "#root/Entities/Entity_Movement_Forces.js";
import { Game_Loop } from "#root/Game_Loop.js";
import { Simple_Auto_Increment_Id_Generator } from "#root/Simple_Auto_Increment_Id_Generator.js";
import type { Position } from "#root/Type_Stuff.js";
import { Assert_That_Number_Is_Finite, Assert_That_Numbers_Are_Finite, Assert_That_Numbers_Are_Zero_Or_Positive } from "#root/Type_Validation_Stuff.js";

export { Base_Entity };

class Base_Entity {
  id = Simple_Auto_Increment_Id_Generator.generateId();
  possibleForces = ["left", "right", "up", "down"];
  movementForces = new Entity_Movement_Forces(this);
  friction = 0.5;
  speedPerTick = 0;
  x = 0;
  y = 0;
  previousX = 0;
  previousY = 0;
  width = 0;
  height = 0;
  color = "white";
  tags = new Array();
  defaultVisionRange = 200;
  visionRange = this.defaultVisionRange;
  lastUpdateStateCall=0;
  constructor() {

    this.addTag("Entity");
  }

collisionManager() {
  
}

  calculateNextPositionBasedOnForcesAndDeltaTime(): Position {
    const netHorizontalForce = this.movementForces.Get_Net_Axis_Force("horizontal")
    const netVerticalForce = this.movementForces.Get_Net_Axis_Force("vertical");

    const x = (this.x + (netHorizontalForce * Game_Loop.deltaTime));
    const y = (this.y + (netVerticalForce * Game_Loop.deltaTime));
    const position: Position = { x, y };
    return position;
  }
  updateStateWrapper() {
    
    this.updateState();
  }
  updateState() {


  }
  isMoving() {
    return (
      this.movementForces.Get_Net_Axis_Force('vertical')>0 ||
      this.movementForces.Get_Net_Axis_Force('horizontal')>0 
      )
  }
  
  updatePosition() {
    this.applyForcesToPosition();
  }
  
applyForcesToPosition() {
      const nextPosition = this.calculateNextPositionBasedOnForcesAndDeltaTime();

    this.previousX = this.x;
    this.previousY = this.y;

    this.x = nextPosition.x;
    this.y = nextPosition.y;
    

    this.movementForces.applyFriction();
}
  addTag(tag: string) {
    this.tags.push(tag);
  }
  removeTag(tag: string) {
    const tagIndex = this.tags.indexOf(tag);
    const tagExistsInArray = (tagIndex !== -1);
    if (!tagExistsInArray) {
      return false;
    }
    this.tags.splice(tagIndex, 1);
  }
  hasTag(tag: string) {
    const answer = (this.tags.includes(tag));
    return answer;
  }
  setX(x: number) {
    Assert_That_Number_Is_Finite(x);
    this.x = x;
  }
  setY(y: number) {
    Assert_That_Number_Is_Finite(y);
    this.y = y;
  }
  Set_To_Square_Of_Size(size: number) {
    Assert_That_Number_Is_Finite(size);
    this.setWidth(size);
    this.setHeight(size);
  }
  setWidth(width: number) {
    Assert_That_Number_Is_Finite(width);
    this.width = width;
  }
  setHeight(height: number) {
    Assert_That_Number_Is_Finite(height);
    this.height = height;
  }
  setPosition(position: Position) {
    this.setX(position.x);
    this.setY(position.y);
  }
  setXY(x: number, y: number) {
    Assert_That_Numbers_Are_Finite({ x, y,});
     this.setX(x);
     this.setY(y);
  }

  setXYWH(x: number, y: number, w: number, h: number) {
    Assert_That_Numbers_Are_Finite({ x, y, w, h });
    Assert_That_Numbers_Are_Zero_Or_Positive({w, h})
    this.setX(x);
    this.setY(y);
    this.setWidth(w);
    this.setHeight(h);
  }
  setColor(color: string) {
    this.color = color;
  }

  getCenterX() {
    return this.x + (this.width / 2);
  }
  getCenterY() {
    return this.y + (this.height / 2);
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