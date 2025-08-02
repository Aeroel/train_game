

import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Player} from "#root/Entities/Player.js";
import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";

export { Wall }

class Wall extends Base_Entity {
    color = "red";
    constructor() {
        super();
        this.addTag("Wall")
    }
    updateState() {

      
      super.updateState();
    }

}