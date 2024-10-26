import { MovingEntity } from "./MovingEntity.js";
import { rectIntersectsRect } from "./rectIntersectsRect.js";
export { handleCollisionForForcefield, handleCollisionForProjectile, handleProjectileAndForcefieldCollisions, handleWallCollisions, generateAllCurrentMovementPositions };

function setUpFormulas({ direction, stepDistance, selfEntity, entities }) {
    return {
        left: {
            closestValidInitial: selfEntity.x - stepDistance,
            potential: function ({ entity, selfEntity }) {
                return entity.x + entity.width;
            },
            xSubStep: function ({ x, subStep }) {
                return x - subStep;
            },
            ySubStep: function ({ y, subStep }) {
                return y;
            },
            needToSkipCollision: function ({ potential, pointBeforeClosestCollision }) {
                return (potential < pointBeforeClosestCollision);
            },
            setPosition({ selfEntity, pointBeforeClosestCollision }) {
                selfEntity.x = pointBeforeClosestCollision
            }
        },
        right: {
            closestValidInitial: selfEntity.x + stepDistance,
            potential: function ({ entity, selfEntity }) {
                return entity.x - selfEntity.width;
            },
            xSubStep: function ({ x, subStep }) {
                return x + subStep;
            },
            ySubStep: function ({ y, subStep }) {
                return y;
            },
            needToSkipCollision: function ({ potential, pointBeforeClosestCollision }) {
                return (potential > pointBeforeClosestCollision);
            },
            setPosition({ selfEntity, pointBeforeClosestCollision }) {
                selfEntity.x = pointBeforeClosestCollision
            }
        },
        up: {
            closestValidInitial: selfEntity.y - stepDistance,
            potential: function ({ entity, selfEntity }) {
                return entity.y + entity.height;
            },
            xSubStep: function ({ x, subStep }) {
                return x;
            },
            ySubStep: function ({ y, subStep }) {
                return y - subStep;
            },
            needToSkipCollision: function ({ potential, pointBeforeClosestCollision }) {
                return (potential < pointBeforeClosestCollision);
            },
            setPosition({ selfEntity, pointBeforeClosestCollision }) {
                selfEntity.y = pointBeforeClosestCollision
            }
        },
        down: {
            closestValidInitial: selfEntity.y + stepDistance,
            potential: function ({ entity, selfEntity }) {
                return entity.y - selfEntity.height;
            },
            xSubStep: function ({ x, subStep }) {
                return x;
            },
            ySubStep: function ({ y, subStep }) {
                return y + subStep;
            },
            needToSkipCollision: function ({ potential, pointBeforeClosestCollision }) {
                return (potential > pointBeforeClosestCollision);
            },
            setPosition({ selfEntity, pointBeforeClosestCollision }) {
                selfEntity.y = pointBeforeClosestCollision
            }
        },
    };
}

// loops over sub positions of moving or stationary entities, simulating them moving.
// stationary entities have fewer elements than moving ones, in that case we can just expand the
// stationary entity's elements by copying the same value of it's current position to fit the
/// moving one's
function willEntitiesTouchAtAnyPoint({ entity1, entity2 }) {

    let entity1Positions = generateAllCurrentMovementPositions({ entity: entity1 })
    let entity2Positions = generateAllCurrentMovementPositions({ entity: entity2 })
    // this does something like... well, equalize the subpositions arrays if they differ
    // to allow to compare each sub position
    if (entity1Positions.length > entity2Positions.length) {
        entity2Positions = expandForComparison({ subpositions: entity2Positions, numberOfTimes: entity1Positions.length });
    } else if (entity1Positions.length < entity2Positions.length) {
        entity1Positions = expandForComparison({ subpositions: entity1Positions, numberOfTimes: entity2Positions.length });
    }
    let willThey = false;
    // above call to expandForComparison must have made lengths equal for sure
    const lengthOfEither = entity1Positions.length;


    for (let positionIndex = 0; positionIndex < lengthOfEither; positionIndex++) {
        const x1 = entity1Positions[positionIndex].x;
        const y1 = entity1Positions[positionIndex].y;
        const simE1 = { x: x1, y: y1, width: entity1.width, height: entity1.height };
        const x2 = entity2Positions[positionIndex].x;
        const y2 = entity2Positions[positionIndex].y;

        const simE2 = { x: x2, y: y2, width: entity2.width, height: entity2.height };
        if (rectIntersectsRect(simE1, simE2)) {
            willThey = true;
            break;
        }
    }
    return willThey;

}
function expandForComparison({ subpositions, numberOfTimes }) {
    const expandedPositions = [...subpositions];
    const lastPosition = subpositions[subpositions.length - 1];

    while (expandedPositions.length < numberOfTimes) {
        expandedPositions.push({ ...lastPosition });
    }

    return expandedPositions;
}
function generateAllCurrentMovementPositions({ entity }) {

    const positions = [];
    // starting position
    let startPos = { x: entity.x, y: entity.y };
    positions.push(startPos);

    if (entity.currentSpeed === 0) {
        return positions;
    }

    // middle positions
    for (let substep = 1; substep < entity.currentSpeed; substep++) {
        let tempX = entity.x;
        let tempY = entity.y;
        if (entity.movingInDirections.has('left')) {
            tempX -= substep;
        }
        if (entity.movingInDirections.has('right')) {
            tempX += substep;
        }
        if (entity.movingInDirections.has('up')) {
            tempY -= substep;
        }
        if (entity.movingInDirections.has('down')) {
            tempY += substep;
        }
        positions.push({ x: tempX, y: tempY });
    }

    // end, where it (the entity, that is) wants to be at end of the whole movement/entity.currentSpeed
    let endX = entity.x
    let endY = entity.y
    if (entity.movingInDirections.has("right")) {
        endX += entity.currentSpeed;
    }
    if (entity.movingInDirections.has("left")) {
        endX -= entity.currentSpeed;
    }
    if (entity.movingInDirections.has("down")) {
        endY += entity.currentSpeed;
    }
    if (entity.movingInDirections.has("up")) {
        endY -= entity.currentSpeed;
    }

    let endPos = { x: endX, y: endY };
    positions.push(endPos);
    return positions;
}

