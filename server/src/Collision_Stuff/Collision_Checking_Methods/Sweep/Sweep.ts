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
       console.log(collision, {
        a: Collision_Stuff.entityToBoxWithVelocity(a), b: Collision_Stuff.entityToBoxWithVelocity(b)
       })
     }
     return collision;
  }
  
  private static codeByGPTWrapper(a: Base_Entity, b: Base_Entity ): Collision_Time_And_Normal | null{
    const rectA= Collision_Stuff.entityToBoxWithVelocity(a);
    const rectB= Collision_Stuff.entityToBoxWithVelocity(b);
    const dt = World_Tick.deltaTime;
     const toLog= CCD(rectA, rectB);
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

function CCD(a: Rect, b: Rect): null | CollRes {
  // Calculate relative velocity (a moving relative to b)
  const vx = a.vx - b.vx;
  const vy = a.vy - b.vy;
  
  // If no relative movement, check if already overlapping
  if (vx === 0 && vy === 0) {
    // Check if already overlapping
    if (a.x < b.x + b.width && 
        a.x + a.width > b.x && 
        a.y < b.y + b.height && 
        a.y + a.height > b.y) {
      return {
        normal: { x: 0, y: 0 },
        time: 0
      };
    }
    return null;
  }
  
  // Calculate time to enter and exit for each axis
  let txEntry, txExit, tyEntry, tyExit;
  
  // X-axis
  if (vx > 0) {
    txEntry = (b.x - (a.x + a.width)) / vx;
    txExit = ((b.x + b.width) - a.x) / vx;
  } else if (vx < 0) {
    txEntry = ((b.x + b.width) - a.x) / vx;
    txExit = (b.x - (a.x + a.width)) / vx;
  } else {
    // No movement on x-axis
    if (a.x >= b.x + b.width || a.x + a.width <= b.x) {
      return null; // No overlap possible
    }
    txEntry = -Infinity;
    txExit = Infinity;
  }
  
  // Y-axis
  if (vy > 0) {
    tyEntry = (b.y - (a.y + a.height)) / vy;
    tyExit = ((b.y + b.height) - a.y) / vy;
  } else if (vy < 0) {
    tyEntry = ((b.y + b.height) - a.y) / vy;
    tyExit = (b.y - (a.y + a.height)) / vy;
  } else {
    // No movement on y-axis
    if (a.y >= b.y + b.height || a.y + a.height <= b.y) {
      return null; // No overlap possible
    }
    tyEntry = -Infinity;
    tyExit = Infinity;
  }
  
  // Find the latest entry time and earliest exit time
  const entryTime = Math.max(txEntry, tyEntry);
  const exitTime = Math.min(txExit, tyExit);
  
  // No collision if:
  // - Entry time is after exit time
  // - Entry time is negative (collision would have happened in the past)
  // - Entry time is greater than 1 (collision happens after this frame)
  if (entryTime > exitTime || entryTime < 0 || entryTime > 1) {
    return null;
  }
  
  // Calculate collision normal
  let normal: Normal;
  
  if (txEntry > tyEntry) {
    // Collision on x-axis
    if (vx > 0) {
      normal = { x: -1, y: 0 }; // Hit left side of b
    } else {
      normal = { x: 1, y: 0 };  // Hit right side of b
    }
  } else {
    // Collision on y-axis
    if (vy > 0) {
      normal = { x: 0, y: -1 }; // Hit top side of b
    } else {
      normal = { x: 0, y: 1 };  // Hit bottom side of b
    }
  }
  
  return {
    normal,
    time: entryTime
  };
}

function myCCD(a: Rect, b: Rect): null | CollRes {
  My_Assert.that(a.width >0 && a.height > 0 && b.width > 0 && b.height > 0);
  My_Assert.that(
    Number.isFinite(a.width) &&
    Number.isFinite(a.height) &&
    Number.isFinite(b.width) &&
    Number.isFinite(b.height) 
    )
  let time = 0;
  const normal: Normal = {x:0,y:0}
  const result: CollRes = {normal, time}
  const initialCollision = testInitialCollision(a, b)
  if(initialCollision) {
    // if they collide or overlap initially, then let's return time 0 normal 0,0
    return result;
  }
  const bothAreStationary = testIfBothAreStationary(a,b)
  if(bothAreStationary) { 
    // if they passed the initialCollision test yet are stationary then no collision can logically occur.
    return null;
  }
  
  
  return null
}

function testInitialCollision(a: Rect, b: Rect) : boolean {
  
  return Collision_Stuff.static_No_Velocity_Collision_Check(a, b);
}
function testIfBothAreStationary(a: Rect, b: Rect) : boolean{
  return a.vx === 0 && a.vy===0 && b.vx===0 && b.vy===0;
}