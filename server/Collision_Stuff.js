export { Collision_Stuff };

class Collision_Stuff {
    static areEntitiesTouching(entityA, entityB) {
        const entityAStartingPosition = { x: entityA.x, y: entityA.y };
        const entityBStartingPosition = { x: entityB.x, y: entityB.y };

        const entityAEndingPosition = entityA.calculateNextPositionBasedOnForcesAndDeltaTime();
        const entityBEndingPosition = entityB.calculateNextPositionBasedOnForcesAndDeltaTime();

        const entitiesSubpositionsArrays = Collision_Stuff.getSubpositions(entityAStartingPosition, entityAEndingPosition, entityBStartingPosition, entityBEndingPosition);

        entityASubpositions = entitiesSubpositionsArrays.entityA;
        entityBSubpositions = entitiesSubpositionsArrays.entityB;
        
        let collHappenedAtAnyTime = false;

      for(let i=0;i<entitiesSubpositionsArrays.lengthOfEither;i++) {
        const subEA = {
          width: entityA.width,
          height: entityA.height,
          x: entityASubPositions[i].x,
          y: entityASubPositions[i].y,
        };
        const subEB = {
          width: entityB.width,
          height: entityB.height,
          x: entityBSubPositions[i].x,
          y: entityBSubPositions[i].y,
        }
        
        if(checkTouchOrIntersect(subEA, subEB)) {
          collHappenedAtAnyTime = true;
          return collHappenedAtAnyTime;
        }
        
      }
        


    }
    static getSubpositions(entityAStartingPosition, entityAEndingPosition, entityBStartingPosition, entityBEndingPosition) {
      
      // here begins determination of how long each array will be. It is a single number
      const entityADeltaX = entityAEndingPosition.x - entityAStartingPosition.x;
     const  entityADeltaY = entityAEndingPosition.y - entityAStartingPosition.y;
       
       const entityATheoreticalLength = Math.max(Math.abs(entityADeltaX, entityADeltaY));
       
       
             const entityBDeltaX = entityBEndingPosition.x - entityBStartingPosition.x;
     const  entityBDeltaY = entityBEndingPosition.y - entityBStartingPosition.y;
       
       const entityBTheoreticalLength = Math.max(Math.abs(entityBDeltaX, entityBDeltaY));
       
       const offsetToAccountForStartAndEndXY = 2;
       const finalLength = ( Math.max(entityATheoreticalLength, entityBTheoreticalLength)) - offsetToAccountForStartAndEndXY;
       
       // now we know the length. Make two arrays.
       
       const entityASubpositions = [{...entityAStartingPosition},
       {...entityAEndingPosition}
       ];
       const entityBSubpositions = [
         {...entityBStartingPosition},
         {...entityBEndingPosition}
         ];

         const AChangePerSubStepX = entityADeltaX / finalLength;
          const AChangePerSubStepY = entityADeltaY / finalLength;
  
           const BChangePerSubStepX = entityBDeltaX / finalLength;
          const BChangePerSubStepY = entityBDeltaY / finalLength; 
       
       for(let i=1;i<finalLength;i++) {
         const ASubpos = {
           x:entityAStartingPosition.x + (i*AChangePerSubStepX),
           y:entityAStartingPosition.y + (i*AChangePerSubStepY),
         };
        Collision_Stuff.insertElementJustBeforeLastElem(ASubpos, entityASubpositions);
        
          const BSubpos = {
           x:entityBStartingPosition.x + (i*BChangePerSubStepX),
           y:entityBStartingPosition.y + (i*BChangePerSubStepY),
         };
        Collision_Stuff.insertElementJustBeforeLastElem(BSubpos, entityBSubpositions);
        
       }
       
       // now subpositions are ready, send them to callee
       return {
         entityA:entityASubpositions, 
         entityB:entityBSubpositions,
         lengthOfEither:finalLength,
       };
    }
    static insertElementJustBeforeLastElem(elem, targetArray) {
      targetArray.splice(targetArray.length - 1, 0, elem);
    }
    
static checkTouchOrIntersect(entityA, entityB) {
    const { x: x1, y: y1, width: w1, height: h1 } = entityA;
    const { x: x2, y: y2, width: w2, height: h2 } = entityB;

    return !(x1 + w1 < x2 || // Entity A is to the left of Entity B
             x2 + w2 < x1 || // Entity B is to the left of Entity A
             y1 + h1 < y2 || // Entity A is above Entity B
             y2 + h2 < y1);   // Entity B is above Entity A
          }


}