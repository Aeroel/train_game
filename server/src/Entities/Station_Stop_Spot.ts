import { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Direction } from "#root/Type_Stuff.js";
export {
    Station_Stop_Spot
}

interface Station_Stop_Spot_Constructor {
  x: number, y: number, Which_Door_Of_A_Car_To_Open_And_Close:Direction
  
}

class Station_Stop_Spot extends Base_Entity {
    color = 'blue';
    Which_Door_Of_A_Car_To_Open_And_Close: Direction = "right";
    constructor({x, y, Which_Door_Of_A_Car_To_Open_And_Close}: Station_Stop_Spot_Constructor) {
        super();
        this.x=x;
        this.y=y;
        this.height = 100;
        this.width = this.height;
        this.Which_Door_Of_A_Car_To_Open_And_Close = Which_Door_Of_A_Car_To_Open_And_Close
        this.addTag("Station_Stop_Spot");
    }
}