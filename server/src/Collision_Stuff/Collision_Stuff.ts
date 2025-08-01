import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Box, Position, Collision_Info} from "#root/Type_Stuff.js";
import { Subpositions_Loop } from "#root/Collision_Stuff/Subpositions_Loop.js";
import {World} from "#root/World.js"
export { Collision_Stuff, };
class Collision_Stuff {
  static Do_Entities_Touch_Through_All_Tick_Subpositions(entityA: Base_Entity, entityB: Base_Entity) {
    const { entitiesSubpositionsArrays, entityASubpositions, entityBSubpositions } = Collision_Stuff.Get_Prelude_To_Subpositions_Loop(entityA, entityB);
    let Do_Entities_Collide_At_All_Subpositions = true;

    for (let i = 0; i < entitiesSubpositionsArrays.lengthOfEither; i++) {
      const subEA = {
        width: entityA.width,
        height: entityA.height,
        x: entityASubpositions[i].x,
        y: entityASubpositions[i].y,
      };
      const subEB = {
        width: entityB.width,
        height: entityB.height,
        x: entityBSubpositions[i].x,
        y: entityBSubpositions[i].y,
      };

      if (!Collision_Stuff.checkTouchOrIntersect(subEA, subEB)) {
        Do_Entities_Collide_At_All_Subpositions = false;
        return Do_Entities_Collide_At_All_Subpositions;
      }

    }


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
  const BASE_DISTANCE = 1000;

  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distanceSquared = dx * dx + dy * dy;

  const aSpeed = a.speedPerTick ?? 0;
  const bSpeed = b.speedPerTick ?? 0;
  const effectiveRange = BASE_DISTANCE - (aSpeed + bSpeed);

  if (effectiveRange <= 0) return true;

  return distanceSquared <= effectiveRange * effectiveRange;
}



 
  static areEntitiesIntersecting(entityA: Base_Entity, entityB: Base_Entity) {
    let Collision_Occurred = false;
    let Position_Before_Collision_A: Position = { x: entityA.x, y: entityA.y };
    let Position_Before_Collision_B: Position = { x: entityB.x, y: entityB.y };

    const Starting_Position_A: Position = { x: entityA.x, y: entityA.y };
    const Starting_Position_B: Position = { x: entityB.x, y: entityB.y };
    
   const  prelude = Collision_Stuff.Get_Prelude_To_Subpositions_Loop(entityA, entityB);;
    const Theoretical_Ending_Position_A = prelude.entityAEndingPosition;
    const Theoretical_Ending_Position_B = prelude.entityBEndingPosition;
   
    const loop = new Subpositions_Loop(entityA, entityB);
    loop.run((index: number, subA: Box, subB: Box) => {
      if (Collision_Stuff.checkForIntersection(subA, subB)) {
        Collision_Occurred = true;
        loop.stop();
      }
      Position_Before_Collision_A = { x: subA.x, y: subA.y }
      Position_Before_Collision_B = { x: subB.x, y: subB.y }
    })


    const result: Collision_Info = { Collision_Occurred,
    Position_Before_Collision_A, Position_Before_Collision_B,
    Starting_Position_A,
    Starting_Position_B,
    Theoretical_Ending_Position_A,
    Theoretical_Ending_Position_B,
    entityA,
    entityB };
    return result;

  }
  static Did_A_Collision_Occur_And_What_Is_The_Position_Just_Before_Collision(entityA: Base_Entity, entityB: Base_Entity) {


    let Collision_Occurred = false;
    let Position_Before_Collision_A: Position = { x: entityA.x, y: entityA.y };
    let Position_Before_Collision_B: Position = { x: entityB.x, y: entityB.y };


    const loop = new Subpositions_Loop(entityA, entityB);
    loop.run((index: number, subA: Box, subB: Box) => {
      if (Collision_Stuff.checkTouchOrIntersect(subA, subB)) {
        Collision_Occurred = true;
        loop.stop();
      }
      Position_Before_Collision_A = { x: subA.x, y: subA.y }
      Position_Before_Collision_B = { x: subB.x, y: subB.y }
    })


    const result = { Collision_Occurred, Position_Before_Collision_A, Position_Before_Collision_B };
    return result;


  }
  static areEntitiesTouching(entityA: Base_Entity, entityB: Base_Entity): boolean {
    const { entitiesSubpositionsArrays, entityASubpositions, entityBSubpositions } = Collision_Stuff.Get_Prelude_To_Subpositions_Loop(entityA, entityB);

    let collHappenedAtAnyTime = false;

    for (let i = 0; i < entitiesSubpositionsArrays.lengthOfEither; i++) {
      const subEA = {
        width: entityA.width,
        height: entityA.height,
        x: entityASubpositions[i].x,
        y: entityASubpositions[i].y,
      };
      const subEB = {
        width: entityB.width,
        height: entityB.height,
        x: entityBSubpositions[i].x,
        y: entityBSubpositions[i].y,
      };

      if (Collision_Stuff.checkTouchOrIntersect(subEA, subEB)) {
        collHappenedAtAnyTime = true;
        return collHappenedAtAnyTime;
      }

    }

    return collHappenedAtAnyTime;


  }

  static Which_Side_Of_Entity_Is_Facing_Another_Entity(a: Box, b: Box) {
    const aRight = a.x + a.width;
    const aBottom = a.y + a.height;
    const bRight = b.x + b.width;
    const bBottom = b.y + b.height;

    const xOverlap = a.x < bRight && aRight > b.x;
    const yOverlap = a.y < bBottom && aBottom > b.y;

    if (xOverlap && yOverlap) {
        throw new Error("Rectangles intersect; facing direction is undefined.");
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
static getAllCollisions(
  entity: Base_Entity,
  filterFn: (other: Base_Entity) => boolean
): Collision_Info[] {
  const allCollisions: Collision_Info[] = [];

  World.getCurrentEntities().forEach((other) => {
    if (entity === other) return;

    if (!filterFn(other)) return;

    if (!Collision_Stuff.areCloseEnoughToBotherLookingForACollisionFurther(entity, other)) {
      return;
    }

    const collisionInfo = Collision_Stuff.areEntitiesIntersecting(entity, other);

    if (collisionInfo.Collision_Occurred) {
      allCollisions.push(collisionInfo);
    }
  });

  return allCollisions;
}

static getClosestCollision(
  entity: Base_Entity,
  filterFn: (other: Base_Entity) => boolean
): Collision_Info | null {
  const allDetectedCollPairs = Collision_Stuff.getAllCollisions(entity, filterFn);

  if (allDetectedCollPairs.length === 0) {
    return null;
  }

  if (allDetectedCollPairs.length === 1) {
    return allDetectedCollPairs[0];
  }

  // Helper: squared distance between two positions
  function distSq(a: Position, b: Position): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  const entityStart = allDetectedCollPairs[0].Starting_Position_A;

  let closest: Collision_Info = allDetectedCollPairs[0];
  let minDistSq = distSq(entityStart, closest.Position_Before_Collision_A);

  for (let i = 1; i < allDetectedCollPairs.length; i++) {
    const curr = allDetectedCollPairs[i];
    const currDistSq = distSq(entityStart, curr.Position_Before_Collision_A);

    if (currDistSq < minDistSq) {
      closest = curr;
      minDistSq = currDistSq;
    }
  }

  return closest;
}



}


