import { My_Assert } from "#root/My_Assert.js";
import type { Player } from "#root/Entities/Player.js";
import  { Helper_Functions } from "#root/Helper_Functions.js";
import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Box, Direction, Position, Collision_Info, Box_With_Velocity, Face, Normal  } from "#root/Type_Stuff.js";
import { Check_For_Collision} from "#root/Collision_Stuff/Check_For_Collision.js"
import { Collision_Broad_Phase_Check } from "#root/Collision_Stuff/Collision_Broad_Phase_Check.js"
import {World} from "#root/World.js"
import {World_Tick} from "#root/World_Tick.js"
export { Collision_Stuff, };
class Collision_Stuff {
 
 static findCollisions(
  entity: Base_Entity,
  filterFn?: (other: Base_Entity) => boolean
): Collision_Info[] {
        const allCollisions: Collision_Info[] = [];
      const filterOrAll = filterFn ?? (() => true);

        World.getCurrentEntities().forEach((other) => {
          if (entity === other) return;
      
          if (!Collision_Stuff.areCloseEnoughToBotherLookingForACollisionFurther(entity, other)) {
            return;
          }
          
          if (!filterOrAll(other)) return;
        
      
          const collisionInfo = Collision_Stuff.Check_For_Collision(entity, other);
      
          if (collisionInfo) {
            allCollisions.push(collisionInfo);
          }
        });
      if(allCollisions.length===0)  { 
      return [];
      }

        return allCollisions;
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
 
 static areCloseEnoughToBotherLookingForACollisionFurther(a: Base_Entity, b: Base_Entity): boolean {
   return Collision_Broad_Phase_Check.areCloseEnoughForCollisionCheck(a, b);
 }

static Check_For_Collision(entityA: Base_Entity, entityB: Base_Entity): Collision_Info | null {
  return Check_For_Collision(entityA, entityB);
}


  static boxesCollide(box1: Box, box2: Box): boolean {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y
  );
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
  




}


