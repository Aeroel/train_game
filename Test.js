Implement full functionality of the railway placer... Only include code of the solution in your message. Code should be clean and clear and readable.

The world is a 2d world of xy. All objects are rectangles. There is no rotation.  Objects can move on x or y axis or simultaneously. Trains generally move on either x or y but when switching rails, they collide with switch walls and the walls modify their movement directions according to the setup beforehand (the one you will  write)
 here is some more reference info.
// rail.ts
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Helper_Functions } from "#root/Helper_Functions.js";
import type { Point, Position } from "#root/Type_Stuff.js";
import { Assert_That_Numbers_Are_Finite } from "#root/Type_Validation_Stuff.js";

export { Rail };

export type Rail_End_Name = "firstEnd" | "secondEnd";
export type Rail_End_Name_Alternative = Rail_End_Name | "topEnd" | "bottomEnd" | "leftEnd" | "rightEnd";

export type Rail_End = {
    name: Rail_End_Name
} & Position;

export type Rail_Orientation = "vertical" | "horizontal";


class Rail extends Base_Entity {
    //  left right is for hori, top bot is for vert

    twoPossibleEnds = ["firstEnd", "secondEnd"];
    defaultInitialOrientationValue: Rail_Orientation = 'horizontal';
    orientation: Rail_Orientation = this.defaultInitialOrientationValue;
    constructor() {
        super();
        this.addTag("Rail");
        this.setColor("purple");
    }


    setWidth(width: number) {
        super.setWidth(width);
        this.orientation = this.width > this.height ? 'horizontal' : 'vertical';
    }
    
    
    setHeight(height: number) {
        super.setHeight(height);
        this.orientation = this.width > this.height ? 'horizontal' : 'vertical';
    }


    getEnd(endType: Rail_End_Name | Rail_End_Name_Alternative) {
        if (this.orientation === 'horizontal') {
            if (endType === 'secondEnd' || endType === 'rightEnd') {
                return { x: this.x + this.width, y: this.y };
            } else if (endType === 'firstEnd' || endType === 'leftEnd') {
                return { x: this.x, y: this.y };
            }
        } else if (this.orientation === 'vertical') {
            if (endType === 'secondEnd' || endType === 'bottomEnd') {
                return { x: this.x, y: this.y + this.height };
            } else if (endType === 'firstEnd' || endType === 'topEnd') {
                return { x: this.x, y: this.y };
            }
        }
        // Default (if no matching end type)
        throw new Error(`${endType} does not 
        match any valid value...`);
    }
    
    
    calculateDistance(point1: Point, point2: Point) {
        return Math.hypot(point1.x - point2.x, point1.y - point2.y);
    }


    getEndClosestTo(point: Point) {
        Assert_That_Numbers_Are_Finite({pointX: point.x, pointY: point.y});

        const firstEnd = this.getEnd("firstEnd");
        const secondEnd = this.getEnd("secondEnd");

        const distanceToFirstEnd = Math.sqrt(
            Math.pow(point.x - firstEnd.x, 2) +
            Math.pow(point.y - firstEnd.y, 2)
        );

        const distanceToSecondEnd = Math.sqrt(
            Math.pow(point.x - secondEnd.x, 2) +
            Math.pow(point.y - secondEnd.y, 2)
        );


        let closestEnd: Rail_End;

        if (isNaN(distanceToFirstEnd) || isNaN(distanceToSecondEnd)) {
            throw new Error(`DTFE and DTSE must be numbers, one or both are NaN`);
        }
        if (distanceToFirstEnd < distanceToSecondEnd) {
            closestEnd = {name: 'firstEnd' as Rail_End_Name, x: firstEnd.x, y: firstEnd.y};

        } else if (distanceToFirstEnd > distanceToSecondEnd) {
            closestEnd = {name: 'secondEnd' as Rail_End_Name, x: secondEnd.x, y: secondEnd.y};
        } else {
            throw new Error("Hm? ");
        }

        return closestEnd;
    }

}
//typestuff.ts
Type Direction = "left"|"right"|"down"|"up"
// placer.ts
export interface Railway_Placer_Required_Inputs {
       x: number, y: number, railLength: number, switchGapLength: number, carSquareSize: number, switchWallThickness: number, switchWallLength: number
     }
 export type Pair_Of_Rails =  {
   railA: Rail,
   railB: Rail
 }
 import { Rail } from "#root/Entities/Train_Stuff/Rail.js"
 import type { Direction } from "#root/Type_Stuff.js"

