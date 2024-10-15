class Game {
    keyboard;
    yBounds;
    xBounds;
    context;
    canvas;
    entities = [];
    constructor({ keyboard, canvas, context, xBounds, yBounds }) {
        this.keyboard = keyboard;
        this.xBounds = xBounds;
        this.yBounds = yBounds;
        this.context = context;
        this.canvas = canvas;
    }
    addEntity(entity) {
        this.entities.push(entity);
    }
    tick({ timestamp }) {
        this.entities.forEach(entity => {
            this.forcePositionToBeWithinBounds(entity);
            entity.tick({ timestamp, context: this.context });
            this.forcePositionToBeWithinBoundsAgain(entity);
        }, this);
    }

    forcePositionToBeWithinBounds(entity) {
        if (entity.x <= 0) {
            entity.x = 0;
        }
        const entityRightEdge = entity.x + entity.width;
        if (entityRightEdge >= this.xBounds) {
            const worldRightEdgeEntityPosition = this.xBounds - entity.width;
            entity.x = worldRightEdgeEntityPosition;
        }

        if (entity.y <= 0) {
            entity.y = 0;
        }
        const entityBottom = entity.y + entity.height;
        if (entityBottom >= this.yBounds) {
            const worldBottomEdgeEntityPosition = this.yBounds - entity.height;;
            entity.y = worldBottomEdgeEntityPosition;
        }

    }
    // alias  for reading clarity in tick;
    forcePositionToBeWithinBoundsAgain = this.forcePositionToBeWithinBounds;
    
}

export {
    Game
}