import { Assert } from "#root/Assert.js";
import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Box, Direction, Position, Collision_Info,  } from "#root/Type_Stuff.js";

import { Sub_Positions_Loop } from "#root/Collision_Stuff/Collision_Checking_Methods/Sub_Positions/Sub_Positions_Loop.js";
import {World} from "#root/World.js"

export { Sub_Positions, };
class Sub_Positions {

 

static Check_For_Collision(entityA: Base_Entity, entityB: Base_Entity): Collision_Info | null {
    const  prelude = Sub_Positions.Get_Prelude_To_Subpositions_Loop(entityA, entityB);

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

   
    const loop = new Sub_Positions_Loop(entityA, entityB);
    loop.run((index: number, subA: Box, subB: Box) => {
      if (Sub_Positions.checkForIntersection(subA, subB)) {
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
      
         throw new Error("Enteties intersect, did not determine facing faces")
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

    const entitiesSubpositionsArrays = Sub_Positions.getSubpositions(entityAStartingPosition, entityAEndingPosition, entityBStartingPosition, entityBEndingPosition);

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
    finalLength = finalLength * 4;

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


  static checkForIntersection(a: Box, b: Box): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
}

