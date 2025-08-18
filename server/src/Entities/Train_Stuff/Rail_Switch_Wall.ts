import { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Direction, Orientation } from "#root/Type_Stuff.js";
import type {Rail_End_Name } from '#root/Entities/Train_Stuff/Rail.js'
export {Rail_Switch_Wall}
interface Static_Instance_Creator {
  modifiesCarTo: Direction[],
  triggersUponContactWithCarIf: Direction[],
  orientation: Orientation,
  x: number,
  y: number,
  location: null | Direction,
  carSquareSize: number,
  wallThickness: number,
  wallLength: number,
  endName: Rail_End_Name,
  wallType: "exit"|"enter"
}

interface Static_Instance_Creator_With_WH extends Static_Instance_Creator{
  width: number,
  height: number,
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
    

    
    areDirectionsAlignedForTrigger(directions: Direction[] | null) {
      if(directions === null) {
        throw new Error("areDirectionsAlignedForTrigger does not expect directions to be null. Do not call it like this. Check beforehand.")
      }
      let identical = true;
      directions.forEach((dir: Direction) => {
        if(!(this.triggersUponContactWithCarIf.includes(dir))) {
          identical = false;
        }
      })
      return identical;
    }
    static getInstance(params: Static_Instance_Creator): Rail_Switch_Wall {

      let result: Static_Instance_Creator_With_WH = {...params, width:0, height:0};
      switch(params.wallType) {
         case "enter":
            result = this.enterWall(params); 
          break;
          case "exit":
            result = this.exitWall(params);
          break;
       
      }
       return new Rail_Switch_Wall( result.x ,  result.y, params.triggersUponContactWithCarIf, params.modifiesCarTo, result.width, result.height )
       
       
    }
    
  static  enterWall(params: Static_Instance_Creator) {
      const {endName, carSquareSize, x, y, wallThickness, wallLength} = params;
      
      const half = 0.5*carSquareSize;
       const thickHalf = wallThickness + half;
  
       let finalWidth=0;
       let finalHeight=0;
       let finalX=0;
      let finalY=0;
         switch(params.orientation) {
         case "vertical":
                  if(params.location==="left") {
                       finalX = x - thickHalf;
                  } else {
                      finalX= x + thickHalf
                  }
              switch(endName) {                case "firstEnd":
                   finalY= y - half;
                break;
                case "secondEnd":
                   finalY= y - half;
                break;
              }
              finalWidth = wallThickness;
              finalHeight = wallLength;
          break;
          case "horizontal":
               if(params.location==="up") {
                       finalY = y - thickHalf;
                  } else {
                      finalY= y + thickHalf
                  }
              switch(endName) {                case "firstEnd":
                   finalX= x - half;
                break;
                case "secondEnd":
                   finalX= x - half;
                break;
              }
              finalWidth = wallLength;
              finalHeight = wallThickness;
          break;
       }
       const retParams: Static_Instance_Creator_With_WH = {
        ...params,
        x: finalX,
        y: finalY,
        width: finalWidth,
        height: finalHeight
       }
       return retParams;
    }
    
    
   static exitWall(params: Static_Instance_Creator) {
      const {endName, carSquareSize, x, y, wallThickness, wallLength} = params;
      
      const half = 0.5*carSquareSize;
       const thickHalf = wallThickness + half;
  
       let finalWidth=0;;
       let finalHeight=0;
       let finalX=0;
      let finalY=0;
         switch(params.orientation) {
         case "vertical":
              switch(endName) {                case "firstEnd":
                   finalY= y - thickHalf;
                break;
                case "secondEnd":
                   finalY= y + thickHalf;
                break;
              }
              finalX = x - half;
              finalWidth = wallLength;
              finalHeight = wallThickness;
          break;
          case "horizontal":
              switch(endName) {                case "firstEnd":
                   finalX= x - thickHalf;
                break;
                case "secondEnd":
                   finalX= x + thickHalf;
                break;
              }
              finalY = y - half;
              finalWidth = wallThickness;
              finalHeight = wallLength;
          break;
       }
       const retParams: Static_Instance_Creator_With_WH = {
        ...params,
        x: finalX,
        y: finalY,
        width: finalWidth,
        height: finalHeight
       }
       return retParams;
    }

}