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
            this.forcePositionToBeWithinBounds(entity);
        }, this);
    }
    forcePositionToBeWithinBounds(entity) {

        if (entity.x <= 0) {
            entity.x = 0;
        }
        if (entity.x + entity.width >= this.xBounds) {
            entity.x = this.xBounds - entity.width;
        }

        if (entity.y <= 0) {
            entity.y = 0;
        }
        if (entity.y + entity.height >= this.yBounds) {
            entity.y = this.yBounds - entity.height;
        }

    }
}

export {
    Game
}