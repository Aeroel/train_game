import { Base_Entity } from "#root/Entities/Base_Entity.js";
export { Sensor };
class Sensor extends Base_Entity {
    width = 2;
    height = 2;
    color = "pink";
    constructor() {
        super();
        this.addTag("Sensor");
    }
}
