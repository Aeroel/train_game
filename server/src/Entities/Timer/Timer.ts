import { Base_Entity } from "#root/Entities/Base_Entity.js"
import { World } from "#root/World.js"
import type { Position, Size} from "#root/Type_Stuff.js"

type Digits_And_Colons = Digit | Colon;
export class Timer extends Base_Entity {
  visibility =false;
  parts: Digits_And_Colons[] = [];
  constructor({x, y, width, height}: Position & Size) {
    super();

    const digitOne =  new Digit({x,y, width, height})
    const colonOne = new Colon({x: x + width, y, width, height})
    this.parts.push(digitOne)
   // this.parts.push(colonOne)
  }
  addPartsToWorld({setThisToTrueToIndicateThatYouCalledThisFromWorld}: {setThisToTrueToIndicateThatYouCalledThisFromWorld: boolean}) {
    super.addPartsToWorld({setThisToTrueToIndicateThatYouCalledThisFromWorld})
     this.parts.forEach(p=>{
       World.addEntity(p)
     })
    
  }
}
type Digit_Value = 0| 1 | 2 | 3 | 4 | 5  | 6 | 7 | 8 | 9 
class Digit extends Base_Entity {
  visibility=false;
  value: Digit_Value = 0
  parts: Map<Digit_Part_Designation, Digit_Part> = new Map();
  constructor({x, y, width, height}: Position & Size) {
    super();
    this.x = x;
    this.y=y;
    this.makeParts({width, height});
  }

  makeParts({width, height}: Size) {
   const horizontalPartWidth = width / 2;
   const horizontalPartHeight = height / 10;
   const verticalPartWidth = width / 10;
   const verticalPartHeight = height / 2;

    // 10 parts
    // top two ones
    this.addPart("topA",new Digit_Part({
      x: this.x,
      y: this.y, 
      width: horizontalPartWidth, 
      height: horizontalPartHeight
    }));
    this.addPart("topB",new Digit_Part({
      x: this.x + horizontalPartWidth,
      y: this.y, 
      width: horizontalPartWidth, 
      height: horizontalPartHeight
    }));
    // two middle horizontal ones
    this.addPart("midA",new Digit_Part({
      x: this.x,
      y: this.y + verticalPartHeight, 
      width: horizontalPartWidth, 
      height: horizontalPartHeight
    }));
    this.addPart("midB",new Digit_Part({
      x: this.x + horizontalPartWidth,
      y: this.y + verticalPartHeight, 
      width: horizontalPartWidth, 
      height: horizontalPartHeight
    }));
    // two bottom horizontal ones
    this.addPart("botA",new Digit_Part({
      x: this.x,
      y: this.y + ( verticalPartHeight * 2), 
      width: horizontalPartWidth, 
      height: horizontalPartHeight
    }));
    this.addPart("botB",new Digit_Part({
      x: this.x + horizontalPartWidth,
      y: this.y + (verticalPartHeight * 2 ), 
      width: horizontalPartWidth, 
      height: horizontalPartHeight
    }));
    
    // two left vertical 
    this.addPart("leftVertA",new Digit_Part({
      x: this.x, 
      y: this.y, 
      width: verticalPartWidth, 
      height: verticalPartHeight
    }));
    this.addPart("leftVertB",new Digit_Part({
      x: this.x, 
      y: this.y + verticalPartHeight, 
      width: verticalPartWidth, 
      height: verticalPartHeight
    }));
    // two right vertical
    this.addPart("rightVertA",new Digit_Part({
      x: this.x + (horizontalPartWidth *2), 
      y: this.y, 
      width: verticalPartWidth, 
      height: verticalPartHeight
    }));
    this.addPart("rightVertB",new Digit_Part({
      x: this.x + (horizontalPartWidth*2), 
      y: this.y + verticalPartHeight, 
      width: verticalPartWidth, 
      height: verticalPartHeight
    }));
  }
addPart(designation: Digit_Part_Designation, entity: Digit_Part) {
    this.parts.set(designation, entity);
  }
  
  getPart(designation: Digit_Part_Designation): Digit_Part {
    const part= this.parts.get(designation);
    if(!part) {
      throw new Error(`part ${designation} not found`)
      }
    return part;
  }
  addPartsToWorld(
    {setThisToTrueToIndicateThatYouCalledThisFromWorld}
    : {setThisToTrueToIndicateThatYouCalledThisFromWorld: boolean}
    ){
    super.addPartsToWorld({setThisToTrueToIndicateThatYouCalledThisFromWorld});
    this.parts.forEach((part, partName)=>{
      World.addEntity(part);
    })
  }
}
class Colon extends Base_Entity {
  twoDots: Base_Entity[]=[];
  constructor({x,y,width,height} : Position & Size) {
    super();
    this.setXY(x,y);
    this.twoDots.push(new Base_Entity());
    this.twoDots.push(new Base_Entity());
    this.twoDots[0].x = x;
    this.twoDots[0].y = y;
    this.twoDots[1].x = x;
    this.twoDots[1].y = y + (height);
    this.twoDots.forEach(dot=>{
      dot.width= width / 10;
      dot.height = height / 10;
    })
  }
  addPartsToWorld(
    {setThisToTrueToIndicateThatYouCalledThisFromWorld}
    : {setThisToTrueToIndicateThatYouCalledThisFromWorld: boolean}) {
    super.addPartsToWorld({setThisToTrueToIndicateThatYouCalledThisFromWorld});
    this.twoDots.forEach(dot=>{
      World.addEntity(dot)
    })
  }
}
type Digit_Part_Designation =  
  | "topA" | "topB" 
  | "midA" | "midB" 
  | "botA" | "botB"
  | "leftVertA" | "leftVertB"
  | "rightVertA" | "rightVertB";
class Digit_Part extends Base_Entity {
  constructor({x,y, width, height}: Position & Size){
    super();
    this.setXY(x,y);
    this.width = width;
    this.height = height;
  }
}