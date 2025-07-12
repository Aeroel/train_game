import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Rail } from "#root/Entities/Train_Stuff/Rail.js"
export {Rail_Switch_Wall}
class Rail_Switch_Wall extends Base_Entity {
    rail: Rail;
    constructor(x: number, y: number, rail: Rail) {
        super();
        this.width = 150;
        this.height = 50;
        this.x = x;
        this.y = y;
        this.color = "blue";

        this.rail = rail;
        this.addTag("Rail_Switch_Wall");
    }

}