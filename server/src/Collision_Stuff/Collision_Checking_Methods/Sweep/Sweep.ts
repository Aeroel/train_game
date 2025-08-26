import type {Direction, Position, 
Collision_Info, Normal,
Box} from "#root/Type_Stuff.js";
import{Collision_Stuff} from "#root/Collision_Stuff/Collision_Stuff.js"
import type {Base_Entity} from "#root/Entities/Base_Entity.js";
import { Helper_Functions } from "#root/Helper_Functions.js";
import { World_Tick } from "#root/World_Tick.js";
import{My_Assert} from "#root/My_Assert.js"


export { Sweep };
type Internal_Collision_Info = {
  occurred: boolean,
  time: number,
  normal: Normal,
}

type Simplified_Enity = {
  x: number, 
  y: number,
  width: number,
  height: number,
  vx: number,
  vy: number
}

class Sweep {
  static Check_For_Collision(a: Base_Entity, b: Base_Entity, dt: number = 1): Collision_Info | null {
    return this.implementationCode(a, b);
  }

  private static implementationCode(a: Base_Entity, b: Base_Entity): Internal_Collision_Info | null {
    const simpA = this.entityToSimplifiedEntity(a);
    const simpB = this.entityToSimplifiedEntity(b);
     const collision =  this.codeByGrok(simpA, simpB);
     return collision;
  }
  private static codeByGrok(a: Simplified_Enity, b: Simplified_Enity ): Internal_Collision_Info | null{
    
  }
  static entityToSimplifiedEntity(entity: Base_Entity): Simplified_Enity {
     return {
       x: entity.x,
       y: entity.y,
       width: entity.width,
       height: entity.height,
       vx: entity.vx,
       vy: entity.vy,
     }
  }
}