export class Railway_Placer {
  constructor({
       x, y, railLength, switchGapLength, carSquareSize, switchWallThickness, switchWallLength
     }: Railway_Placer_Required_Inputs) {
     
  }
  placeFirstPairOfRails(direction: Direction): Pair_Of_Rails {
    // placeholder return statement
    return {railA: new Rail(), railB: new Rail()}
  }
  
  
  placeNextTo(pair: Pair_Of_Rails, direction: Direction): Pair_Of_Rails {
    // placeholder return statement
    return {railA: new Rail(), railB: new Rail()}
  }
  
  
  
  generateRailSwitchWalls() {
    
  }
}

According to the following logic:

Usage:
static abstractAddRailway(params: Railway_Placer_Required_Inputs) {
  const railwayPlacer = new Railway_Placer(params);
  
  const railPairOne = railwayPlacer.placeFirstPairOfRails("down");
  const railPairTwo = railwayPlacer.placeNextTo(railPairOne, "right");
  const railPairThree = railwayPlacer.placeNextTo(railPairTwo, "right");
  const railPairFour = railwayPlacer.placeNextTo(railPairThree, "up");
  const railPairFive = railwayPlacer.placeNextTo(railPairFour, "left");
  const railPairSix = railwayPlacer.placeNextTo(railPairFive, "left");
  
  railwayPlacer.generateRailSwitchWalls();
}

