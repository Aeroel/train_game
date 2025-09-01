import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";

import { World_Tick} from "#root/World_Tick.js"
import type { Normal, Collision_Info } from "#root/Type_Stuff.js"
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { My_Assert} from "#root/My_Assert.js"
import { Helper_Functions} from "#root/Helper_Functions.js"

/*
Todo: a better name. 
Basically, this is for player. player cannot push walls, but walls must push player. In other words, if walls move, they push. if player moves against wall, player gets stopped. 
*/
export class Pushable_Entity_With_Unpushable_Entities {
  static resolve({pushableEntity}: {pushableEntity: Base_Entity}) {
    this.actualResolve({pushableEntity})
  }
  
  
  static actualResolve({pushableEntity, recursionTimes=0}:
  {pushableEntity: Base_Entity, recursionTimes?: number}) {
  if(pushableEntity.intangibility) {
    return;
  }

const closestFirst = (a: Collision_Info, b: Collision_Info)=> a.time - b.time;
  const collisions = Collision_Stuff.findCollisions(pushableEntity, (unpushableEntity)=>unpushableEntity.hasTag("Wall") || unpushableEntity.hasTag("Sliding_Door")).toSorted(closestFirst);
  if(collisions.length===0) {
  return;
}
  const minTime = collisions[0].time;
  const simultaneousColls = collisions.filter(coll => coll.time === minTime)

for(const collision of simultaneousColls) {  
 if(collision.time===0) {
   // Todo: handle this somehow, maybe by separating entities and then recalling the actualResolve?
   return;
 }

  this.resolveCollision(collision);
  
  }
    // I don't think this can logically happen because due to the way the world works, if we nullify both axes one after another we will not have any new collisions. of course, we should throw just to be safe
    if(recursionTimes >2 ) {
         throw new Error(`${recursionTimes}`)
    }
   const i = 1+recursionTimes
   // since we updated pushable's velocity midtick, we need to check again. this can only get called twice total, because since we have just nullified velocity of one axis, the only other available axis is the other one, so the entity might be moving with a new wall. but once we handle the second time, we know that the lushable must be completely still so all collisions were handled for now.
   this.actualResolve({pushableEntity, recursionTimes: i});
  }

static resolveCollision(collision: Collision_Info) {
  const unpushableEntity = collision.entityB;
  const pushableEntity = collision.entityA;
  const collisionTime = collision.time
  const collisionNormal = collision.normal
  const dt = World_Tick.deltaTime;
  this.handle({
    unpushableEntity,
    pushableEntity,
    dt,
    collisionTime,
    collisionNormal,
  })
}
static handle({collisionTime, collisionNormal, pushableEntity, unpushableEntity, dt}: {collisionTime: number, collisionNormal: Normal, pushableEntity: Base_Entity, unpushableEntity: Base_Entity, dt: number}) {
  // {
  const  dtAtCollision = dt * collisionTime;
  
 let unpushableFace =  Collision_Stuff.normalToFace(collisionNormal);

    const pushableAdjustPos = {x:0,y:0}
    // if we have no offset or it is too low, then entities simply pass through. not sure why. is something wrong with detector returned info or what?
    const offset = 10;
    switch(unpushableFace) {
      case "top":
        pushableAdjustPos.y = unpushableEntity.y - pushableEntity.height - offset;
        pushableAdjustPos.x = pushableEntity.x + (pushableEntity.vx * dtAtCollision);
      break;
      case "bottom":
        pushableAdjustPos.y = unpushableEntity.y + unpushableEntity.height + offset;
         pushableAdjustPos.x = pushableEntity.x + (pushableEntity.vx * dtAtCollision);
      break;
      case "left":
         pushableAdjustPos.x = unpushableEntity.x - pushableEntity.width - offset;
         
                 pushableAdjustPos.y = pushableEntity.y +  (pushableEntity.vy * dtAtCollision);
      break;
      case "right":
        pushableAdjustPos.x = unpushableEntity.x + unpushableEntity.width + offset;
        
         pushableAdjustPos.y = pushableEntity.y +  (pushableEntity.vy * dtAtCollision);
      break;
    }
    pushableEntity.setPosition(pushableAdjustPos)
   

   // spend some velocity on the unaffected axis since we moved it by time at coll
  const Unspent_velocity_percentage_on_the_unaffected_axis = ((dt - dtAtCollision)/dt);
  switch(unpushableFace) {
  case "top":
  case "bottom":
    pushableEntity.vx = Unspent_velocity_percentage_on_the_unaffected_axis * pushableEntity.vx
    break;
  case "left": 
  case "right":
    pushableEntity.vy = Unspent_velocity_percentage_on_the_unaffected_axis * pushableEntity.vy
    break;
}  
   console.log({
     desc:"log from resolutor",
  unpushableFace,
  pushableAdjustPos, dt, dtAtCollision
})
 // push pushable if wall moving towards it, otherwise, just nulify affected axis
    switch(unpushableFace){
      case "top":
        pushableEntity.vy = 0;
        if(unpushableEntity.vy < 0) {
          pushableEntity.vy = unpushableEntity.vy;
        }
      break;
      case "bottom":
         pushableEntity.vy=0;
                 if(unpushableEntity.vy > 0) {
          pushableEntity.vy = unpushableEntity.vy;
        }
      break;
      case "left":
         pushableEntity.vx=0;
         if(unpushableEntity.vx <0) {
           pushableEntity.vx = unpushableEntity.vx
         }
        break;
      case "right":
         pushableEntity.vx=0;
         if(unpushableEntity.vx >0) {
           pushableEntity.vx = unpushableEntity.vx
         }
        break;
    }
   // if(1<2) return;
    // adjust unaffected axis to remove hairy floats that might be created by the operation. for exampel, assume x is the unaffected axis. this might lead to some hairy number like 2732.2837295726
     let signVX = Math.sign(pushableEntity.vx)
     let signVY = Math.sign(pushableEntity.vy)
     signVY=<0|1|-1>signVY
     signVX=<0|1|-1>signVX
     const negedSignVY=<0|1|-1>-signVY
    const negedSignVX=<0|1|-1>-signVX
         My_Assert.that(signVX === 0 || signVX === 1 || signVX === -1)
     My_Assert.that(signVY === 0 || signVY === 1 || signVY === -1)
     
    switch(unpushableFace) {
      case "top":
     case "bottom":
        pushableEntity.vx =  roundToCleanFloat(pushableEntity.vx, negedSignVX)  
        pushableEntity.x =  roundToCleanFloat(pushableEntity.x, negedSignVX)  
      break;
      case "left":
     case "right":
              pushableEntity.vy =  roundToCleanFloat(pushableEntity.vy, negedSignVY)  
        pushableEntity.y =  roundToCleanFloat(pushableEntity.y, negedSignVY)  
      break;
    }
 // }
}
}



