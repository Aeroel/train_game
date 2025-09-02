import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";

import { World_Tick} from "#root/World_Tick.js"
import type { Normal, Collision_Info } from "#root/Type_Stuff.js"
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { My_Assert} from "#root/My_Assert.js"
import { log } from "#root/My_Log.js"
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

  const collision = Collision_Stuff.getClosestCollision(pushableEntity, (unpushableEntity)=>unpushableEntity.hasTag("Wall") || unpushableEntity.hasTag("Sliding_Door"));
  if(!collision) {
  return;
}

 if(collision.time===0) {
   console.log("t=0 coll")
   //throw new Error("Do I want to ever allow initual overlap?")
   // Todo: handle this somehow, maybe by separating entities and then recalling the actualResolve?
   return;
 }

  this.resolveCollision(collision);
  
  
    // I don't think this can logically happen because due to the way the world works, if we nullify both axes one after another we will not have any new collisions. of course, we should throw just to be safe
    if(recursionTimes >2 ) {
      console.log(collision);
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
    const unaffectedOffsetX = ((Math.sign(pushableEntity.vx)) * -1) * offset;
    const unaffectedOffsetY = ((Math.sign(pushableEntity.vy)) * -1) * offset;
    const unaffectedDX = pushableEntity.vx * dtAtCollision
    const unaffectedDY = pushableEntity.vy * dtAtCollision
    const xAxisUnaffected = pushableEntity.x + (unaffectedDX + unaffectedOffsetX );
    const yAxisUnaffected = pushableEntity.y +  (unaffectedDY + unaffectedOffsetY);
    
    switch(unpushableFace) {
      case "top":
        pushableAdjustPos.y = unpushableEntity.y - pushableEntity.height - offset;
        pushableAdjustPos.x = xAxisUnaffected;
      break;
      case "bottom":
        pushableAdjustPos.y = unpushableEntity.y + unpushableEntity.height + offset;
         pushableAdjustPos.x = xAxisUnaffected;
      break;
      case "left":
         pushableAdjustPos.x = unpushableEntity.x - pushableEntity.width - offset;
         
                 pushableAdjustPos.y = yAxisUnaffected
      break;
      case "right":
        pushableAdjustPos.x = unpushableEntity.x + unpushableEntity.width + offset;
        
         pushableAdjustPos.y = yAxisUnaffected
      break;
    }
    pushableEntity.setPosition(pushableAdjustPos)
   

   // spend some velocity on the unaffected axis since we moved it by time at coll
  const Unspent_velocity_percentage_on_the_unaffected_axis = ((dt - dtAtCollision)/dt); // ex: (50-40)/50=?
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
   log({
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

     
 // }
}
}



function roundToCleanFloat(value: number, velocity: -1 | 0 | 1): number{
 
 // return complexCodeByClaude(value, velocity);
  return complexCodeByChatGPT(value, velocity);
}
function complexCodeByClaude(value: number, velocity: -1|0|1) : number {
     // Define valid fractional values (powers of 1/2 down to 1/32 = 0.03125)
  const validFractions = [0, 0.03125, 0.0625, 0.125, 0.25, 0.5];
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




function complexCodeByChatGPT(value: number, velocity: -1 | 0 | 1, maxDenominator = 32): number {
    if (velocity === 0) throw new Error("Velocity cannot be zero");

    const integerPart = Math.floor(value);
    let fractionalPart = value - integerPart;

    // Generate allowed fractions: 1, 1/2, 1/4, 1/8, ... 1/maxDenominator
    const fractions: number[] = [];
    for (let denom = 1; denom <= maxDenominator; denom *= 2) {
        fractions.push(1 / denom);
    }
    fractions.push(0); // include 0
    fractions.sort((a, b) => a - b);

    let targetFraction: number;

    if (velocity === 1) {
        // Round up to next valid fraction
        const candidates = fractions.filter(f => f > fractionalPart);
        targetFraction = candidates.length > 0 ? Math.min(...candidates) : 1;
        if (targetFraction === 1) return integerPart + 1;
    } else {
        // Round down to previous valid fraction
        const candidates = fractions.filter(f => f < fractionalPart);
        targetFraction = candidates.length > 0 ? Math.max(...candidates) : 0;
    }

    return integerPart + targetFraction;
}