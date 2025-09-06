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
/*export class Pushable_Entity_With_Unpushable_Entities {
  static resolve({pushableEntity}: {pushableEntity: Base_Entity}) {
    this.resolveCode({pushableEntity})
  }
  
  
  static resolveCode({pushableEntity, recursionTimes=0}:
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
*/
// Assumed types (for clarity)
// type Normal = { x: number, y: number };
// type Collision_Info = { time: number, normal: Normal | null, entityA: Base_Entity, entityB: Base_Entity };

export class Pushable_Entity_With_Unpushable_Entities {
  static resolve({ pushableEntity }: { pushableEntity: Base_Entity }) {
    this.resolveCode({ pushableEntity });
  }

  static resolveCode({
    pushableEntity,
  }: {
    pushableEntity: Base_Entity;
  }) {
    if (pushableEntity.intangibility) return;

    const MAX_ITERS = 30;
    const EPS_TIME = 1e-7; // small time step to escape floating-point loops
    const EPS_V = 1e-6;    // treat tiny velocities as zero
    const NUDGE = 1e-3;    // small positional push to escape surfaces
    const dt = World_Tick.deltaTime;

    let iters = 0;
    let currentTime = 0;
    const resolvedColliders = new Set<Base_Entity>();
    let touchedX = false;
    let touchedY = false;

    function resolvePenetration(a: Base_Entity, b: Base_Entity) {
      const aLeft = a.x, aRight = a.x + a.width;
      const bLeft = b.x, bRight = b.x + b.width;
      const aTop = a.y, aBottom = a.y + a.height;
      const bTop = b.y, bBottom = b.y + b.height;

      const penX = Math.min(aRight, bRight) - Math.max(aLeft, bLeft);
      const penY = Math.min(aBottom, bBottom) - Math.max(aTop, bTop);

      if (penX <= 0 || penY <= 0) return;

      if (penX < penY) {
        const pushDir = (a.x + a.width / 2 < b.x + b.width / 2) ? -1 : 1;
        a.x += pushDir * (penX + NUDGE);
        a.vx = 0;
        touchedX = true;
      } else {
        const pushDir = (a.y + a.height / 2 < b.y + b.height / 2) ? -1 : 1;
        a.y += pushDir * (penY + NUDGE);
        a.vy = 0;
        touchedY = true;
      }
    }

    while (currentTime < 1 - EPS_TIME) {
      iters++;
      My_Assert.that(iters <= MAX_ITERS, `Resolution attempts exceeded allocated iterations of ${MAX_ITERS}`);

      if (Math.abs(pushableEntity.vx) < EPS_V && Math.abs(pushableEntity.vy) < EPS_V) {
        const remain = 1 - currentTime;
        pushableEntity.x += pushableEntity.vx * dt * remain;
        pushableEntity.y += pushableEntity.vy * dt * remain;
        break;
      }

      const collision = Collision_Stuff.getClosestCollision(pushableEntity, (other) =>
        other.hasTag("Wall") || other.hasTag("Sliding_Door")
      );

      if (!collision) {
        const remain = 1 - currentTime;
        pushableEntity.x += pushableEntity.vx * dt * remain;
        pushableEntity.y += pushableEntity.vy * dt * remain;
        break;
      }

      if (resolvedColliders.has(collision.entityB)) {
        currentTime += EPS_TIME;
        continue;
      }

      resolvedColliders.add(collision.entityB);

      // Clamp TOI
      const toi = Math.max(currentTime, collision.time);
      const dtStep = toi - currentTime;

      // Advance to collision
      pushableEntity.x += pushableEntity.vx * dt * dtStep;
      pushableEntity.y += pushableEntity.vy * dt * dtStep;
      currentTime = toi;

      if (collision.normal && (collision.normal.x !== 0 || collision.normal.y !== 0)) {
        // single NUDGE push
        pushableEntity.x += collision.normal.x * NUDGE;
        pushableEntity.y += collision.normal.y * NUDGE;

        if (collision.normal.x !== 0) {
          pushableEntity.vx = 0;
          touchedX = true;
        }
        if (collision.normal.y !== 0) {
          pushableEntity.vy = 0;
          touchedY = true;
        }
      } else {
        // fallback penetration resolution
        resolvePenetration(pushableEntity, collision.entityB);
      }

      if (touchedX && touchedY) {
        pushableEntity.vx = 0;
        pushableEntity.vy = 0;
        break;
      }
    }

    // final rounding (optional)
    pushableEntity.x = Math.round(pushableEntity.x);
    pushableEntity.y = Math.round(pushableEntity.y);
  }
}