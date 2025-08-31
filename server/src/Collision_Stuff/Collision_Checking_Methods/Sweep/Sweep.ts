import type {Direction, Position, 
Collision_Time_And_Normal, Simplified_Enity, Collision_Info, Normal, 
Box} from "#root/Type_Stuff.js";
import{Collision_Stuff} from "#root/Collision_Stuff/Collision_Stuff.js"
import type {Base_Entity} from "#root/Entities/Base_Entity.js";
import { Helper_Functions } from "#root/Helper_Functions.js";
import { World_Tick } from "#root/World_Tick.js";
import{My_Assert} from "#root/My_Assert.js"


export { Sweep };


class Sweep {
  static Check_For_Collision(a: Base_Entity, b: Base_Entity): Collision_Info | null {
    const primary = this.implementationCode(a, b);
    if(!primary) return null;
    const info = {...primary, entityA:a, entityB:b} 
    return info;
  }

  private static implementationCode(a: Base_Entity, b: Base_Entity): Collision_Time_And_Normal | null {

     const collision =  this.codeByGPTWrapper(a, b);
     if(collision) {
      /* console.log(collision, {
        a: Collision_Stuff.entityToBoxWithVelocity(a), b: Collision_Stuff.entityToBoxWithVelocity(b)
       })*/
     }
     return collision;
  }
  
  private static codeByGPTWrapper(a: Base_Entity, b: Base_Entity ): Collision_Time_And_Normal | null{
    const rectA= Collision_Stuff.entityToBoxWithVelocity(a);
    const rectB= Collision_Stuff.entityToBoxWithVelocity(b);
    const dt = World_Tick.deltaTime;
     const toLog= myCCD(rectA, rectB);
     return toLog;
  }
  
  

}




interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
}


interface CollRes {
  normal: Normal, time: number
}



function myCCD(a: Rect, b: Rect): null | CollRes {
  My_Assert.that(a.width >0 && a.height > 0 && b.width > 0 && b.height > 0);
  My_Assert.that(
    Number.isFinite(a.vx) &&
    Number.isFinite(a.vy) &&
    Number.isFinite(b.vx) &&
    Number.isFinite(b.vy) 
    )
  let time = 0;
  const normal: Normal = {x:0,y:0}
  const result: CollRes = { normal, time}
  const preSweepResult = preSweepCheck(a,b);
  if(preSweepResult === "initialCollision") {
    return result;
  }
  if(preSweepResult === "Collision_is_impossible") {
    return null;
  }
  if(preSweepResult ==="shouldCheckMorePreciselyUsingSweep") {
  let res = myCCDSweep(a, b);
  res = If_both_x_and_y_of_normal_are_not_zero_due_to_perfect_diagonal_collision_then_prefer_x(res);
  
  
  return res;
  }
  throw new Error(`Oops, how did the program ever reach this throw line? maybe check what preSweepCheck returned. it returned this:${preSweepResult}`)
}


function preSweepCheck(a: Rect, b: Rect) {
      const alreadyOverlapping = testInitialCollision(a, b);
      
       if(alreadyOverlapping) {
          return "initialCollision"
    }
    const stationaryRelativeToEachOther = testRelativelyStationary(a, b);
    
    if(!alreadyOverlapping && stationaryRelativeToEachOther) {
            return "Collision_is_impossible"; 
      }
      
      return "shouldCheckMorePreciselyUsingSweep"

}

function myCCDSweep(a: Rect, b: Rect) : null| CollRes{
 return null; 
}



function testInitialCollision(a: Rect, b: Rect) {
  return Collision_Stuff.static_No_Velocity_Collision_Check(a,b);
}
function testRelativelyStationary(a: Rect, b: Rect) : boolean{
    const relativeVX = a.vx - b.vx;
    const relativeVY = a.vy - b.vy;
    
    return relativeVX === 0 && relativeVX === 0;
}

function If_both_x_and_y_of_normal_are_not_zero_due_to_perfect_diagonal_collision_then_prefer_x(collision: null | CollRes) : CollRes | null {
  if(!collision) {
    return null;
  }
  const normal = collision.normal;
  if(normal.x !== 0 && normal.y !== 0) {
    collision.normal =  {
      x: normal.x,
      y: 0
    }
  }
  return collision;
}