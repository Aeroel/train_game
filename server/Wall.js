

import { Entity } from "./Entity.js";

export { Wall }

class Wall extends Entity {
    color = "red";
    constructor() {
        super();
        this.addTag("Wall")
    }
}