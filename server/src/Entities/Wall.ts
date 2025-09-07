

import { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { End_Name, End, End_Name_Alternative, Connections, Entity_With_Ends_And_Orientation } from "#root/Type_Stuff.js"
import { Implementation_Of_Entity_With_Ends_And_Orientation } from "#root/Entities/Implementation_Of_Entity_With_Ends_And_Orientation.js"

export { Wall }

class Wall extends Base_Entity implements Entity_With_Ends_And_Orientation {

    color = "red";
    normalColor = "red";
    speedX=0.125;
    speedY=0.125;
    last=0;
    every=2000;
    constructor() {
        super();
        this.addTag("Wall")
    }

    updateState() {
     if(Date.now()>this.every + this.last) {
       this.last = Date.now();
       this.speedX = -1*this.speedX
       this.speedY = -1*this.speedY
     }
     this.vx=this.speedX
     this.vy=this.speedY
      
      super.updateState();
    }
     getOrientation() {
       return Implementation_Of_Entity_With_Ends_And_Orientation.getOrientation(this);
    }
    getEnd(endName: End_Name | End_Name_Alternative): End {
       return Implementation_Of_Entity_With_Ends_And_Orientation.getEnd(this, endName);
    }

}