// current undesirable method to be repladed by placer class:
Func() {
Two Parallel railways
Addrailway()
Addrailway2()
}
    static addARailway(x: number, y: number, mainLength: number, switchLength: number) {
        

        // offset of right track 
        const offsetOfRight = (mainLength - (2 * this.carSquareSize));





        const rail2_0 = Railway_Placing_Functionality.place(x,y,mainLength, "down", );
        const rail3_0 = Railway_Placing_Functionality.placeSwitch(rail2_0, "secondEnd", "right", switchLength, mainLength);
        const rail4_0 = Railway_Placing_Functionality.placeNextTo(rail3_0, "rightEnd", "right", mainLength);
        const rail5_0 = Railway_Placing_Functionality.placeSwitch(rail4_0, "secondEnd", "up", switchLength, mainLength );
        
        
        
        
          const rail6_0 = Railway_Placing_Functionality.placeSwitch(rail5_0, "firstEnd", "left", switchLength, mainLength);
          
          const rail7_0 = Railway_Placing_Functionality.placeNextTo(rail6_0, "firstEnd", "left", mainLength)


const carSquareSize = Add_Some_Entities_To_The_World.carSquareSize;
const thicknessWall = 10;
const lengthWall = 150;
const offset = carSquareSize * 2;
const half = carSquareSize*0.5;
        const rail2BotEnd = rail2_0.getEnd("secondEnd");
        console.log("is " + JSON.stringify(rail2BotEnd))
        const wall = new Rail_Switch_Wall(rail2BotEnd.x - (half) , 
        rail2BotEnd.y + (half), ["down"], ["down", "right"], lengthWall, thicknessWall);
        World.addEntity(wall);
        
        const rail3LeftEnd = rail3_0.getEnd("firstEnd");
        console.log("is " + JSON.stringify(rail3LeftEnd))
        const wall2 = new Rail_Switch_Wall(rail3LeftEnd.x - half, rail3LeftEnd.y + half, ["down", "right"], ["right"], lengthWall, thicknessWall);
        World.addEntity(wall2);
        
        
       const three = rail4_0.getEnd("secondEnd");
        console.log("is " + JSON.stringify(three))
        const wall3 = new Rail_Switch_Wall(three.x +(carSquareSize/2), three.y- half, ["right"], ["right", "up"], thicknessWall, lengthWall);
        World.addEntity(wall3);
        
       const four = rail5_0.getEnd("secondEnd");
        console.log("is " + JSON.stringify(four))
        const wall4 = new Rail_Switch_Wall(four.x + half , four.y - (carSquareSize/2), ["up", "right"], ["up"], thicknessWall, lengthWall);
        World.addEntity(wall4);
        
        
        const five = rail5_0.getEnd("firstEnd")
        World.addEntity(new Rail_Switch_Wall(
          five.x - half, five.y - half, ["up"], ["up","left"], lengthWall, thicknessWall
          ));
          
          const six = rail6_0.getEnd("secondEnd");
          World.addEntity(new Rail_Switch_Wall(
            six.x - half, six.y - half, ["up", "left"], ["left"], lengthWall, thicknessWall
            ));
            
            const seven = rail7_0.getEnd("firstEnd");
            World.addEntity(new Rail_Switch_Wall(
              seven.x - (0.5*carSquareSize), seven.y-(0.5*carSquareSize), ["left"],["left", "down"], thicknessWall, lengthWall
              ));
              
              const eight = rail2_0.getEnd("firstEnd");
              World.addEntity(new Rail_Switch_Wall(
                eight.x - half, eight.y - half, ["left", "down"], ["down"], thicknessWall,lengthWall
                ));
          
        return rail2_0;

    }

    static addARailway2(x: number, y: number, mainLength: number, switchLength: number) {
        
        // offset of right track 
        const offsetOfRight = (mainLength - (2 * this.carSquareSize));





        const rail2_0 = Railway_Placing_Functionality.place(x,y,mainLength + 200, "down", );
        const rail3_0 = Railway_Placing_Functionality.placeSwitch(rail2_0, "secondEnd", "right", switchLength, mainLength+1200);
        const rail4_0 = Railway_Placing_Functionality.placeNextTo(rail3_0, "rightEnd", "right", mainLength);
        const rail5_0 = Railway_Placing_Functionality.placeSwitch(rail4_0, "secondEnd", "up", switchLength, mainLength+200 );
        
        
        
        
          const rail6_0 = Railway_Placing_Functionality.placeSwitch(rail5_0, "firstEnd", "left", switchLength, mainLength);
          
          const rail7_0 = Railway_Placing_Functionality.placeNextTo(rail6_0, "firstEnd", "left", mainLength+1200)


const carSquareSize = Add_Some_Entities_To_The_World.carSquareSize;
const half = 0.5*carSquareSize
const thicknessWall = 10;
const lengthWall = 150;
const offset = carSquareSize * 2;
        const rail2BotEnd = rail2_0.getEnd("secondEnd");
        console.log("is " + JSON.stringify(rail2BotEnd))
        const wall = new Rail_Switch_Wall(rail2BotEnd.x - half , 
        rail2BotEnd.y + half, ["down"], ["down", "right"], lengthWall, thicknessWall);
        World.addEntity(wall);
        
        const rail3LeftEnd = rail3_0.getEnd("firstEnd");
        console.log("is " + JSON.stringify(rail3LeftEnd))
        const wall2 = new Rail_Switch_Wall(rail3LeftEnd.x - half, rail3LeftEnd.y + half, ["down", "right"], ["right"], lengthWall, thicknessWall);
        World.addEntity(wall2);
        
        
       const three = rail4_0.getEnd("secondEnd");
        console.log("is " + JSON.stringify(three))
        const wall3 = new Rail_Switch_Wall(three.x + half, three.y - half, ["right"], ["right", "up"], thicknessWall, lengthWall);
        World.addEntity(wall3);
        
       const four = rail5_0.getEnd("secondEnd");
        console.log("is " + JSON.stringify(four))
        const wall4 = new Rail_Switch_Wall(four.x + half, four.y - half, ["up", "right"], ["up"], thicknessWall, lengthWall);
        World.addEntity(wall4);
        
        
        const five = rail5_0.getEnd("firstEnd")
        World.addEntity(new Rail_Switch_Wall(
          five.x - half, five.y - half, ["up"], ["up","left"], lengthWall, thicknessWall
          ));
          
          const six = rail6_0.getEnd("secondEnd");
          World.addEntity(new Rail_Switch_Wall(
            six.x - half, six.y - half, ["up", "left"], ["left"], lengthWall, thicknessWall
            ));
            
            const seven = rail7_0.getEnd("firstEnd");
            World.addEntity(new Rail_Switch_Wall(
              seven.x - (0.5*carSquareSize), seven.y-(0.5*carSquareSize), ["left"],["left", "down"], thicknessWall, lengthWall
              ));
              
              const eight = rail2_0.getEnd("firstEnd");
              World.addEntity(new Rail_Switch_Wall(
                eight.x - (half), eight.y - half, ["left", "down"], ["down"], thicknessWall,lengthWall
                ));
            
     // below is sensors for the inner railway    

     const nine = rail2_0.getEnd("firstEnd");
              World.addEntity(new Rail_Switch_Wall(
                nine.x - (0.5*carSquareSize), nine.y - (0.5*carSquareSize), ["up",], ["up","right"], lengthWall,thicknessWall
                ));

     const ten = rail7_0.getEnd("firstEnd");
              World.addEntity(new Rail_Switch_Wall(
                ten.x - (0.5*carSquareSize), ten.y - (0.5*carSquareSize), ["up","right",], ["right"], lengthWall,thicknessWall
                ));  
              
           const eleven = rail6_0.getEnd("secondEnd");
              World.addEntity(new Rail_Switch_Wall(
                eleven.x + (0.5*carSquareSize), eleven.y - (0.5*carSquareSize), ["right",], ["down","right"], thicknessWall,lengthWall
                ));
                
           const twelve = rail5_0.getEnd("firstEnd");
              World.addEntity(new Rail_Switch_Wall(
                twelve.x + (0.5*carSquareSize), twelve.y - (0.5*carSquareSize), ["down","right",], ["down",], thicknessWall,lengthWall
                ));
                
           const thirteen = rail5_0.getEnd("secondEnd");
              World.addEntity(new Rail_Switch_Wall(
                thirteen.x - (0.5*carSquareSize), thirteen.y + (0.5*carSquareSize), ["down",], ["down","left"], lengthWall,thicknessWall
                ));
                
           const fourteen = rail4_0.getEnd("secondEnd");
              World.addEntity(new Rail_Switch_Wall(
                fourteen.x - (0.5*carSquareSize), fourteen.y + (0.5*carSquareSize), ["down","left"], ["left"], lengthWall,thicknessWall
                ));
                
           const fifteen = rail3_0.getEnd("firstEnd");
              World.addEntity(new Rail_Switch_Wall(
                fifteen.x - (0.5*carSquareSize), fifteen.y - (0.5*carSquareSize), ["left"], ["left","up"], thicknessWall,lengthWall
                ));  
                
           const sixteen = rail2_0.getEnd("secondEnd");
              World.addEntity(new Rail_Switch_Wall(
                sixteen.x - (0.5*carSquareSize), sixteen.y - (0.5*carSquareSize), ["left","up"], ["up"], thicknessWall,lengthWall
                ));          
                
                
          return rail2_0;
   }

// railswitchwall.ts
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Direction } from "#root/Type_Stuff.js";
export {Rail_Switch_Wall}
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

}