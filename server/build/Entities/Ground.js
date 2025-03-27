import { Base_Entity } from "#root/Entities/Base_Entity.js";
export { Ground };
class Ground extends Base_Entity {
    constructor() {
        super();
        this.setColor("green");
        this.addTag("Ground");
    }
}
