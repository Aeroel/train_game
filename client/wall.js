import { Entity} from "./Entity.js"

class Wall extends Entity {
    tags = ["Entity", "Wall"]
    constructor({x, y, width, height}) {
        super({x, y, width, height});
    }
    getPositionsPerTick() {
        return [{x: this.x, y: this.y}];
    }
}

export {
    Wall,
}