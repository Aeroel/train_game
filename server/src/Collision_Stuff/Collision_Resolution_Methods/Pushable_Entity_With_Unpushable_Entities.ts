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
  const collision = Collision_Stuff.getClosestCollision(pushableEntity, (unpushableEntity)=>unpushableEntity.hasTag("Wall") || unpushableEntity.hasTag("Sliding_Door"));
  if(!(collision) || collision.time===0) {
    return;
  } 

  this.resolveCollision(collision);
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
  pushableEntity.x += pushableEntity.vx * dtAtCollision;
  pushableEntity.y += pushableEntity.vy * dtAtCollision;
  pushableEntity.velocity.nullify();
  
  if(1>0) return;
 let unpushableFace = Collision_Stuff.getOppositeFace( Collision_Stuff.normalToFace(collisionNormal));

    const pushableAdjustPos = {x:0,y:0}

    switch(unpushableFace) {
      case "top":
        pushableAdjustPos.y = unpushableEntity.y - pushableEntity.height;
        pushableAdjustPos.x = pushableEntity.x + (pushableEntity.vx * dtAtCollision);
      break;
      case "bottom":
        pushableAdjustPos.y = unpushableEntity.y + unpushableEntity.height;
         pushableAdjustPos.x = pushableEntity.x + (pushableEntity.vx * dtAtCollision);
      break;
      case "left":
         pushableAdjustPos.x = unpushableEntity.x - unpushableEntity.width;
         
                 pushableAdjustPos.y = pushableEntity.y +  (pushableEntity.vy * dtAtCollision);
      break;
      case "right":
        pushableAdjustPos.x = unpushableEntity.x + unpushableEntity.width;
        
         pushableAdjustPos.y = pushableEntity.y +  (pushableEntity.vy * dtAtCollision);
      break;
    }
    pushableEntity.setPosition(pushableAdjustPos)
   
   console.log({
     desc:"log from resolutor",
  unpushableFace,
  pushableAdjustPos
})
   // spend velocity on the unaffected axis
 const remainingTime= (dt - dtAtCollision);
  const remainingVel = remainingTime / dt;
  switch(unpushableFace) {
  case "top":
  case "bottom":
    pushableEntity.vx *= remainingVel; 
    break;
  case "left": 
  case "right":
    pushableEntity.vy *= remainingVel; 
    break;
}  

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