function handleCollisionForProjectile({ projectile, entities }) {
    entities.forEach((entity) => {
        if (entity.type !== 'forcefield' || entity === projectile) {
            return;
        }
        const forcefield = entity;

        if (willEntitiesTouchAtAnyPoint({ entity1: projectile, entity2: forcefield, })) {
            whenProjectileCollidesWithForceField({ projectile, forcefield });
        }
    })
}
function whenProjectileCollidesWithForceField({ projectile, forcefield }) {
    if (projectile.isMoving()) {
        projectile.flipMovementDirection();
        return;
    }
    forcefield.entityThatGeneratesIt.movingInDirections.forEach(direction => {
        projectile.movingInDirections.add(direction);
    })
    projectile.setSpeed(8);


}
function handleCollisionForForcefield({ forcefield, entities }) {
    entities.forEach((entity) => {
        if (entity.type !== 'projectile' || entity === forcefield) {
            return;
        }
        const projectile = entity;
        if (willEntitiesTouchAtAnyPoint({ entity1: forcefield, entity2: projectile })) {
            whenProjectileCollidesWithForceField({ projectile, forcefield });
        }
    })
}
function handleProjectileAndForcefieldCollisions({ selfEntity, entities }) {

    if (selfEntity.type === 'projectile') {
        handleCollisionForProjectile({ projectile: selfEntity, entities });
    } else if (selfEntity.type === 'forcefield') {
        handleCollisionForForcefield({ forcefield: selfEntity, entities });
    } else {
        return;
    }
}
function handleWallCollisions({ direction, stepDistance, selfEntity, entities }) {
    const formulas = setUpFormulas({ direction, stepDistance, selfEntity, entities });
    let pointBeforeClosestCollision = formulas[direction].closestValidInitial;
    let anyCollisionOccurred = false;
    entities.forEach((entity) => {
        if (entity.type !== 'wall' || selfEntity === entity) {
            return;
        }
        const potential = formulas[direction].potential({ entity, selfEntity });
        for (let subStep = 1; subStep < stepDistance; subStep++) {
            const hypotheticalFuturePlayerState = { x: formulas[direction].xSubStep({ x: selfEntity.x, subStep }), y: formulas[direction].ySubStep({ y: selfEntity.y, subStep }), width: selfEntity.width, height: selfEntity.height }
            if (!rectIntersectsRect(hypotheticalFuturePlayerState, entity)) {
                continue;
            }
            if (formulas[direction].needToSkipCollision({ potential, pointBeforeClosestCollision: pointBeforeClosestCollision })) {
                continue;
            }
            pointBeforeClosestCollision = potential;
            anyCollisionOccurred = true;
            return;
        }
    })
    if (anyCollisionOccurred) {
        selfEntity.movingInDirections.delete(direction);
    }
    formulas[direction].setPosition({ selfEntity, pointBeforeClosestCollision });

}