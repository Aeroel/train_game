import { handleCollision } from "./entityCollisionImplementation.js";


class Game {
    xLimit;
    yLimit;
    entities = [];
    constructor({ yLimit, xLimit }) {
        this.yLimit = yLimit;
        this.xLimit = xLimit;
    }
    addEntity(entity) {
        this.entities.push(entity);
    }
    makeForcefieldsAppearOnTopOfAllOtherEntitiesWhenRendered() {
        this.entities.sort((a, b) => {
            if (a.type === 'forcefield' && b.type !== 'forcefield') {
                return 1;
            } else if (a.type !== 'forcefield' && b.type === 'forcefield') {
                return -1;
            } else {
                return 0;
            }
        });
    }
    tick() {
        this.makeForcefieldsAppearOnTopOfAllOtherEntitiesWhenRendered();
        this.entities.forEach(entity => {
            entity.tick();
        });

        this.entities.forEach(entity => {
            this.entities.forEach(otherEntity => {
                if (otherEntity === entity) {
                    return;
                }
                if (entity.hasTag("Wall")) {
                    return;
                }

                const collisionInfo = handleCollision(entity, otherEntity);
                console.log(collisionInfo);
                if (!collisionInfo.collisionOccurred) {
                    entity.x += (entity.directionX * entity.speedX) * globalThis.deltaTime;
                    entity.y += (entity.directionY * entity.speedY) * globalThis.deltaTime;
                    return;
                }
                

            })
        })

        this.entities.forEach(entity => {
            entity.draw();
        })
    }

    forcePositionToBeWithinBounds(entity) {
        if (entity.x <= 0) {
            entity.x = 0;
        }
        const entityRightEdge = entity.x + entity.width;
        if (entityRightEdge >= this.yLimit) {
            const worldRightEdgeEntityPosition = this.yLimit - entity.width;
            entity.x = worldRightEdgeEntityPosition;
        }

        if (entity.y <= 0) {
            entity.y = 0;
        }
        const entityBottom = entity.y + entity.height;
        if (entityBottom >= this.xLimit) {
            const worldBottomEdgeEntityPosition = this.xLimit - entity.height;;
            entity.y = worldBottomEdgeEntityPosition;
        }

    }

}

export {
    Game
}