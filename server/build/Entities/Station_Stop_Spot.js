import { Base_Entity } from "#root/Entities/Base_Entity.js";
export { Station_Stop_Spot };
class Station_Stop_Spot extends Base_Entity {
    color = 'black';
    constructor() {
        super();
        this.addTag("Station_Stop_Spot");
    }
}
