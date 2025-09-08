import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";

import { World_Tick} from "#root/World_Tick.js"
import type { Normal, Collision_Info } from "#root/Type_Stuff.js"
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { My_Assert} from "#root/My_Assert.js"
import { I_Expect_That, Verify_Expectations, Add_Expectation} from "#root/I_Expect_That.js"
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
const initialOverlap = Collision_Stuff.static_No_Velocity_Collision_Check(collision.entityA, collision.entityB);
const alreadyHandled = handledEntities.includes(collision.entityB);
const errors:string[]=[];

const exp1 = Add_Expectation(!alreadyHandled, `I expect that if an unpushableEntity (debug: tags:${JSON.stringify(collision.entityB.tags)}) already triggered resolution once this tick then it will not again collide with pushableEntity this tick. If it does collide again and again, this means the first resolution failed. The question te answer then is why did it fail the first time and how to avoid this issue?   `)
const exp2 = Add_Expectation(!initialOverlap,"I expect that the entities do not begin in overlap")
Verify_Expectations(exp1, exp2);

   this.resolveCollision(collision);
   
  const pe = collision.entityA;
  const une = collision.entityB;
  
  const peEndBox = Collision_Stuff.posToBox(pe, pe.getEndPos());
  const uneEndBox = Collision_Stuff.posToBox(une, une.getEndPos());

  const collideAtEndPositions = Collision_Stuff.static_No_Velocity_Collision_Check(peEndBox, uneEndBox
    );
  
   
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


}
}

function roundTo(num: number, step: number): number {
  return Math.round(num / step) * step;
}
