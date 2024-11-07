import { Mobile_Entity } from "./Mobile_Entity.js";
export { Player}
class Player extends Mobile_Entity {
    constructor({x, y, width, height}) {
        super({x, y, width, height})
    }
}