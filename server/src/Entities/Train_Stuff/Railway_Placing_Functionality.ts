import { World } from "#root/World.js";
import { Rail, type Rail_End_Name, type Rail_End_Name_Alternative } from "#root/Entities/Train_Stuff/Rail.js";
import type { Direction } from "#root/Type_Stuff.js";

type Stored_Placed_Rail = {
  rail: Rail, 
  direction: Direction,
  endsAvailableForPlacement: Rail_End_Name[]
}
export { Railway_Placing_Functionality }

class Railway_Placing_Functionality {
 
 static railThickness=10;
 /* Stored rails are really only used for placeNextTo, to automatically determine endName to avoid manually specifying endNames, which was quite annoying. 
   So, basically, whenever I call placeNextTo(someRail...)
   I look in this array, by necessity find it and use the direction. if not found, throw error, obviously
 */
 static allCreatedRails: Stored_Placed_Rail[]=[];
 
  static place(x: number, y: number, length: number, direction: Direction) {
    let rail = new Rail(); // Default empty rail
    rail.setX(x)
    rail.setY(y);

    switch (direction) {
      case 'right':
        rail.setWidth(length);
        rail.setHeight(this.railThickness); // Default rail height (horizontal)
        break;
      case 'left':
        rail.setWidth(length);
        rail.setHeight(this.railThickness); // Default rail height (horizontal)
        rail.x = rail.x - length; // Adjust x to account for leftward movement
        break;
      case 'up':
        rail.setHeight(length);
        rail.setWidth(this.railThickness); // Default rail width (vertical)
        rail.y = rail.y - length;
        break;
      case 'down':
        rail.setHeight(length);
        rail.setWidth(this.railThickness); // Default rail width (vertical)
        break;
    }
    World.addEntity(rail); // Add the rail to the world
         this.addToCreatedRails({rail, direction})
    return rail;
  }
  static placeSwitch(
    thisRail: Rail,
    direction: Direction,
    switchLength: number,
    newRailLength: number,) {
     const thisRailEnd = this.tryToAutomaticallyChooseRailEndName(thisRail);
    if (!
      (thisRailEnd === "firstEnd" || thisRailEnd === "secondEnd")
    ) {
      throw new Error("Please provide either first or second end name instead of top/left/etc for simplicity");
    }

    const thisEnd = thisRail.getEnd(thisRailEnd);
    const newRail = new Rail();
    World.addEntity(newRail);
    if (thisRail.getOrientation() === 'vertical') {
      // set correct dimensions
      newRail.setWidth(newRailLength);
      newRail.setHeight(this.railThickness);


      if (thisRailEnd === "firstEnd") {
        newRail.y = thisRail.y - switchLength;
      }
      else if (thisRailEnd === "secondEnd") {
        newRail.y = thisRail.y + thisRail.height + switchLength;
      }

      if (direction === "left") {
        newRail.x = thisEnd.x - newRailLength - switchLength;
      }
      else if (direction === "right") {
        newRail.x = thisEnd.x + switchLength;
      }
    }
    else if (thisRail.getOrientation() === "horizontal") {
      // also set correct dimensions
      newRail.setWidth(this.railThickness);
      newRail.setHeight(newRailLength);


      if(thisRailEnd === "firstEnd") {
        newRail.x = thisRail.x - switchLength;
      } else if (thisRailEnd === "secondEnd") {
        newRail.x = thisRail.x + thisRail.width + switchLength;
      }


      if(direction === "up") {
        newRail.y = thisEnd.y - newRailLength - switchLength
      } else if (direction === "down") {
        newRail.y = thisEnd.y + switchLength;
      }
    }
         this.addToCreatedRails({rail: newRail, direction})
    return newRail;
  }
  
  static addToCreatedRails({direction, rail}:{direction: Direction, rail: Rail} ) {
     this.allCreatedRails.push({rail,direction, endsAvailableForPlacement:["firstEnd","secondEnd"] })
  }
/*  This is a little obscure or gimmicky, so I likely still need ability to manually specify rail ends, maybe in a separate function or as optional parameter to be used instead of calling this when no end is specified in any of the placement funcs.
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
  static tryToAutomaticallyChooseRailEndName(rail: Rail): Rail_End_Name {
    const recRail = this.getRecordedRail(rail);
    if(recRail.endsAvailableForPlacement.length === 0) {
      throw new Error("Simplified rail placing without manual specification does not work for auto placing multiple rails near a rail end")
    }
    let railEndName: Rail_End_Name;
switch(recRail.direction) {
  case "up":
  case "left":
     railEndName = "firstEnd";
  break;
  case "down":
    case "right":
     railEndName = "secondEnd";
  break;
}
if(!(recRail.endsAvailableForPlacement.includes(railEndName))){
  railEndName = recRail.endsAvailableForPlacement[0];
  
}
// consume used end so it will not be possible to use it afterwards
recRail.endsAvailableForPlacement = recRail.endsAvailableForPlacement.filter(endName => endName !== railEndName);

return railEndName
  }
  
  
  static getRecordedRail(rail: Rail): Stored_Placed_Rail {

  const recedRail = this.allCreatedRails.find(entry => entry.rail === rail);
  if (!recedRail) {
    throw new Error(`Rail not found in array, which can only happen if either the placing functions somehow had these array pushes removed or maybe you are calling this in a non-standard manner (i.e., not as a result of using Railway_Placing_Functionality class`);
  }
  return recedRail;
}
  // Place a rail next to an existing rail
  static placeNextTo(otherRail: Rail, extendsInDirection: Direction, length: number) {

const nextToOtherRailEnd = this.tryToAutomaticallyChooseRailEndName(otherRail);
    let newX;
    let newY;
    let end = otherRail.getEnd(nextToOtherRailEnd); // Get position of the specified end

    // Decide where to place the new rail based on relativeEnd and direction
    newX = end.x;
    newY = end.y;
    // if(direction === 'left') {
    //     newX -= length; 
    // }
    // if(direction === 'up') {
    //     newY -= length; 
    // }
    if (nextToOtherRailEnd === 'secondEnd' && extendsInDirection === 'left') {
      newX += this.railThickness;
      length += this.railThickness;
    }

    // Now place the next rail based on direction
    let newRail = this.place(newX, newY, length, extendsInDirection);
    return newRail;
  }
}