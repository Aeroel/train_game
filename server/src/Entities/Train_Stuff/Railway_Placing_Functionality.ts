import { World } from "#root/World.js";
import { Rail, type Rail_End_Name, type Rail_End_Name_Alternative } from "#root/Entities/Train_Stuff/Rail.js";
import type { Direction } from "#root/Type_Stuff.js";

export { Railway_Placing_Functionality }

class Railway_Placing_Functionality {
 
 static railThickness=10;
 /* Stored rails are really only used for placeNextTo, to automatically determine endName to avoid manually specifying endNames, which was quite annoying. 
   So, basically, whenever I call placeNextTo(someRail...)
   I look in this array, by necessity find it and use the direction. if not found, throw error, obviously
 */
 static allCreatedRails: {rail:Rail, direction: Direction}[]=[];
 
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
    this.allCreatedRails.push({direction, rail})
    return rail;
  }
  static placeSwitch(
    thisRail: Rail,
    direction: Direction,
    switchLength: number,
    newRailLength: number,) {
     const thisRailEnd = this.recordedRailToEndName(thisRail);
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
        this.allCreatedRails.push({direction, rail: newRail})
    return newRail;
  }
  
  
  static recordedRailToEndName(rail: Rail): Rail_End_Name {
    const dirOfRail = this.getDirectionByRail(rail);
    let railEndName: Rail_End_Name;
switch(dirOfRail) {
  case "up":
  case "left":
     railEndName = "firstEnd";
  break;
  case "down":
    case "right":
     railEndName = "secondEnd";
  break;
}
return railEndName
  }
  static getDirectionByRail(rail: Rail): Direction {
    assertNoDuplicateRails(this.allCreatedRails);
    function assertNoDuplicateRails(array: { rail: Rail; direction: Direction }[]): void {
  const seen = new Set<Rail>();
  for (const item of array) {
    if (seen.has(item.rail)) {
      throw new Error(`Duplicate rail found: "${item.rail}"`);
    }
    seen.add(item.rail);
  }
}
  const item = this.allCreatedRails.find(entry => entry.rail === rail);
  if (!item) {
    throw new Error(`Rail not found in array, which can only happen if either the placing functions somehow had these array pushes removed or maybe you are calling this in a non-standard manner (i.e., not as a result of using Railway_Placing_Functionality class`);
  }
  return item.direction;
}
  // Place a rail next to an existing rail
  static placeNextTo(otherRail: Rail, extendsInDirection: Direction, length: number) {

const nextToOtherRailEnd = this.recordedRailToEndName(otherRail);
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