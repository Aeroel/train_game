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
    const simpA = this.entityToSimplifiedEntity(a);
    const simpB = this.entityToSimplifiedEntity(b);
     const collision =  this.codeByGrok(simpA, simpB);
     return collision;
  }
  private static codeByGrok(a: Simplified_Enity, b: Simplified_Enity ): Collision_Time_And_Normal | null{

     const toLog= detectCollision(a, b);
   console.log("from codeByGrok")
     console.log(toLog)
     return toLog;
  }
  static entityToSimplifiedEntity(entity: Base_Entity): Simplified_Enity {
     return {
       x: entity.x,
       y: entity.y,
       width: entity.width,
       height: entity.height,
       vx: entity.vx,
       vy: entity.vy,
     }
  }
}


// isolated grokmade code 
type Entity = Simplified_Enity;
type CollisionResult = Collision_Time_And_Normal;
/**
 * Computes the time of first collision between two moving axis-aligned bounding boxes (AABBs)
 * using continuous collision detection with relative velocity, equivalent to raycasting against slabs.
 * Assumes y increases downward.
 * Returns null if no collision within the time step [0, 1].
 * If already colliding at t=0, returns time=0 with an appropriate normal based on minimum translation vector.
 * The normal is axis-aligned for simplicity; corner collisions prefer the x-axis if times are equal.
 * 
 * @param a The first entity (considered moving relative to b)
 * @param b The second entity
 * @returns CollisionResult or null
 */
function detectCollision(a: Entity, b: Entity): CollisionResult | null {
  // relative velocity
  const vx = a.vx - b.vx;
  const vy = a.vy - b.vy;

  const xInvEntry = (vx > 0 ? b.x - (a.x + a.width) : (b.x + b.width) - a.x);
  const xInvExit = (vx > 0 ? (b.x + b.width) - a.x : b.x - (a.x + a.width));

  const yInvEntry = (vy > 0 ? b.y - (a.y + a.height) : (b.y + b.height) - a.y);
  const yInvExit = (vy > 0 ? (b.y + b.height) - a.y : b.y - (a.y + a.height));

  const xEntry = vx === 0 ? -Infinity : xInvEntry / vx;
  const xExit = vx === 0 ? Infinity : xInvExit / vx;

  const yEntry = vy === 0 ? -Infinity : yInvEntry / vy;
  const yExit = vy === 0 ? Infinity : yInvExit / vy;

  const entryTime = Math.max(xEntry, yEntry);
  const exitTime = Math.min(xExit, yExit);

  if (entryTime > exitTime || (xEntry < 0 && yEntry < 0) || entryTime > 1) {
    // no collision
    return null;
  }

  let normal = { x: 0, y: 0 };

  if (xEntry > yEntry) {
    normal = vx < 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
  } else {
    normal = vy < 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
  }

  return { time: entryTime, normal };
}
