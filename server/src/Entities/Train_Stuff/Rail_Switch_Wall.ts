import { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Direction } from "#root/Type_Stuff.js";
export {Rail_Switch_Wall}
class Rail_Switch_Wall extends Base_Entity {
    acceptsWhenDirectionsAre: Direction[] = ['up'];
    modifiesCarTo: Direction[] = ['up']
    constructor(x: number, y: number, triggersUponContactWithCarIf: Direction[], modifiesCarTo: Direction[]) {
        super();
        this.width = 150;
        this.height = 50;
        this.x = x;
        this.y = y;
        this.color = "blue";

        this.triggersUponContactWithCarIf = triggersUponContactWithCarIf;
        this.modifiesCarTo = modifiesCarTo
        this.addTag("Rail_Switch_Wall");
    }

}