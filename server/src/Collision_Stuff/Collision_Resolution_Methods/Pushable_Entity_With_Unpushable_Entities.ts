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

const maxIterationsAllowed=10;
let itersCount=0;
while(true) {
  itersCount++;
  My_Assert.that(itersCount < maxIterationsAllowed,`Resolution attempts exceeded allocated iterations of ${maxIterationsAllowed}`)
   const collision = Collision_Stuff.getClosestCollision(pushableEntity, (unpushableEntity)=>unpushableEntity.hasTag("Wall") || unpushableEntity.hasTag("Sliding_Door"));
  if(!collision) {
  break;
} 
console.log(collision.time, collision.normal)

   this.resolveCollision(collision);
}
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

  const  dtAtCollision = dt * collisionTime;
  console.log({dtAtCollision})
 const remT = 1 - collisionTime;
  const pe = pushableEntity;
  pe.x += pe.vx * dtAtCollision;
  pe.y += pe.vy * dtAtCollision;
  pe.x += collisionNormal.x
  pe.y += collisionNormal.y
    pe.x += collisionNormal.x
  pe.y += collisionNormal.y
   pe.x = Math.round(pe.x)
  pe.y = Math.round(pe.y)
  if(collisionNormal.x !==0){
    pe.vx=0;
  } else {
    pe.vx = pe.vx * remT;
  }
  if (collisionNormal.y !==0){ 
    pe.vy=0;
    
  } else {
    pe.vy = pe.vy * remT;
  }
}
}
