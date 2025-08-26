import { Entity_Velocity, type Velocity_Component } from "#root/Entities/Entity_Velocity.js";
import { World_Tick } from "#root/World_Tick.js";
import { Simple_Auto_Increment_Id_Generator } from "#root/Simple_Auto_Increment_Id_Generator.js";
import type { Position,Position_Percentage, Direction } from "#root/Type_Stuff.js";
import { My_Assert}from "#root/My_Assert.js"
import { World}from "#root/World.js"
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
  normalColor = "white";
  tempColorDuration = 100;
  tempColorTime = -1;
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
    this.tempColorLogic();
    this.applyVelocityToPosition();
  }
  
  tempColorLogic() {
    if(this.tempColorTime === -1) {
      return;
    }
    if(Date.now() > this.tempColorTime + this.tempColorDuration) {
      this.setColor(this.normalColor);
    }
  }
  
Clean_Up() {
   this.velocity.nullify()
}




  calculateNextPositionBasedOnVelocityAndDeltaTime(): Position {
    const changeInX = (this.velocity.x.get() * World_Tick.deltaTime);
    const changeInY = (this.velocity.y.get() * World_Tick.deltaTime);
    
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
  get position() {
    return {x:this.x,y:this.y}
  }
  get size(){
    return {width: this.width, height: this.height}
  }
get vx() {
 // console.log("getting vx")
  return this.velocity.x.get();
}
get vy() {
 // console.log("getting vy")
  return this.velocity.y.get();
}



  setPositionRelativeToPlanet({ xPercentage, yPercentage }: Position_Percentage) {
    const planet = World.getEntities().find(en => en.hasTag("Planet"));
    if (!planet) {
      throw new Error("Planet could not be found");
    }

    My_Assert.that(
      xPercentage >= 0 && xPercentage <= 100 &&
      yPercentage >= 0 && yPercentage <= 100, `Relative position must be given in percentages.`);

    // Planet bounds
    const px = planet.x;
    const py = planet.y;
    const pw = planet.width;
    const ph = planet.height;

    // Convert percentages to absolute world coords
    const newX = px + (pw * (xPercentage / 100)) - this.width / 2;
    const newY = py + (ph * (yPercentage / 100)) - this.height / 2;

    this.x = newX;
    this.y = newY;
  }

  getPositionRelativeToPlanet(): Position_Percentage {
    const planet = World.getEntities().find(en => en.hasTag("Planet"));
    if (!planet) {
      throw new Error("Planet could not be found");
    }

    const px = planet.x;
    const py = planet.y;
    const pw = planet.width;
    const ph = planet.height;

    // Get entity center relative to planet
    const centerX = this.getCenterX();
    const centerY = this.getCenterY();

    const xPercentage = ((centerX - px) / pw) * 100;
    const yPercentage = ((centerY - py) / ph) * 100;

    return { xPercentage, yPercentage };
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
  setTempColor(color: string) {
    this.setColor(color);
    this.tempColorTime = Date.now();
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

markBroadphaseWithColor() {
  this.setTempColor("grey")
}
markCollisionWithColor() {
  this.setTempColor("blue");
}
}