import { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Direction } from "#root/Type_Stuff.js";
export {Rail_Switch_Wall}
class Rail_Switch_Wall extends Base_Entity {
    triggersUponContactWithCarIf: Direction[] = ['up'];
    modifiesCarTo: Direction[] = ['up']
    constructor(x: number, y: number, triggersUponContactWithCarIf: Direction[], modifiesCarTo: Direction[],width: number, height: number ) {
        super();
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = "blue";

        this.triggersUponContactWithCarIf = triggersUponContactWithCarIf;
        this.modifiesCarTo = modifiesCarTo;
        this.addTag("Rail_Switch_Wall");
    }
    areDirectionsAlignedForTrigger(directions: Direction[]) {
      let identical = true;
      directions.forEach((dir: Direction) => {
        if(!(this.triggersUponContactWithCarIf.includes(dir))) {
          identical = false;
        }
      })
      return identical;
    }

}