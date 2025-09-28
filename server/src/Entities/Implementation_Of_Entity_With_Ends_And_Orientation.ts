import type { Base_Entity}  from "#root/Entities/Base_Entity.js"
import type { End_Name_Alternative, End_Name, End, Entity_With_Ends_And_Orientation}  from "#root/Type_Stuff.js"

export class Implementation_Of_Entity_With_Ends_And_Orientation {
  
 static getOrientation<T extends Base_Entity & Entity_With_Ends_And_Orientation>(entity: T) {
          const orientation = entity.width > entity.height ? 'horizontal' : 'vertical';
      return orientation;
  }
  static getEnd<T extends Base_Entity & Entity_With_Ends_And_Orientation>(entity: T, endName: End_Name | End_Name_Alternative): End {
     
      const end: End = {
        name:"firstEnd",
        x:0,
        y:0
      }
      const orientation = entity.getOrientation();
        if (orientation === 'horizontal') {
            if (endName === 'secondEnd' || endName === 'rightEnd') {
                end.x=entity.x + entity.width;
                end.y= entity.y;
                end.name="secondEnd";
                return end;
            } else if (endName === 'firstEnd' || endName === 'leftEnd') {
                end.x= entity.x;
                end.y= entity.y;
               end.name="firstEnd";
               return end;
            }
        } else if (orientation === 'vertical') {
            if (endName === 'secondEnd' || endName === 'bottomEnd') {
                end.x=entity.x;
                end.y= entity.y + entity.height;
                end.name="secondEnd";
                return end;
            } else if (endName === 'firstEnd' || endName === 'topEnd') {
                end.x = entity.x;
                end.y= entity.y;
                end.name="firstEnd";
                return end;
            }
        }
        // Default (if no matching end type)
        throw new Error(`${endName} does not 
        match any valid value...`);
    }
  
}