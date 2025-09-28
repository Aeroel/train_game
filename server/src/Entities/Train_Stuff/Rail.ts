import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Helper_Functions } from "#root/Helper_Functions.js";
import type { Connections, Point, Position, End_Name, End_Name_Alternative, End, Orientation, Entity_With_Ends_And_Orientation } from "#root/Type_Stuff.js";
import { Assert_That_Numbers_Are_Finite } from "#root/Type_Validation_Stuff.js";
import {Implementation_Of_Entity_With_Ends_And_Orientation} from "#root/Entities/Implementation_Of_Entity_With_Ends_And_Orientation.js"
export { Rail };

export type Rail_End_Name = End_Name
export type Rail_End_Name_Alternative = End_Name_Alternative

export type Rail_End = End


export type Rail_Orientation = Orientation

export type Rail_Connections = Connections


class Rail extends Base_Entity implements Entity_With_Ends_And_Orientation {
    connections: Rail_Connections = {
      firstEnd: null,
      secondEnd: null,
    }

    

    constructor() {
        super();
        this.addTag("Rail");
        this.setColor("purple");
    }
    
    
    connectWith({otherRail, otherEndName, thisEndName}:{otherRail: Rail, otherEndName: Rail_End_Name, thisEndName: Rail_End_Name}) {
      const otherEnd = otherRail.getEnd(otherEndName);
      const thisEnd = this.getEnd(thisEndName);
      
      this.connections[thisEndName] = otherEnd;
      
      otherRail.connections[otherEndName] = thisEnd;
    }
  
  
    getOrientation() {
        return Implementation_Of_Entity_With_Ends_And_Orientation.getOrientation(this);
    }


    getEnd(endName: Rail_End_Name | Rail_End_Name_Alternative): Rail_End {    return Implementation_Of_Entity_With_Ends_And_Orientation.getEnd(this, endName)

    }
    

}