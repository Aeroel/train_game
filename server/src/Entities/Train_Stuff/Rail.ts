import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Helper_Functions } from "#root/Helper_Functions.js";
import type { Point, Position, End_Name, End_Name_Alternative, End, Orientation } from "#root/Type_Stuff.js";
import { Assert_That_Numbers_Are_Finite } from "#root/Type_Validation_Stuff.js";
import type {Supports_Chained_Placement} from "#root/Chained_Placement.js"
export { Rail };

export type Rail_End_Name = End_Name
export type Rail_End_Name_Alternative = End_Name_Alternative

export type Rail_End = End


export type Rail_Orientation = Orientation

export type Rail_Connections = {
    [EndName in Rail_End_Name]: Rail_End | null;
}

class Rail extends Base_Entity implements Supports_Chained_Placement {
    connections: Rail_Connections = {
      firstEnd: null,
      secondEnd: null,
    }
    twoPossibleEnds = ["firstEnd", "secondEnd"];
    

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
      const orientation = this.width > this.height ? 'horizontal' : 'vertical';
      return orientation;
    }


    getEnd(endName: Rail_End_Name | Rail_End_Name_Alternative): Rail_End {
     
      const end: Rail_End = {
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