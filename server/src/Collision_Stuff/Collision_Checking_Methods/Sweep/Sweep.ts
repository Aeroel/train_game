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

/* either rect might be moving on x and/or y axes or standing still
Input assumptions: 
1. at least one of the two entities is moving (in other words, we should have filtered out non moving entities so we would not be calling the sweepmethod)
2. They are not overlapping at time 0, i.e. at their initial positions (a.x, a.y, b.x, b.y) (i.e., we should have checked for static overlap previously, before we invoked the sweep function)
 
*/
function myCCDSweep(a: Rect, b: Rect) : null| CollRes{
  My_Assert.that(false === testInitialCollision(a,b),"myCCDSweep says: Oops, make sure to check for initial overlap at time 0 before invoking me");
  
  const {rvx, rvy} = getRelativeVelocity(a,b);

  My_Assert.that(rvx !== 0 || rvy !== 0, "myCCDSweep says: Oops buddy, make sure you check that the two entities are moving before invoking me. The reason for this is that there is nothing for me to do if they are not moving.");
  
  // now we can invoke the ccd algo
  const I_am_sure_I_have_made_all_the_necessary_preparations_before_calling_sweep_logic = true;
  const result = myCCDSweepLogic({
    a,
    b,
   I_am_sure_I_have_made_all_the_necessary_preparations_before_calling_sweep_logic 
  });
 return result
}

function getRelativeVelocity(a: Rect, b: Rect) : {rvx: number, rvy: number }  {
    const rvx = a.vx - b.vx;
    const rvy = a.vy - b.vy;
    
    return {rvx, rvy}
}


function testInitialCollision(a: Rect, b: Rect) {
  return Collision_Stuff.static_No_Velocity_Collision_Check(a,b);
}
function testRelativelyStationary(a: Rect, b: Rect) : boolean{
   const {rvx, rvy} = getRelativeVelocity(a,b)
    
    return rvx === 0 && rvy === 0;
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

// NOTE: do not call this directly, because
function myCCDSweepLogic({a, b, I_am_sure_I_have_made_all_the_necessary_preparations_before_calling_sweep_logic}: {a: Rect, b: Rect, I_am_sure_I_have_made_all_the_necessary_preparations_before_calling_sweep_logic: boolean}) : null| CollRes{
  My_Assert.that(I_am_sure_I_have_made_all_the_necessary_preparations_before_calling_sweep_logic, "Oops, call this only after you have");
 
  // finally, here is the sweep algo itself
 // so we know that at least one entity is moving.
 // we also know they do not overlap  at initial positions.
  let result: null | CollRes = null;
  // okay, I assume first things we need is deltaTime (i.e., milliseconds each tick update takes) and relative velocity...
  const dt = World_Tick.deltaTime;
  const {rvx, rvy} = getRelativeVelocity(a,b)
  // maybe we might as well get the positions both entities want to end up in if no collision occurs as well as what are the displacements of position for both
  const aEndX = a.x + (dt * a.vx);
  const aEndY = a.y + (dt * a.vy);
 
  const bEndX = b.x + (dt * b.vx);
  const bEndY = b.y + (dt * b.vy);
  
  const aDiffX = aEndX - a.x
  const aDiffY = aEndY - a.y

  const bDiffX = bEndX - b.x
  const bDiffY = bEndY - b.y
  console.log({
    dt, rvx, rvy, 
    aEndX, bEndX, aDiffX, bDiffX,
    aEndY, bEndY, aDiffY, bDiffY,
  })
  return result;
  
}