import { My_Assert } from "#root/My_Assert.js";
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
    My_Assert.notNull(onlyColl);
    return onlyColl;
  }



  const entityStart = {
    x: collisions[0].entityA.x,
    y: collisions[0].entityA.y
    };

  let closest: Collision_Info = collisions[0];
  
  My_Assert.notNull(closest)
  
  let minDistSq = Helper_Functions.distSq(entityStart, closest.Position_Just_Before_Collision_A);

  for (let i = 1; i < collisions.length; i++) {
    const curr: Collision_Info = collisions[i];
          My_Assert.notNull(curr)
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

// assumption for using this: a collision actually occurred and you want to know which face of entity A is looking at entity B. The provided positions must be just a sliver before actual collision points. entity's velocities are used in the corner case
static calculateFaces(a: Box, b: Box, avx: number, avy:number, bvx: number, bvy: number):{ aFacingB: Direction, bFacingA: Direction} {
  
  console.log(a,b)
  My_Assert.that(this.boxesCollide(a,b) === false, "calculateFaces does not want to calculate if provided boxes are at collsion points");
  let aFacingB: Direction | null = null;

  const dirsToTry: Direction[] = ["right", "down", "up", "left"];

  dirsToTry.forEach(dir => {
 const tempA = {...a}
    switch(dir) {
    case "right":
      tempA.width += 999999;
      if(this.boxesCollide(tempA, b)) {
        aFacingB = "right";
      }
    break;
        case "left":
      tempA.width += 999999;
      tempA.x -= 99999;
      if(this.boxesCollide(tempA, b)) {
        aFacingB = "left";
      }
    break;
        case "up":
      tempA.height += 9999999;
      tempA.y -= 999999;
      if(this.boxesCollide(tempA, b)) {
        aFacingB = "up";
      }
      break;
         case "down":
      tempA.height += 999999;
      if(this.boxesCollide(tempA, b)) {
        aFacingB = "down";
      }
    break;
    }
  })
  // during a collision this presumably only happens in a corner case where A is above B to B's left or something like that so neither projecting A just down or just right will detect overlap. In this case I guess I can just use A's velocity and pick an axis 
  if(aFacingB === null) {
     aFacingB= this.cornerFace(avx, avy, bvx, bvy);
  }

  // end
  My_Assert.that(aFacingB !== null, "In the end, aFacingB must be assigned")
  const bFacingA = Helper_Functions.getOppositeDirection(aFacingB);
  return {aFacingB, bFacingA}
}

static cornerFace(avx: number, avy: number, bvx: number, bvy: number) : Direction {
  My_Assert.that(avx > 0 || avy > 0 || bvx > 0 || bvy > 0, "Calling cornerFace on zero velocities of both entities is invalid...")
  
 let face: Direction | null = null;
  const AVelAttempt = this.axisVelToFace(avx, avy)
  if(AVelAttempt) {
     face = AVelAttempt;
  } else {
    face = this.axisVelToFace(bvx, bvy);
  }
  
   My_Assert.notNull(face, "face must be assigned at this point!" )
  return face;
}

static axisVelToFace(vx: number, vy: number) : Direction | null {
  let face: Direction | null = null;
      if(vx >0) {
      face = "right"
    } else if(vx<0) {
      face="left"
    } else if(vy>0){
      face="down"
    }else if (vy<0){
      face="up"
    } else {
      face = null;
    }
    return face;
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

static posToBox(en: Base_Entity, pos: Position) : Box {
  return {
    height: en.height,
    width: en.width,
    ...pos
  }
}
  


  




}


