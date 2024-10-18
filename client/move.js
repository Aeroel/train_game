import { rectIntersectsRect } from "./rectIntersectsRect.js";

function move({ dir, step, player, entities }) {
    const formulas = setUpFormulas({dir, step, player, entities});
    let pointBeforeClosestCollision = formulas[dir].closestValidInitial;
    entities.forEach((entity) => {
        if (entity.type !== 'wall') {
            return;
        }
        const potential = formulas[dir].potential({entity, player});
        for (let subStep = 1; subStep < step; subStep++) {
            const hypotheticalFuturePlayerState = { x: formulas[dir].xSubStep({x:player.x, subStep}), y: formulas[dir].ySubStep({y:player.y, subStep}), width: player.width, height: player.height }
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
    formulas[dir].setPosition({player, pointBeforeClosestCollision});

}
function setUpFormulas({dir, step, player, entities}) {
    return {
        left: {
            closestValidInitial: player.x - step,
            potential: function({entity, player}) {
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
            setPosition({player, pointBeforeClosestCollision}) {
                player.x = pointBeforeClosestCollision
            }
        },
        right: {
            closestValidInitial: player.x + step,
            potential: function({entity, player}) {
                return entity.x - player.width;
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
            setPosition({player, pointBeforeClosestCollision}) {
                player.x = pointBeforeClosestCollision
            }
        },
        up: {
            closestValidInitial: player.y - step,
            potential: function({entity, player}) {
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
            setPosition({player, pointBeforeClosestCollision}) {
                player.y = pointBeforeClosestCollision
            }
        },
        down: {
            closestValidInitial: player.y + step,
            potential: function({entity, player}) {
                return entity.y - player.height;
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
            setPosition({player, pointBeforeClosestCollision}) {
                player.y = pointBeforeClosestCollision
            }
        },
    };
}

export {move}