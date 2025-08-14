import { Assert } from "#root/Assert.js";
import type { Player } from "#root/Entities/Player.js";
import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Box, Direction, Position, Collision_Info,  } from "#root/Type_Stuff.js";
import { Check_For_Collision} from "#root/Collision_Stuff/Check_For_Collision.js"
import {World} from "#root/World.js"
export { Collision_Stuff, };
class Collision_Stuff {
  static Do_Entities_Intersect_In_Every_Subposition(entityA: Base_Entity, entityB: Base_Entity) {
    let doThey = true;

    


  }
  static checkForIntersection(a: Box, b: Box): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
 
 static areCloseEnoughToBotherLookingForACollisionFurther(a: Base_Entity, b: Base_Entity): boolean {
   // the base idea is that we have a general area if the entities are within, we will bother checking collision.
  const BASE_DISTANCE = 200;

  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distanceSquared = dx * dx + dy * dy;

  const aSpeed = a.speedPerTick ?? 0;
  const bSpeed = b.speedPerTick ?? 0;
  const effectiveRange = BASE_DISTANCE - (aSpeed + bSpeed);

  if (effectiveRange <= 0) return true;

  return distanceSquared <= effectiveRange * effectiveRange;
}

static checkForCollision(entityA: Base_Entity, entityB: Base_Entity): Collision_Info | null {
  return Check_For_Collision(entityA, entityB);
}


  static With_Which_Sides_Do_Two_Entities_Face_Each_Other(a: Box, b: Box):
  {aFace: Direction, bFace: Direction} | null
  {
    const aRight = a.x + a.width;
    const aBottom = a.y + a.height;
    const bRight = b.x + b.width;
    const bBottom = b.y + b.height;

    const xOverlap = a.x < bRight && aRight > b.x;
    const yOverlap = a.y < bBottom && aBottom > b.y;
    const intersects = xOverlap && yOverlap;
    if (intersects) {
      
         return null;
    }

    // If they are vertically apart (priority)
    if (!yOverlap) {
        if (aBottom <= b.y) {
            return { aFace: "down", bFace: "up" };
        }
        if (bBottom <= a.y) {
            return { aFace: "up", bFace: "down" };
        }
    }
  
    // Otherwise use horizontal position
    if (aRight <= b.x) {
        return { aFace: "right", bFace: "left" };
    }
    if (bRight <= a.x) {
        return { aFace: "left", bFace: "right" };
    }

    throw new Error("Rectangles are ambiguous or overlapping in unexpected way.");
  }
  
  
static findAllCollisions(
  entity: Base_Entity,
  filterFn: (other: Base_Entity) => boolean
): Collision_Info[] | null {
  const allCollisions: Collision_Info[] = [];

  World.getCurrentEntities().forEach((other) => {
    if (entity === other) return;

    if (!Collision_Stuff.areCloseEnoughToBotherLookingForACollisionFurther(entity, other)) {
      return;
    }
    
    if (!filterFn(other)) return;
  

    const collisionInfo = Collision_Stuff.checkForCollision(entity, other);

    if (collisionInfo) {
      allCollisions.push(collisionInfo);
    }
  });
if(allCollisions.length===0)  { 
return null;
}
  return allCollisions;
}


static getClosestCollision(
  entity: Base_Entity,
  filterFn: (other: Base_Entity) => boolean
): Collision_Info | null {
  const allDetectedCollPairs = Collision_Stuff.findAllCollisions(entity, filterFn);

  if (allDetectedCollPairs === null) {
    return null;
  }

  if (allDetectedCollPairs.length === 1) {
    const onlyColl = allDetectedCollPairs[0];
    Assert.notNull(onlyColl);
    return onlyColl;
  }

  // Helper: squared distance between two positions
  function distSq(a: Position, b: Position): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  const entityStart = allDetectedCollPairs[0].Starting_Position_A;

  let closest: Collision_Info = allDetectedCollPairs[0];
  
  Assert.notNull(closest)
  
  let minDistSq = distSq(entityStart, closest.Position_Just_Before_Collision_A);

  for (let i = 1; i < allDetectedCollPairs.length; i++) {
    const curr: Collision_Info = allDetectedCollPairs[i];
          Assert.notNull(curr)
    const currDistSq = distSq(entityStart, curr.Position_Just_Before_Collision_A);

    if (currDistSq < minDistSq) {
      closest = curr;
      minDistSq = currDistSq;
    }
  }

  return closest;
}



}


