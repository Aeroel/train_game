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
      if (Sub_Positions.testForTouch(subA, subB)) {
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
    finalLength = finalLength * 5;

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



/**
 * Tests if two boxes are touching or overlapping
 * Returns true when boxes share area OR when they're just touching at edges/corners
 * @param boxA First box with x, y, w, h properties
 * @param boxB Second box with x, y, w, h properties
 * @returns true if boxes are touching or overlapping, false if separated
 */
static testForTouch(boxA: Box, boxB: Box): boolean {
  // Check if boxes are separated (not touching)
  return !(
    boxA.x > boxB.x + boxB.width ||      // A starts after B ends (gap between them)
    boxA.x + boxA.width < boxB.x ||      // A ends before B starts (gap between them)
    boxA.y > boxB.y + boxB.height ||      // A starts below B (gap between them)
    boxA.y + boxA.height < boxB.y         // A ends above B (gap between them)
  );
}
}

