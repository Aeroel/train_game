import { World } from "#root/World.js";
import { Chained_Placement } from "#root/Chained_Placement.js";
import { Rail, type Rail_End_Name, type Rail_End_Name_Alternative } from "#root/Entities/Train_Stuff/Rail.js";
import type { Direction } from "#root/Type_Stuff.js";

type Stored_Placed_Rail = {
  rail: Rail, 
  direction: Direction,
  endsAvailableForPlacement: Rail_End_Name[]
}
export { Railway_Placing_Functionality }

class Railway_Placing_Functionality  {
static railThickness = 10;
  static place(x: number, y: number, length: number, direction: Direction) {
    let newRail = new Rail(); // Default empty 
      World.addEntity(newRail);
    
     Chained_Placement.place({
      entity: newRail,
      x,
      y, 
      length,
      thickness: this.railThickness,
      direction,
    })
    
    return newRail;
  }
  
  
  static placeSwitch(
    thisRail: Rail,
    direction: Direction,
    switchLength: number,
    newRailLength: number,) {
      const newRail= new Rail()
      World.addEntity(newRail);
     Chained_Placement.placeSwitch({    otherEntity:thisRail,
      newEntity: newRail,
      direction,
      switchLength,
      newEntityLength: newRailLength,
      thickness: this.railThickness,
     });
     
    return newRail;
  }
  

  static placeNextTo(otherRail: Rail, extendsInDirection: Direction, length: number) {
    const newRail = new Rail();
   World.addEntity(newRail);
   Chained_Placement.placeNextTo({newEntity: newRail, otherEntity: otherRail, extendsInDirection: extendsInDirection, length, thickness: this.railThickness});
  
    return newRail;
  }
}