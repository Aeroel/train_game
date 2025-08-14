import { World } from "#root/World.js";
import type { Direction, End, End_Name, End_Name_Alternative, Orientation } from "#root/Type_Stuff.js";
import type { Base_Entity } from "#root/Entities/Base_Entity.js";


export type Stored_Placed_Entity = {
  entity:  Base_Entity & Supports_Chained_Placement, 
  direction: Direction,
  endsAvailableForPlacement: End_Name[]
}
export { Chained_Placement }

export interface Supports_Chained_Placement {
  getOrientation(): Orientation;
  getEnd(endName: End_Name | End_Name_Alternative): End;
  
}
class Chained_Placement {
 
 static thickness=10;
 /* Stored rails are really only used for placeNextTo, to automatically determine endName to avoid manually specifying endNames, which was quite annoying. 
   So, basically, whenever I call placeNextTo(someRail...)
   I look in this array, by necessity find it and use the direction. if not found, throw error, obviously
 */
 static allCreatedEntities: Stored_Placed_Entity[]=[];
 
  static place<T extends Base_Entity & Supports_Chained_Placement>(entity: T, x: number, y: number, length: number, direction: Direction) {
    entity.setX(x)
    entity.setY(y);

    switch (direction) {
      case 'right':
        entity.setWidth(length);
        entity.setHeight(this.thickness); // Default rail height (horizontal)
        break;
      case 'left':
        entity.setWidth(length);
        entity.setHeight(this.thickness); // Default rail height (horizontal)
        entity.x = entity.x - length; // Adjust x to account for leftward movement
        break;
      case 'up':
        entity.setHeight(length);
        entity.setWidth(this.thickness); // Default rail width (vertical)
        entity.y = entity.y - length;
        break;
      case 'down':
        entity.setHeight(length);
        entity.setWidth(this.thickness); // Default rail width (vertical)
        break;
    }
    World.addEntity(entity); // Add the rail to the world
         this.addToCreatedEntities({entity, direction})
    return entity;
  }
  static placeSwitch<T extends Base_Entity & Supports_Chained_Placement>(
    otherEntity: T,
    newEntity: T,
    direction: Direction,
    switchLength: number,
    newEntityLength: number,) {
     const otherEntityEnd = this.tryToAutomaticallyChooseEntityEndName(otherEntity);

    const otherEnd = otherEntity.getEnd(otherEntityEnd);
    if (otherEntity.getOrientation() === 'vertical') {
      // set correct dimensions
      newEntity.setWidth(newEntityLength);
      newEntity.setHeight(this.thickness);


      if (otherEntityEnd === "firstEnd") {
        newEntity.y = otherEntity.y - switchLength;
      }
      else if (otherEntityEnd === "secondEnd") {
        newEntity.y = otherEntity.y + otherEntity.height + switchLength;
      }

      if (direction === "left") {
        newEntity.x = otherEnd.x - newEntityLength - switchLength;
      }
      else if (direction === "right") {
        newEntity.x = otherEnd.x + switchLength;
      }
    }
    else if (otherEntity.getOrientation() === "horizontal") {
      // also set correct dimensions
      newEntity.setWidth(this.thickness);
      newEntity.setHeight(newEntityLength);


      if(otherEntityEnd === "firstEnd") {
        newEntity.x = otherEntity.x - switchLength;
      } else if (otherEntityEnd === "secondEnd") {
        newEntity.x = otherEntity.x + otherEntity.width + switchLength;
      }


      if(direction === "up") {
        newEntity.y = otherEnd.y - newEntityLength - switchLength
      } else if (direction === "down") {
        newEntity.y = otherEnd.y + switchLength;
      }
    }
         this.addToCreatedEntities({entity: newEntity, direction})
    return newEntity
  }
  
  static addToCreatedEntities<T extends Base_Entity & Supports_Chained_Placement>({direction, entity}:{direction: Direction, entity: T} ) {
     this.allCreatedEntities.push({entity,direction, endsAvailableForPlacement:["firstEnd","secondEnd"] })
  }
/*  This is a little obscure or gimmicky, so I likely still need ability to manually specify entity ends, especially if I would like to have one entity branching to few and control where train goes, maybe in a separate function or as optional parameter to be used instead of calling this when no end is specified in any of the placement funcs.
  Basically, the idea is this: I use the placement funcs like this:
  rail1 eq initialplace right
  rail2 eq placenextto rail1 extend down <- here end of rail1 automatically determined to be secondEnd (remember: for hor rails, secondEnd is right, and for vertical rails secondEnd is bottom)
  rail3 eq placenextto rail2 extend left <-- extends from rail2's secondEnd
  rail4 eq placenextto rail1 extend up <-- problem occurs here. it will use second end like rail2 and place rail4 at the same end as rail2, creating a mess, but I want to use firstEnd. 
  // or maybe I did this instead, same issue.
  rail4 eq placenextto rail1 extend right
  
  So, auto choosing end is only for cases when I do a linear railway construction like:
  initialPlace left, extend up, extend right, extend down (for example, let's say we just made a square shapee circular railway)
  but if I do placement from both of raiL'S ends, I still need to manually specify them
  etc.
  */
  static tryToAutomaticallyChooseEntityEndName(entity: Base_Entity): End_Name {
    const recEntity = this.getRecordedEntity(entity);
    if(recEntity.endsAvailableForPlacement.length === 0) {
      throw new Error("Simplified entity placing without manual specification does not work for auto placing multiple entities near an entity end")
    }
    let entityEndName: End_Name;
switch(recEntity.direction) {
  case "up":
  case "left":
     entityEndName = "firstEnd";
  break;
  case "down":
    case "right":
     entityEndName = "secondEnd";
  break;
}
if(!(recEntity.endsAvailableForPlacement.includes(entityEndName))){
  entityEndName = recEntity.endsAvailableForPlacement[0];
  
}
// consume used end so it will not be possible to use it afterwards 
recEntity.endsAvailableForPlacement = recEntity.endsAvailableForPlacement.filter(endName => endName !== entityEndName);

return entityEndName
  }
  
  
  static getRecordedEntity(entity: Base_Entity): Stored_Placed_Entity {

  const recedEntity = this.allCreatedEntities.find(entry => entry.entity === entity);
  if (!recedEntity) {
    throw new Error(`Entity not found in allCreatedEntities array, which can only happen if either the placing functions somehow had these array pushes removed or maybe you are calling this in a non-standard manner (i.e., not as a result of using Chained_Placement class`);
  }
  return recedEntity;
}
  // Place a rail next to an existing rail
  static placeNextTo<T extends Base_Entity & Supports_Chained_Placement>(thisEntity: T, otherEntity: T, extendsInDirection: Direction, length: number) {

const nextToOtherEntityEnd = this.tryToAutomaticallyChooseEntityEndName(otherEntity);
    let newX;
    let newY;
    let end = otherEntity.getEnd(nextToOtherEntityEnd); // Get position of the specified end

    // Decide where to place the new rail based on relativeEnd and direction
    newX = end.x;
    newY = end.y;
    // if(direction === 'left') {
    //     newX -= length; 
    // }
    // if(direction === 'up') {
    //     newY -= length; 
    // }
    if (nextToOtherEntityEnd === 'secondEnd' && extendsInDirection === 'left') {
      newX += this.thickness;
      length += this.thickness;
    }

    // Now place the next rail based on direction
    this.place(thisEntity, newX, newY, length, extendsInDirection);
    return thisEntity;
  }
}