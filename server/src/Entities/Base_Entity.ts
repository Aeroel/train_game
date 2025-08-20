import { Entity_Velocity, type Velocity_Component } from "#root/Entities/Entity_Velocity.js";
import { Game_Loop } from "#root/Game_Loop.js";
import { Simple_Auto_Increment_Id_Generator } from "#root/Simple_Auto_Increment_Id_Generator.js";
import type { Position, Direction } from "#root/Type_Stuff.js";
import { Assert_That_Number_Is_Finite, Assert_That_Numbers_Are_Finite, Assert_That_Numbers_Are_Zero_Or_Positive } from "#root/Type_Validation_Stuff.js";

export { Base_Entity };

class Base_Entity {
  id = Simple_Auto_Increment_Id_Generator.generateId();
  velocity = new Entity_Velocity(this);
  speedX = 0;
  speedY = 0;
  x = 0;
  y = 0;
  width = 50;
  height = 50;
  color = "white";
  tags = new Array();
  defaultVisionRange = 200;
  visionRange = this.defaultVisionRange;
  intangibility = false;
  constructor() {

    this.addTag("Entity");
  }
  
  
  updateState() {


  }



collisionManager() {
  
}


  updatePosition() {
    this.applyVelocityToPosition();
  }
  
  
Clean_Up() {
   this.velocity.nullify()
}




  calculateNextPositionBasedOnVelocityAndDeltaTime(): Position {
    const changeInX = (this.velocity.x.get() * Game_Loop.deltaTime);
    const changeInY = (this.velocity.y.get() * Game_Loop.deltaTime);
    
    const x = (this.x + changeInX);
    const y = (this.y + changeInY);
    const position: Position = { x, y };
    return position;
  }


  isMoving() {
    return (
         this.velocity.x.get() !== 0 ||
         this.velocity.y.get() !== 0 
      )
  }
  
  
applyVelocityToPosition() {
      const nextPosition = this.calculateNextPositionBasedOnVelocityAndDeltaTime();

    this.x = nextPosition.x;
    this.y = nextPosition.y;
  
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
    return this;
  }
  setY(y: number) {
    Assert_That_Number_Is_Finite(y);
    this.y = y;
    return this;
  }
  Set_To_Square_Of_Size(size: number) {
    Assert_That_Number_Is_Finite(size);
    this.setWidth(size);
    this.setHeight(size);
    return this;
  }
  setWidth(width: number) {
    Assert_That_Number_Is_Finite(width);
    this.width = width;
    return this;
  }
  setHeight(height: number) {
    Assert_That_Number_Is_Finite(height);
    this.height = height;
    return this;
  }
  setPosition(position: Position) {
    this.setX(position.x);
    this.setY(position.y);
        return this;
  }
  setXY(x: number, y: number) {
    Assert_That_Numbers_Are_Finite({ x, y,});
     this.setX(x);
     this.setY(y);
         return this;
  }

  setXYWH(x: number, y: number, w: number, h: number) {
    Assert_That_Numbers_Are_Finite({ x, y, w, h });
    Assert_That_Numbers_Are_Zero_Or_Positive({w, h})
    this.setX(x);
    this.setY(y);
    this.setWidth(w);
    this.setHeight(h);
        return this;
  }
  setColor(color: string) {
    this.color = color;
        return this;
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