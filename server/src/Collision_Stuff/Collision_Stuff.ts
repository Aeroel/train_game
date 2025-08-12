import { Assert } from "#root/Assert.js";
import type { Player } from "#root/Entities/Player.js";
import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Box, Direction, Position, Collision_Info,  } from "#root/Type_Stuff.js";

import { Subpositions_Loop } from "#root/Collision_Stuff/Subpositions_Loop.js";
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
    const  prelude = Collision_Stuff.Get_Prelude_To_Subpositions_Loop(entityA, entityB);

    const result: Collision_Info = {
   
      Position_Just_Before_Collision_A: { x: entityA.x, y: entityA.y },
      Position_Just_Before_Collision_B: { x: entityB.x, y: entityB.y },
      
      Last_Box_Just_Before_Collision_A:
        {
      x:entityA.x,
    y:entityA.y,
    width:entityA.width,
    height:entityA.height,
      },
     Last_Box_Just_Before_Collision_B: {
      x:entityB.x,
      y:entityB.y,
      width:entityB.width,
      height:entityB.height
    },
    Starting_Position_A: { x: entityA.x, y: entityA.y },
    Starting_Position_B: { x: entityB.x, y: entityB.y },
    Theoretical_Ending_Position_A: prelude.entityAEndingPosition,
    Theoretical_Ending_Position_B: prelude.entityBEndingPosition,
    entityA,
    entityB,
    };


    let Collision_Occurred = false;

   
    const loop = new Subpositions_Loop(entityA, entityB);
    loop.run((index: number, subA: Box, subB: Box) => {
      if (Collision_Stuff.checkForIntersection(subA, subB)) {
        Collision_Occurred = true;
        loop.stop();
        return;
      }
      result.Position_Just_Before_Collision_A = { x: subA.x, y: subA.y }
      result.Position_Just_Before_Collision_B = { x: subB.x, y: subB.y }
      result.Last_Box_Just_Before_Collision_A = subA;
      result.Last_Box_Just_Before_Collision_B = subB;
    })
   
    if(Collision_Occurred) {
      return result;
    }
    
    return null;

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

  static Get_Prelude_To_Subpositions_Loop(entityA: Base_Entity, entityB: Base_Entity) {
    if (!entityA.hasTag("Entity") || !entityB.hasTag("Entity")) {
      throw new Error(`Both arguments must be entities`)
    }
    const entityAStartingPosition: Position = { x: entityA.x, y: entityA.y };
    const entityBStartingPosition: Position = { x: entityB.x, y: entityB.y };

    const entityAEndingPosition: Position = entityA.calculateNextPositionBasedOnForcesAndDeltaTime();
    const entityBEndingPosition: Position = entityB.calculateNextPositionBasedOnForcesAndDeltaTime();

    const entitiesSubpositionsArrays = Collision_Stuff.getSubpositions(entityAStartingPosition, entityAEndingPosition, entityBStartingPosition, entityBEndingPosition);

    const entityASubpositions = entitiesSubpositionsArrays.entityA;
    const entityBSubpositions = entitiesSubpositionsArrays.entityB;

    return { entitiesSubpositionsArrays, entityASubpositions, entityBSubpositions,
    entityAEndingPosition,
      entityBEndingPosition,
    };
  }


  static getSubpositions(entityAStartingPosition: Position, entityAEndingPosition: Position, entityBStartingPosition: Position, entityBEndingPosition: Position) {

    // here begins determination of how long each array will be. It is a single number
    const entityADeltaX = entityAEndingPosition.x - entityAStartingPosition.x;
    const entityADeltaY = entityAEndingPosition.y - entityAStartingPosition.y;

    const entityATheoreticalLength = Math.max(Math.abs(entityADeltaX), Math.abs(entityADeltaY));


    const entityBDeltaX = entityBEndingPosition.x - entityBStartingPosition.x;
    const entityBDeltaY = entityBEndingPosition.y - entityBStartingPosition.y;

    const entityBTheoreticalLength = Math.max(Math.abs(entityBDeltaX), Math.abs(entityBDeltaY));

    let finalLength = Math.round((Math.max(entityATheoreticalLength, entityBTheoreticalLength)));

    // now we know the length. Make two arrays.

    const entityASubpositions = [{ ...entityAStartingPosition },
    ];
    const entityBSubpositions = [
      { ...entityBStartingPosition }
    ];

    const AChangePerSubStepX = entityADeltaX / finalLength;
    const AChangePerSubStepY = entityADeltaY / finalLength;

    const BChangePerSubStepX = entityBDeltaX / finalLength;
    const BChangePerSubStepY = entityBDeltaY / finalLength;

    for (let i = 1; i < finalLength; i++) {
      const ASubpos = {
        x: entityAStartingPosition.x + (i * AChangePerSubStepX),
        y: entityAStartingPosition.y + (i * AChangePerSubStepY),
      };
      entityASubpositions.push(ASubpos);

      const BSubpos = {
        x: entityBStartingPosition.x + (i * BChangePerSubStepX),
        y: entityBStartingPosition.y + (i * BChangePerSubStepY),
      };
      entityBSubpositions.push(BSubpos);

    }

    entityASubpositions.push({ ...entityAEndingPosition });
    entityBSubpositions.push({ ...entityBEndingPosition });

    // now subpositions are ready, send them to callee
    return {
      entityA: entityASubpositions,
      entityB: entityBSubpositions,
      lengthOfEither: entityBSubpositions.length,
    };
  }


  static checkTouchOrIntersect(boxA: Box, boxB: Box) {
    const { x: x1, y: y1, width: w1, height: h1 } = boxA;
    const { x: x2, y: y2, width: w2, height: h2 } = boxB;

    return !(x1 + w1 < x2 || // Entity A is to the left of Entity B
      x2 + w2 < x1 || // Entity B is to the left of Entity A
      y1 + h1 < y2 || // Entity A is above Entity B
      y2 + h2 < y1);   // Entity B is above Entity A
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


