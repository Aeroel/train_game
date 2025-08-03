import { Base_Entity } from "#root/Entities/Base_Entity.js";

export {
    Station_Stop_Spot
}

class Station_Stop_Spot extends Base_Entity {
    color = 'blue';
    constructor(x: number, y: number) {
        super();
        this.x=x;
        this.y=y;
        this.height = 100;
        this.width = this.height;
        this.addTag("Station_Stop_Spot");
    }
}