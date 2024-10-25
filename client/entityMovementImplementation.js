import { rectIntersectsRect } from "./rectIntersectsRect.js";

function move({ dir, step, selfEntity, entities }) {
    const formulas = setUpFormulas({dir, step, selfEntity, entities});
    let pointBeforeClosestCollision = formulas[dir].closestValidInitial;
    entities.forEach((entity) => {
        if (entity.type !== 'wall') {
            return;
        }
        const potential = formulas[dir].potential({entity, selfEntity});
        for (let subStep = 1; subStep < step; subStep++) {
            const hypotheticalFuturePlayerState = { x: formulas[dir].xSubStep({x:selfEntity.x, subStep}), y: formulas[dir].ySubStep({y:selfEntity.y, subStep}), width: selfEntity.width, height: selfEntity.height }
            if (!rectIntersectsRect(hypotheticalFuturePlayerState, entity)) {
                continue;
            }
            if (formulas[dir].needToSkipCollision({potential,pointBeforeClosestCollision: pointBeforeClosestCollision})) {
                continue;
            }
            pointBeforeClosestCollision = potential;
            return;
        }
    })
    formulas[dir].setPosition({selfEntity, pointBeforeClosestCollision});

}
function setUpFormulas({dir, step, selfEntity, entities}) {
    return {
        left: {
            closestValidInitial: selfEntity.x - step,
            potential: function({entity, selfEntity}) {
                return entity.x + entity.width;
            },
            xSubStep: function({x, subStep}) {
                return x - subStep;
            },
            ySubStep: function({y, subStep}) {
                return y;
            },
            needToSkipCollision: function({potential, pointBeforeClosestCollision}) {
                return (potential < pointBeforeClosestCollision);
            },
            setPosition({selfEntity, pointBeforeClosestCollision}) {
                selfEntity.x = pointBeforeClosestCollision
            }
        },
        right: {
            closestValidInitial: selfEntity.x + step,
            potential: function({entity, selfEntity}) {
                return entity.x - selfEntity.width;
            },
            xSubStep: function({x, subStep}) {
                return x + subStep;
            },
            ySubStep: function({y, subStep}) {
                return y;
            },
            needToSkipCollision: function({potential, pointBeforeClosestCollision}) {
                return (potential > pointBeforeClosestCollision);
            },
            setPosition({selfEntity, pointBeforeClosestCollision}) {
                selfEntity.x = pointBeforeClosestCollision
            }
        },
        up: {
            closestValidInitial: selfEntity.y - step,
            potential: function({entity, selfEntity}) {
                return entity.y + entity.height;
            },
            xSubStep: function({x, subStep}) {
                return x;
            },
            ySubStep: function({y, subStep}) {
                return y - subStep;
            },
            needToSkipCollision: function({potential, pointBeforeClosestCollision}) {
                return (potential < pointBeforeClosestCollision);
            },
            setPosition({selfEntity, pointBeforeClosestCollision}) {
                selfEntity.y = pointBeforeClosestCollision
            }
        },
        down: {
            closestValidInitial: selfEntity.y + step,
            potential: function({entity, selfEntity}) {
                return entity.y - selfEntity.height;
            },
            xSubStep: function({x, subStep}) {
                return x;
            },
            ySubStep: function({y, subStep}) {
                return y + subStep;
            },
            needToSkipCollision: function({potential, pointBeforeClosestCollision}) {
                return (potential > pointBeforeClosestCollision);
            },
            setPosition({selfEntity, pointBeforeClosestCollision}) {
                selfEntity.y = pointBeforeClosestCollision
            }
        },
    };
}

export {move}