function roundToCleanFloat(value: number, velocity: -1 | 0 | 1): number{
    // Define valid fractional values (powers of 1/2 down to 1/32 = 0.03125)
  const validFractions = [0, 0.03125, 0.0625, 0.125, 0.25, 0.5];
  return complexCodeByClaude(value, velocity, validFractions);
}
function complexCodeByClaude(value: number, velocity: -1|0|1, validFractions: number[]) : number {
  // Find the fractional part
  const integerPart = Math.floor(value);
  const fractionalPart = value - integerPart;

  
  let targetFraction: number;
  
  if (velocity === 0) {
    // Find closest valid fraction
    targetFraction = validFractions.reduce((closest, current) => {
      return Math.abs(current - fractionalPart) < Math.abs(closest - fractionalPart) 
        ? current : closest;
    });
  } else {
    // Find valid fractions above and below current fraction
    const below = validFractions.filter(f => f <= fractionalPart);
    const above = validFractions.filter(f => f >= fractionalPart);
    
    const maxBelow = below.length > 0 ? Math.max(...below) : 0;
    const minAbove = above.length > 0 ? Math.min(...above) : 1; // 1.0 wraps to next integer
    
    if (velocity === 1) {
      // Round up
      targetFraction = minAbove === 1 ? 0 : minAbove;
      // If we hit 1.0, carry over to next integer
      if (minAbove === 1) {
        return integerPart + 1;
      }
    } else { // velocity === -1
      // Round down
      targetFraction = maxBelow;
    }
  }
  
  return integerPart + targetFraction;
}
/*
// Test cases from your examples
console.log("Testing with your examples:");
console.log("777.282471838, vel 0 ->", roundToCleanFloat(777.282471838, 0)); // Should be 777.25
console.log("0.3758173, vel 1 ->", roundToCleanFloat(0.3758173, 1)); // Should be 0.5
console.log("0.3757173, vel 0 ->", roundToCleanFloat(0.3757173, 0)); // Whatever is closest
console.log("0.3757173, vel -1 ->", roundToCleanFloat(0.3757173, -1)); // Should be 0.25
console.log("38482.4769682, vel 1 ->", roundToCleanFloat(38482.4769682, 1)); // Should be 38482.5
console.log("38482.4769682, vel 0 ->", roundToCleanFloat(38482.4769682, 0)); // Whatever is closest
console.log("38482.4769682, vel -1 ->", roundToCleanFloat(38482.4769682, -1)); // Should be 38482.25
console.log("38482.047472, vel 1 ->", roundToCleanFloat(38482.047472, 1)); // Should be 38482.0625
console.log("38482.047472, vel -1 ->", roundToCleanFloat(38482.047472, -1)); // Should be 38482.03125
console.log("38482.047472, vel 0 ->", roundToCleanFloat(38482.047472, 0)); // Whatever is closest

// Additional edge cases
console.log("\nEdge cases:");
console.log("777.0, vel 1 ->", roundToCleanFloat(777.0, 1)); // Already clean
console.log("777.5, vel 1 ->", roundToCleanFloat(777.5, 1)); // Should go to 778.0
console.log("777.03125, vel -1 ->", roundToCleanFloat(777.03125, -1)); // Should go to 777.0

*/