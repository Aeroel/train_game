export { Collision_Stuff };

class Collision_Stuff {
    static areEntitiesTouching(entityA, entityB) {
        const entityAStartingPosition = { x: entityA.x, y: entityA.y };
        const entityBStartingPosition = { x: entityB.x, y: entityB.y };

        const entityAEndingPosition = entityA.calculateNextPositionBasedOnForcesAndDeltaTime();
        const entityBEndingPosition = entityB.calculateNextPositionBasedOnForcesAndDeltaTime();

        const entitiesTickSubPositionsArrays = Collision_Stuff.getSubPositionsWithinTick(entityAStartingPosition, entityAEndingPosition, entityBStartingPosition, entityBEndingPosition);

        entityASubPositionsWithinTick = entitiesTickSubPositionsArrays.entityA;
        entityBSubPositionsWithinTick = entitiesTickSubPositionsArrays.entityB;

        const subPosIndex = 0;


    }
    static getSubPositionsWithinTick(entityAStartingPosition, entityAEndingPosition, entityBStartingPosition, entityBEndingPosition) {
      
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
       
       for(i=1;i<finalLength;i++) {
         const ASubpos = {
           x:(i*AChangePerSubStepX),
           y:(i*AChangePerSubStepY),
         };
        Collision_Stuff.insertElementJustBeforeLastElem(ASubpos, entityASubpositions);
        
          const BSubpos = {
           x:(i*BChangePerSubStepX),
           y:(i*BChangePerSubStepY),
         };
        Collision_Stuff.insertElementJustBeforeLastElem(BSubpos, entityBSubpositions);
        
       }
       
       // now subpositions are ready, send them to callee
       return {
         entityA:entityASubpositions, 
         entityB:entityBSubpositions,
       };
    }
    static insertElementJustBeforeLastElem(elem, targetArray) {
      targetArray.splice(targetArray.length - 1, 0, elem);
    }
}