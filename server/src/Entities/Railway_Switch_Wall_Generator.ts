import type { Rail, Rail_End_Name, Rail_End} from "#root/Entities/Train_Stuff/Rail.js"
import type { Direction } from "#root/Type_Stuff.js"
import { Rail_Switch_Wall} from "#root/Entities/Train_Stuff/Rail_Switch_Wall.js";
import { World } from "#root/World.js";

     type Rail_Holder={
       rail: Rail
     }   
interface Railway_Switch_Wall_Generator_Constructor {
          railsArr: Rail_Holder[],
          thicknessWall: number,
          carSquareSize: number,
        
}

export class Railway_Switch_Wall_Generator {
          railsArr: Rail_Holder[];
          thicknessWall: number;
          lengthWall: number;
          half: number;
          thickHalf: number;
          lenHalf: number;
  constructor({
          railsArr,
          thicknessWall, carSquareSize
        }: Railway_Switch_Wall_Generator_Constructor) {
          this.railsArr = railsArr;
          this.thicknessWall = thicknessWall;
          this.lengthWall = carSquareSize;
          this.half = 0.5*carSquareSize;
          this.thickHalf = this.thicknessWall + this.half;
          this.lenHalf = this.lengthWall + this.half;
          this.placeSwitchWallsThroughout();
        }
        
        
        placeSwitchWallsThroughout() {
          console.log("\nMethod 4 - Higher-order function:");
          const gentor = this;
forEachCircular(this.railsArr, (current, prev, next, index) => {
    gentor.process(current, prev, next, index)
});
        }
        

        process(current: Rail_Holder, prev: Rail_Holder, next: Rail_Holder, index: number) {
            console.log(`[${index}] ${current.rail.id} (prev: ${prev.rail.id}, next: ${next.rail.id})`);
    const endNames: Rail_End_Name[]=  ["firstEnd","secondEnd"];
endNames.forEach((endName: Rail_End_Name) => {
      const end = current.rail.getEnd(endName);
      const orientation= current.rail.getOrientation();
      const connectedOtherEnd = current.rail.connections[endName]; 
      if(!(connectedOtherEnd)) {
        console.log(`skipping rail end named ${endName} since it has no connections (implication is that if it had it would be connected to rail of same orientation, but we do not need to build switch walls for this kind of situation, so...`)
        return;
      }
      
      const exitModifiesTo: Direction[]=[];
      const exitAccepts: Direction[] =[];
      const enterModifiesTo: Direction[]=[];
      const enterAccepts:Direction[]=[];
      let enterLocatedOn: Direction="up";//up just default init, not to be used
      switch(orientation) {
        case "vertical":
          if(connectedOtherEnd.x === end.x) {
               this.mustNeverBeCalled();
          }  
          if(connectedOtherEnd.x > end.x) {
              exitModifiesTo.push("right");
              enterAccepts.push("left");
              enterLocatedOn="left";
          } else {
          exitModifiesTo.push("left");
          enterAccepts.push("right");
          enterLocatedOn="right";
          }
          if(end.name==="secondEnd") {
            exitAccepts.push("down")
            exitModifiesTo.push("down")
            enterAccepts.push("up");
            enterModifiesTo.push("up")
          } else {
              exitAccepts.push("up")
            exitModifiesTo.push("up")
             enterAccepts.push("down");
             enterModifiesTo.push("down");
          }
        break;
        case "horizontal":
          if(connectedOtherEnd.y === end.y) {
              this.mustNeverBeCalled(); 
          }       
            if(connectedOtherEnd.y > end.y) {
              exitModifiesTo.push("down");
              enterAccepts.push("up");
              enterLocatedOn="up";
          } else {
          exitModifiesTo.push("up");
          enterAccepts.push("down");
          enterLocatedOn="down";
          }
          if(end.name==="secondEnd") {
            exitAccepts.push("right")
            exitModifiesTo.push("right")
            enterAccepts.push("left");
            enterModifiesTo.push("left")
          } else {
              exitAccepts.push("left")
            exitModifiesTo.push("left")
             enterAccepts.push("right");
             enterModifiesTo.push("right");
          }
        break;
      }
      console.log(`endName${endName}->exitModifiesTo:${JSON.stringify(exitModifiesTo)}, exitAccepts:${JSON.stringify(exitAccepts)},
      enterModifiesTo ${JSON.stringify(enterModifiesTo)}, enterAccepts ${JSON.stringify(enterAccepts)}, enterLocatedOn ${JSON.stringify(enterLocatedOn)}

      `);
      // exit
     World.addEntity(
        Rail_Switch_Wall.getInstance({
          end, half: this.half,
           x:end.x, y: end.y,
           modifiesCarTo: exitModifiesTo,
           triggersUponContactWithCarIf: exitAccepts,
           orientation: current.rail.getOrientation(),
           wallThickness: this.thicknessWall,
         wallLength: this.lengthWall, wallType:"exit" 
          })
        );
        
        // entrance
     World.addEntity(
        Rail_Switch_Wall.getInstance({
          end, half: this.half, wallType: "enter",
           x:end.x, y: end.y,
           modifiesCarTo: enterModifiesTo,
           triggersUponContactWithCarIf: enterAccepts,
           orientation: current.rail.getOrientation(),
           wallThickness: this.thicknessWall,
         wallLength: this.lengthWall  
          })
        );
    });
        }
        
        
    mustNeverBeCalled() {
        throw new Error
        /*console.log*/("Must never reach this point since I handle the aligned rails by not connenctikg them. So I guess I accidentally might have connected some")
    }    
}



function forEachCircular<T>(
  array: T[], 
  callback: (current: T, previous: T, next: T, index: number) => void
) {
  const length = array.length;
  
  if (length === 0) return;
  
  for (let i = 0; i < length; i++) {
    const prevIndex = (i - 1 + length) % length;
    const nextIndex = (i + 1) % length;
    
    callback(array[i], array[prevIndex], array[nextIndex], i);
  }
}
