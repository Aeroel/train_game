import { World } from "#root/World.js";
import { Rail, type Rail_End_Name, type Rail_End_Name_Alternative } from "#root/Entities/Train_Stuff/Rail.js";
import type { Direction } from "#root/Type_Stuff.js";

export { Railway_Placing_Functionality }

class Railway_Placing_Functionality {
  static place(x: number, y: number, length: number, direction: Direction) {
    let rail = new Rail(); // Default empty rail
    rail.setX(x)
    rail.setY(y);

    switch (direction) {
      case 'right':
        rail.setWidth(length);
        rail.setHeight(10); // Default rail height (horizontal)
        break;
      case 'left':
        rail.setWidth(length);
        rail.setHeight(10); // Default rail height (horizontal)
        rail.x = rail.x - length; // Adjust x to account for leftward movement
        break;
      case 'up':
        rail.setHeight(length);
        rail.setWidth(10); // Default rail width (vertical)
        rail.y = rail.y - length;
        break;
      case 'down':
        rail.setHeight(length);
        rail.setWidth(10); // Default rail width (vertical)
        break;
    }
    World.addEntity(rail); // Add the rail to the world
    return rail;
  }
  static placeSwitch(
    thisRail: Rail,
    thisRailEnd: Rail_End_Name,
    direction: Direction,
    switchLength: number,
    newRailLength: number,) {
    if (!
      (thisRailEnd === "firstEnd" || thisRailEnd === "secondEnd")
    ) {
      throw new Error("Please provide either first or second end name instead of top/left/etc for simplicity");
    }
    const thisEnd = thisRail.getEnd(thisRailEnd);
    const newRail = new Rail();
    World.addEntity(newRail);
    if (thisRail.orientation === 'vertical') {
      // set correct dimensions
      newRail.setWidth(newRailLength);
      newRail.setHeight(10);


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
    else if (thisRail.orientation === "horizontal") {
      // also set correct dimensions
      newRail.setWidth(10);
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
    return newRail;
  }
  // Place a rail next to an existing rail
  static placeNextTo(otherRail: Rail, nextToOtherRailEnd: Rail_End_Name_Alternative, extendsInDirection: Direction, length: number) {
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
    if (nextToOtherRailEnd === 'bottomEnd' && extendsInDirection === 'left') {
      newX += 10;
      length += 10;
    }

    // Now place the next rail based on direction
    let newRail = this.place(newX, newY, length, extendsInDirection);

    return newRail;
  }
}