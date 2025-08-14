

import { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Supports_Chained_Placement,  } from "#root/Chained_Placement.js";
import type { End_Name, End, End_Name_Alternative} from "#root/Type_Stuff.js"

export { Wall }

class Wall extends Base_Entity implements Supports_Chained_Placement {
    color = "red";
    constructor() {
        super();
        this.addTag("Wall")
    }
    updateState() {

      
      super.updateState();
    }
     getOrientation() {
      const orientation = this.width > this.height ? 'horizontal' : 'vertical';
      return orientation;
    }
    getEnd(endName: End_Name | End_Name_Alternative): End {
     
      const end: End = {
        name:"firstEnd",
        x:0,
        y:0
      }
        if (this.getOrientation() === 'horizontal') {
            if (endName === 'secondEnd' || endName === 'rightEnd') {
                end.x=this.x + this.width;
                end.y= this.y;
                end.name="secondEnd";
                return end;
            } else if (endName === 'firstEnd' || endName === 'leftEnd') {
                end.x= this.x;
                end.y= this.y;
               end.name="firstEnd";
               return end;
            }
        } else if (this.getOrientation() === 'vertical') {
            if (endName === 'secondEnd' || endName === 'bottomEnd') {
                end.x=this.x;
                end.y= this.y + this.height;
                end.name="secondEnd";
                return end;
            } else if (endName === 'firstEnd' || endName === 'topEnd') {
                end.x = this.x;
                end.y= this.y;
                end.name="firstEnd";
                return end;
            }
        }
        // Default (if no matching end type)
        throw new Error(`${endName} does not 
        match any valid value...`);
    }

}