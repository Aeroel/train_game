import { Entity} from "./entity.js"

class Wall extends Entity {
    type = "wall";
    constructor({x, y, width, height}) {
        super({x, y, width, height});
    }
}

export {
    Wall,
}