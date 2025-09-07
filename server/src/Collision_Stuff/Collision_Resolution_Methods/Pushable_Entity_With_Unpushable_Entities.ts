import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";

import { World_Tick} from "#root/World_Tick.js"
import type { Normal, Collision_Info } from "#root/Type_Stuff.js"
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { My_Assert} from "#root/My_Assert.js"
import { I_Expect_That} from "#root/I_Expect_That.js"
import { log } from "#root/My_Log.js"
import { Helper_Functions} from "#root/Helper_Functions.js"

/*
Basically, this is for player. player cannot push walls, but walls must push player. In other words, if walls move, they push. if player moves against wall, player gets stopped. 
*/
export class Pushable_Entity_With_Unpushable_Entities {
  static resolve({pushableEntity}: {pushableEntity: Base_Entity}) {
    this.resolveCode({pushableEntity})
  }
  
  
  static resolveCode({pushableEntity, recursionTimes=0}:
  {pushableEntity: Base_Entity, recursionTimes?: number}) {
  if(pushableEntity.intangibility) {
    return;
  }

const maxIterationsAllowed=3;
let itersCount=0;
const handledEntities: Base_Entity[]=[];
while(true) {
  My_Assert.that(itersCount < maxIterationsAllowed,`Resolution attempts exceeded allocated iterations of ${maxIterationsAllowed}`)
   const collision = Collision_Stuff.getClosestCollision(pushableEntity, (unpushableEntity)=>
  (unpushableEntity.hasTag("Wall") || unpushableEntity.hasTag("Sliding_Door")) 
   );
  if(!collision) {
  break;
} 
I_Expect_That(!(handledEntities.includes(collision.entityB)), "I expect that if an unpushableEntity already triggered resolution once this tick then it will not again collide with pushableEntity this tick. If it does collide again and again, this means the first resolution failed. The question te answer then is why did it fail the first time and how to avoid this issue?   ")
//console.log(collision.time, collision.normal)

   this.resolveCollision(collision);
   handledEntities.push(collision.entityB)
     itersCount++
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
// standing walls only
const roundNum = 1/8192;
const CT = collisionTime;
const tJustBefore = CT - ( CT / 100)
const remT = 1 - tJustBefore;
  const  dtAtJustBeforeCollision = dt * (tJustBefore);

 
  const pe = pushableEntity;
  const une = unpushableEntity;
  pe.x += pe.vx * dtAtJustBeforeCollision;
  pe.y += pe.vy * dtAtJustBeforeCollision;
  pe.x += collisionNormal.x *5
  pe.y += collisionNormal.y*5
 pe.x =roundTo(pe.x, roundNum)
 pe.y = roundTo(pe.y, roundNum)
  if(collisionNormal.x !==0){
    pe.vx=0;
    if(Math.sign(une.vx) === collisionNormal.x) {
      pe.vx = une.vx * remT;
    }
  } else {
    pe.vx = pe.vx * remT;
  }
  if (collisionNormal.y !==0){ 
    pe.vy=0;
        if(Math.sign(une.vy) === collisionNormal.y) {
      pe.vy = une.vy * remT;
    }
  } else {
    pe.vy = pe.vy * remT;
  }

  pe.vx = roundTo(pe.vx, roundNum) 
  pe.vy = roundTo(pe.vy, roundNum)
  
  const uneEnd = unpushableEntity.getEndPos();
  const peEnd = pushableEntity.getEndPos();
  const collideAtEndPositions = Collision_Stuff.static_No_Velocity_Collision_Check(
    Collision_Stuff.posToBox(pe, peEnd),
    Collision_Stuff.posToBox(une, uneEnd)
    );
  I_Expect_That(false === collideAtEndPositions, "I expect that they do not collide at ending positions after resolution")
}
}

function roundTo(num: number, step: number): number {
  return Math.round(num / step) * step;
}
