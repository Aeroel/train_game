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

    }
}