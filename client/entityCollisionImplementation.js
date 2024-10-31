import { equalizePositionSteps, getPositionsPerTick } from "./entityMovementImplementation.js";
export { handleCollision }
// Collision handling function
function handleCollision(entity, otherEntity) {
    let anyCollisionOccurred = false;
    // Generate equalized subpositions for both entities.
    const { entity1Pos: entityPosArray, entity2Pos: otherEntityPosArray } = equalizePositionSteps(
        entity.getPositionsPerTick(),
        otherEntity.getPositionsPerTick()
    );
if(entity.hasTag("Player")) {
    console.log(entityPosArray, otherEntityPosArray);
    
}
    // Loop through each subposition to check for collision
    for (let i = 0; i < entityPosArray.length; i++) {
        const entityPos = entityPosArray[i];
        const otherPos = otherEntityPosArray[i];

        // Check if the entities intersect at the current subposition
        const isColliding = checkCollision(entityPos, entity.width, entity.height, otherPos, otherEntity.width, otherEntity.height);

        if (isColliding) {
            anyCollisionOccurred = true;
            // Condition: Wall collision
            if (otherEntity.type === 'wall' && entity.type !== 'forcefield') {
                // Position entity just outside the wall
                positionAtEdge(entity, otherEntity);
                return anyCollisionOccurred; // Stop further checks as we’ve adjusted entity’s position
            }

            // Condition: Forcefield and Projectile collision
            if ((entity.type === 'forcefield' && otherEntity.type === 'projectile') ||
                (entity.type === 'projectile' && otherEntity.type === 'forcefield')) {

                // Move forcefield to its last position, as instructed
                const forcefield = entity.type === 'forcefield' ? entity : otherEntity;
                const projectile = entity.type === 'projectile' ? entity : otherEntity;

                forcefield.x = entityPosArray[entityPosArray.length - 1].x;
                forcefield.y = entityPosArray[entityPosArray.length - 1].y;

                // Place projectile just outside the forcefield on the entry side
                positionAtEdge(projectile, forcefield);

                // Flip the projectile's direction
                projectile.flipMovementDirection();
                return anyCollisionOccurred; // Stop further checks
            }
        }
    }
    return anyCollisionOccurred;
}

// Helper function to check collision
function checkCollision(pos1, width1, height1, pos2, width2, height2) {
    return pos1.x < pos2.x + width2 &&
        pos1.x + width1 > pos2.x &&
        pos1.y < pos2.y + height2 &&
        pos1.y + height1 > pos2.y;
}

// Helper function to position entity at the edge of another entity upon collision
function positionAtEdge(entity, obstacle) {
    // Determine relative movement direction to place entity outside obstacle.
    const dx = entity.velx;
    const dy = entity.vely;

    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal movement: adjust x position
        if (dx > 0) {
            // Moving right, place entity to the left of obstacle
            entity.x = obstacle.x - entity.width;
        } else {
            // Moving left, place entity to the right of obstacle
            entity.x = obstacle.x + obstacle.width;
        }
    } else {
        // Vertical movement: adjust y position
        if (dy > 0) {
            // Moving down, place entity above the obstacle
            entity.y = obstacle.y - entity.height;
        } else {
            // Moving up, place entity below the obstacle
            entity.y = obstacle.y + obstacle.height;
        }
    }
}

