import { Entity } from "./Entity.js";

export {
    Station_Stop_Spot
}

class Station_Stop_Spot extends Entity {
    color = 'black';
    constructor() {
        super();
        this.addTag("Station_Stop_Spot");
    }
}