import { handleProjectileAndForcefieldCollisions, handleWallCollisions } from "./entityCollisionImplementation.js";
function move({ direction, stepDistance, selfEntity, entities }) {
    handleWallCollisions({ direction, stepDistance, selfEntity, entities });
    handleProjectileAndForcefieldCollisions({ selfEntity, entities });

}

export { move }