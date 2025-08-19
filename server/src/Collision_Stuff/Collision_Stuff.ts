import { Assert } from "#root/Assert.js";
import type { Player } from "#root/Entities/Player.js";
import  { Helper_Functions } from "#root/Helper_Functions.js";
import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Box, Direction, Position, Collision_Info,  } from "#root/Type_Stuff.js";
import { Check_For_Collision} from "#root/Collision_Stuff/Check_For_Collision.js"
import { Collision_Broad_Phase_Check } from "#root/Collision_Stuff/Collision_Broad_Phase_Check.js"
import {World} from "#root/World.js"
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
        
      
          const collisionInfo = Collision_Stuff.checkForCollision(entity, other);
      
          if (collisionInfo) {
            allCollisions.push(collisionInfo);
          }
        });
      if(allCollisions.length===0)  { 
      return [];
      }
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
    Assert.notNull(onlyColl);
    return onlyColl;
  }



  const entityStart = collisions[0].Starting_Position_A;

  let closest: Collision_Info = collisions[0];
  
  Assert.notNull(closest)
  
  let minDistSq = Helper_Functions.distSq(entityStart, closest.Position_Just_Before_Collision_A);

  for (let i = 1; i < collisions.length; i++) {
    const curr: Collision_Info = collisions[i];
          Assert.notNull(curr)
    const currDistSq = Helper_Functions.distSq(entityStart, curr.Position_Just_Before_Collision_A);

    if (currDistSq < minDistSq) {
      closest = curr;
      minDistSq = currDistSq;
    }
  }

  return closest;
}
 
 static areCloseEnoughToBotherLookingForACollisionFurther(a: Base_Entity, b: Base_Entity): boolean {
   return Collision_Broad_Phase_Check.areCloseEnoughForCollisionCheck(a, b);
 }

static checkForCollision(entityA: Base_Entity, entityB: Base_Entity): Collision_Info | null {
  return Check_For_Collision(entityA, entityB);
}



  
  




}


