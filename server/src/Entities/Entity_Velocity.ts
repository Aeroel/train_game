import { Entity_Velocity_On_Axis, type Velocity_Component  }  from "#root/Entities/Entity_Velocity_On_Axis.js"
import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Direction } from "#root/Type_Stuff.js";
export {type Velocity_Component }
export class Entity_Velocity {
  x: Entity_Velocity_On_Axis;
  y: Entity_Velocity_On_Axis;
  entity: Base_Entity;
  propagationList: Entity_Velocity[]=[];
  
  constructor(ofEntity: Base_Entity
) {
    this.entity = ofEntity;
    this.x = new Entity_Velocity_On_Axis("x");
    this.y = new Entity_Velocity_On_Axis("y");
  }
  
  
  nullify() {
    this.x.nullify();
    this.y.nullify();
}


Add_To_Propagation_List(velocity: Entity_Velocity) {
    if(this.propagationList.includes(velocity)) {
    throw new Error('Trying to add ďuplicate entity to propagation list');
  }
  this.propagationList.push(velocity);

  this.x.Add_To_Propagation_List(velocity.x)
  this.y.Add_To_Propagation_List(velocity.y)
}



Remove_From_Propagation_List(velocity: Entity_Velocity) {
    if(!this.propagationList.includes(velocity)) {
    throw new Error('Trying to remove non-existent entity velocity from propagation list');
  }
this.propagationList.splice(this.propagationList.indexOf(velocity), 1);

    this.x.Remove_From_Propagation_List(velocity.x);
  this.y.Remove_From_Propagation_List(velocity.y);
}

Clear_Propagation_List() {
  this.x.Clear_Propagation_List();
  this.y.Clear_Propagation_List();
    this.propagationList =[];
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
        this.y.Add_Component({key:velAxis.key, value: velAxis.value});
      break;
     case "x":
        this.x.Add_Component({key:velAxis.key, value: velAxis.value});
      break;
   }
}


}