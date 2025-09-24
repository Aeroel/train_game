import { My_Assert } from "#root/My_Assert.js";
import type { Player } from "#root/Entities/Player.js";
import  { Helper_Functions } from "#root/Helper_Functions.js";
import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Box, Direction, Position, Collision_Info, Box_With_Velocity, Face, Normal  } from "#root/Type_Stuff.js";
import { Check_For_Collision} from "#root/Collision_Stuff/Check_For_Collision.js"
import { Expand_entities_by_their_velocities_and_check_whether_they_might_collide } from "#root/Collision_Stuff/Collision_Broad_Phase_Check.js"
import {World} from "#root/World.js"
import {World_Tick} from "#root/World_Tick.js"
export { Collision_Stuff, };
class Collision_Stuff {
 static Increase_hitbox_when_checking_by = 2;
 static findCollisions(
  entity: Base_Entity,
  filterFn?: (other: Base_Entity) => boolean
): Collision_Info[] {
        const allCollisions: Collision_Info[] = [];
      const filterOrAll = filterFn ?? (() => true);

        World.getCurrentEntities().forEach((other) => {
          if (entity === other) return;
          if(!Expand_entities_by_their_velocities_and_check_whether_they_might_collide(entity, other)) {
            return;
          }
          
          if (!filterOrAll(other)) return;
        
      
          const collisionInfo = Collision_Stuff.Precise_collision_check(entity, other);
      
          if (collisionInfo) {
            allCollisions.push(collisionInfo);
          }
        });
      if(allCollisions.length===0)  { 
      return [];
      }
      const sortClosestFirst = (a: Collision_Info, b: Collision_Info) => a.time - b.time;
       allCollisions.sort(sortClosestFirst);
        return allCollisions;
}
 
 static getClosestCollision(
  entity: Base_Entity,
  filterFn?: (other: Base_Entity) => boolean
): Collision_Info | null {
  const collisions = Collision_Stuff.findCollisions(entity, filterFn);

  if (collisions.length === 0) {
    return null;
  }

  if (collisions.length === 1) {
    const onlyColl = collisions[0];
    My_Assert.notNull(onlyColl);
    return onlyColl;
  }
  const sortedFromClosestToFarthest = collisions.toSorted((a, b) => a.time - b.time);



  return sortedFromClosestToFarthest[0];
}
 
 static getClosestCollisionsWithSameTime(
  entity: Base_Entity,
  filterFn?: (other: Base_Entity) => boolean
): Collision_Info[] {
  const collisions = Collision_Stuff.findCollisions(entity, filterFn);

  if (collisions.length === 0) {
    return [];
  }

  // Get the closest time
  const closestTime = collisions[0].time; // already sorted in findCollisions
  const EPS = 1e-9;

  // Collect all with effectively the same time
  return collisions.filter(c => Math.abs(c.time - closestTime) < EPS);
}
 
 
 
    static normalToFace(normal: Normal) : Face {

  if(normal.x ===1 ) {
    return "right";
  }  
  if(normal.x === -1 ) {
    return "left";
  } 
  if(normal.y ===1 ) {
    return "bottom";
  } 
  if(normal.y === -1 ) {
    return "top";
  } 
  throw Error(`Invalid normal ${JSON.stringify(normal)}`)
}

static getOppositeFace(face: Face): Face {
  if(face ==="bottom") {
    return "top"
  }
  if(face ==="top") {
    return "bottom"
  }
  if(face ==="left") {
    return "right"
  }
  if(face ==="right") {
    return "left"
  }
  throw new Error(`Could not determine opposite face ${face}`)
}




static Precise_collision_check(entityA: Base_Entity, entityB: Base_Entity): Collision_Info | null {
  return Check_For_Collision(entityA, entityB);
}
static Check_For_Collision(entityA: Base_Entity, entityB: Base_Entity): Collision_Info | null {
 if(!Expand_entities_by_their_velocities_and_check_whether_they_might_collide(entityA, entityB)) {
   return null;
 }
  return this.Precise_collision_check(entityA, entityB);
}

  static static_No_Velocity_Collision_Check(boxA: Box, boxB: Box): boolean {
return (
      boxA.x < boxB.x + boxB.width &&
      boxA.x + boxA.width > boxB.x &&
      boxA.y < boxB.y + boxB.height &&
      boxA.y + boxA.height > boxB.y
    )

}


static entityToBox(a: Base_Entity,): Box{
   return {
     y:a.y,
     x:a.x,
     width:a.width,
     height:a.height,
   }
}

static entityToBoxWithVelocity(en: Base_Entity) : Box_With_Velocity {
  return {
    height: en.height,
    width: en.width,
    x: en.x,
    y: en.y,
    vx: en.vx,
    vy: en.vy,
  }
}
static posToBox(en: Base_Entity, pos: Position) : Box {
  return {
    height: en.height,
    width: en.width,
    ...pos
  }
}
  

static timeToPosition(entity: Base_Entity, time: number) : Position {
  const dt = World_Tick.deltaTime;
  return {
    x: entity.x + (entity.vx * dt * time),
    y: entity.y + (entity.vy * dt * time),
  }
}

static increaseBoxSizeBy(
  box: Box_With_Velocity,
  amount: number
): Box_With_Velocity {
  return {
    ...box,
    x: box.x - amount,
    y: box.y - amount,
    width: box.width + amount * 2,
    height: box.height + amount * 2,
  }
}


}


