

import { Base_Entity } from "#root/Entities/Base_Entity.js";

export { Wall }

class Wall extends Base_Entity {
    color = "red";
    constructor() {
        super();
        this.addTag("Wall")
    }
}