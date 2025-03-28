import type { Base_Entity } from "./Entities/Base_Entity.js";
import type { Position } from "./Some_Common_Types.js";

export { Collision_Stuff };

type Box = {
  x: number,
  y: number,
  width: number,
  height: number
}

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
  static areEntitiesTouching(entityA: Base_Entity, entityB: Base_Entity) {
    if (!entityA.hasTag("Entity") || !entityB.hasTag("Entity")) {
      throw new Error(`Both arguments must be entities`)
    }
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



  }

  static Get_Prelude_To_Subpositions_Loop(entityA : Base_Entity, entityB : Base_Entity) {
    const entityAStartingPosition: Position = { x: entityA.x, y: entityA.y };
    const entityBStartingPosition: Position = { x: entityB.x, y: entityB.y };

    const entityAEndingPosition: Position = entityA.calculateNextPositionBasedOnForcesAndDeltaTime();
    const entityBEndingPosition: Position = entityB.calculateNextPositionBasedOnForcesAndDeltaTime();

    const entitiesSubpositionsArrays = Collision_Stuff.getSubpositions(entityAStartingPosition, entityAEndingPosition, entityBStartingPosition, entityBEndingPosition);

    const entityASubpositions = entitiesSubpositionsArrays.entityA;
    const entityBSubpositions = entitiesSubpositionsArrays.entityB;

    return { entitiesSubpositionsArrays, entityASubpositions, entityBSubpositions };
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


}