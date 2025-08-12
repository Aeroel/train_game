import { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Direction, Orientation } from "#root/Type_Stuff.js";
import type {Rail_End } from '#root/Entities/Train_Stuff/Rail.js'
export {Rail_Switch_Wall}
interface Static_Instance_Creator {
  modifiesCarTo: Direction[],
  triggersUponContactWithCarIf: Direction[],
  orientation: Orientation,
  x: number,
  y: number,
  half: number,
  wallThickness: number,
  wallLength: number,
  end: Rail_End,
  wallType: "exit"|"enter"
}
class Rail_Switch_Wall extends Base_Entity {
    triggersUponContactWithCarIf: Direction[] = ['up'];
    modifiesCarTo: Direction[] = ['up']
    constructor(x: number, y: number, triggersUponContactWithCarIf: Direction[], modifiesCarTo: Direction[],width: number, height: number ) {
        super();
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = "blue";

        this.triggersUponContactWithCarIf = triggersUponContactWithCarIf;
        this.modifiesCarTo = modifiesCarTo;
        this.addTag("Rail_Switch_Wall");
    }
    areDirectionsAlignedForTrigger(directions: Direction[]) {
      let identical = true;
      directions.forEach((dir: Direction) => {
        if(!(this.triggersUponContactWithCarIf.includes(dir))) {
          identical = false;
        }
      })
      return identical;
    }
    static getInstance({
      modifiesCarTo, triggersUponContactWithCarIf, x, y, orientation, wallType, wallThickness, wallLength, half,
      end,
    }: Static_Instance_Creator): Rail_Switch_Wall {
       let finalWidth: number;
       let finalHeight: number;
       let finalX: number;
      let finalY: number;
      const thickHalf = wallThickness + half;
      let props: Static_Instance_Creator =    {  modifiesCarTo, triggersUponContactWithCarIf, x, y, orientation, wallType, wallThickness, wallLength, half,
      end,};
      switch(wallType) {
         case "enter":
           const props = 
          break;
          
       
      }
       return new Rail_Switch_Wall()
       
       
    }
    
    enterWall({
      modifiesCarTo, triggersUponContactWithCarIf, x, y, orientation, wallType, wallThickness, wallLength, half,
      end, 
    }: Static_Instance_Creator) {
            const thickHalf = wallThickness + half;
             let finalWidth: number;
       let finalHeight: number;
       let finalX: number;
      let finalY: number;
                   switch(orientation) {
         case "vertical":
              switch(end.name) {
                case "secondEnd":
                   finalX = end.x - half;
                   finalY= end.y + thickHalf;
                break;
              }
              finalWidth = wallLength;
              finalHeight = wallThickness;
          break;
          case "horizontal":
             switch(end.name) {
               case "firstEnd":
                   finalX = end.x - thickHalf;
                   finalY = end.y - half;
                break;
             }
          break;
       }
    }
    exitWall({
      modifiesCarTo, triggersUponContactWithCarIf, x, y, orientation, wallThickness, wallLength,
      end, half, wallType
    }: Static_Instance_Creator) {
            const thickHalf = wallThickness + half;
             let finalWidth: number;
       let finalHeight: number;
       let finalX: number;
      let finalY: number;
             switch(orientation) {
         case "vertical":
              switch(end.name) {
                case "secondEnd":
                   finalX = end.x - half;
                   finalY= end.y + thickHalf;
                break;
              }
              finalWidth = wallLength;
              finalHeight = wallThickness;
          break;
          case "horizontal":
             switch(end.name) {
               case "firstEnd":
                   finalX = end.x - thickHalf;
                   finalY = end.y - half;
                break;
             }
          break;
       }
    }

}