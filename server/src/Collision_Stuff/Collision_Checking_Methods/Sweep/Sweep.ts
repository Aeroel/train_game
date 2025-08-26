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
     return detectCollision(a, b);
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
  const aLeft = a.x;
  const aRight = a.x + a.width;
  const aTop = a.y;
  const aBottom = a.y + a.height;

  const bLeft = b.x;
  const bRight = b.x + b.width;
  const bTop = b.y;
  const bBottom = b.y + b.height;

  const rvx = a.vx - b.vx;
  const rvy = a.vy - b.vy;

  // Check if already overlapping at t=0
  const overlapping = aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
  if (overlapping) {
    // Compute minimum translation vector for normal
    const overlapLeft = aRight - bLeft;
    const overlapRight = bRight - aLeft;
    const overlapTop = aBottom - bTop;
    const overlapBottom = bBottom - aTop;

    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
    let nx: Normal['x'] = 0;
    let ny: Normal['x'] = 0;

    if (minOverlap === overlapLeft) {
      nx = -1; // Push a left
    } else if (minOverlap === overlapRight) {
      nx = 1;  // Push a right
    } else if (minOverlap === overlapTop) {
      ny = -1; // Push a up
    } else {
      ny = 1;  // Push a down
    }

    // If multiple minima, prefer x for consistency with dynamic case
    return { time: 0, normal: { x: nx, y: ny } };
  }

  // If no relative movement and not overlapping, no collision
  if (rvx === 0 && rvy === 0) {
    return null;
  }

  // Compute invasion distances (ray to slab distances)
  let xInvEntry: number;
  let xInvExit: number;
  if (rvx > 0) {
    xInvEntry = bLeft - aRight;
    xInvExit = bRight - aLeft;
  } else if (rvx < 0) {
    xInvEntry = bRight - aLeft;
    xInvExit = bLeft - aRight;
  } else {
    // No movement in x; already checked overlap
    if (aLeft >= bRight || aRight <= bLeft) return null;
    xInvEntry = -Infinity;
    xInvExit = Infinity;
  }

  let yInvEntry: number;
  let yInvExit: number;
  if (rvy > 0) {
    yInvEntry = bTop - aBottom;
    yInvExit = bBottom - aTop;
  } else if (rvy < 0) {
    yInvEntry = bBottom - aTop;
    yInvExit = bTop - aBottom;
  } else {
    // No movement in y; already checked overlap
    if (aTop >= bBottom || aBottom <= bTop) return null;
    yInvEntry = -Infinity;
    yInvExit = Infinity;
  }

  // Compute times (ray parameter t)
  const xEntry = (rvx === 0) ? -Infinity : xInvEntry / rvx;
  const xExit = (rvx === 0) ? Infinity : xInvExit / rvx;

  const yEntry = (rvy === 0) ? -Infinity : yInvEntry / rvy;
  const yExit = (rvy === 0) ? Infinity : yInvExit / rvy;

  const entryTime = Math.max(xEntry, yEntry);
  const exitTime = Math.min(xExit, yExit);

  // No collision if entry after exit or outside [0, 1)
  if (entryTime > exitTime || entryTime >= 1 || entryTime < 0) {
    return null;
  }

  // Determine normal based on which slab (axis) the ray hits first (later entry time)
  let nx: Normal['x'] = 0;
  let ny: Normal['y'] = 0;
  if (xEntry > yEntry) {
    nx = (rvx > 0) ? -1 : 1;  // Hit on x-axis
  } else if (yEntry > xEntry) {
    ny = (rvy > 0) ? -1 : 1;  // Hit on y-axis
  } else {
    // Equal: corner hit, prefer x for consistency
    nx = (rvx > 0) ? -1 : 1;
  }

  return { time: entryTime, normal: { x: nx, y: ny } };
}