import { Base_Entity } from "../Base_Entity.js";

class Rail_Switch_Wall extends Base_Entity {
    constructor(x: number, y: number) {
        super();
        this.width = 64;
        this.height = 64;
        this.x = x;
        this.y = y;
    }

}