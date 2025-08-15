import { Entity_Velocity, type Velocity_Component } from "#root/Entities/Entity_Velocity.js";
import { Game_Loop } from "#root/Game_Loop.js";
import { Simple_Auto_Increment_Id_Generator } from "#root/Simple_Auto_Increment_Id_Generator.js";
import type { Position, Direction } from "#root/Type_Stuff.js";
import { Assert_That_Number_Is_Finite, Assert_That_Numbers_Are_Finite, Assert_That_Numbers_Are_Zero_Or_Positive } from "#root/Type_Validation_Stuff.js";

export { Base_Entity };

class Base_Entity {
  id = Simple_Auto_Increment_Id_Generator.generateId();
  vx = new Entity_Velocity(this);
  vy = new Entity_Velocity(this);
  velocityPropagationList: Base_Entity[] = [];
  speedX = 0;
  speedY = 0;
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

collisionManager() {
  
}
  updatePosition() {
    this.applyVelocityToPosition();
  }
cleanUp() {
  this.vx.nullify();
  this.vy.nullify();
}
  calculateNextPositionBasedOnForcesAndDeltaTime(): Position {

    const x = (this.x + (this.vx.get() * Game_Loop.deltaTime));
    const y = (this.y + (this.vy.get() * Game_Loop.deltaTime));
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
         this.vx.get() !== 0 ||
         this.vy.get() !== 0 
      )
  }
  
  
applyVelocityToPosition() {
      const nextPosition = this.calculateNextPositionBasedOnForcesAndDeltaTime();

    this.x = nextPosition.x;
    this.y = nextPosition.y;
  
}
nullifyVelocity() {
  this.vx.nullify();
  this.vy.nullify()
}
Add_Entity_To_Velocity_Propagation_List(entity: Base_Entity) {
  this.velocityPropagationList.push(entity);
  this.vx.Add_To_Propagation_List(entity.vx)
  this.vy.Add_To_Propagation_List(entity.vy)
}
Get_Velocity_Propagation_List() {
  return this.velocityPropagationList;
}
Remove_Entity_From_Velocity_Propagation_List(entity: Base_Entity) {
    this.vx.Remove_From_Propagation_List(entity.vx)
  this.vy.Remove_From_Propagation_List(entity.vy)
}
directionToAxisVelocity({direction, key, value}:{direction: Direction, key: Velocity_Component['key'], value: Velocity_Component['value']}) {
  let axis: "y"|"x"="x";
  switch(direction) {
     case "up":
       value = -1*value;
       axis="y"
      break;
     case "left":
       axis="x"
        value = -1*value;
      break;
     case "right":
       axis="x" 

      break;
      case "down":
      axis='y'
      break;
   }
   return {
     value,
     key,
     axis,
   }
}
directionToVelocity({direction, key, value}:{direction: Direction, key: Velocity_Component['key'], value: Velocity_Component['value']}) {
   const velAxis = this.directionToAxisVelocity({direction, key, value});
   switch(velAxis.axis) {
     case "y":
        this.vy.Add_Component({key:velAxis.key, value: velAxis.value});
      break;
     case "x":
        this.vx.Add_Component({key:velAxis.key, value: velAxis.value});
      break;
   }
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