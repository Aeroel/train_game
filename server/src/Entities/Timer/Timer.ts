import { Base_Entity } from "#root/Entities/Base_Entity.js"
import { World } from "#root/World.js"
import type { Position, Size} from "#root/Type_Stuff.js"

type Digits_And_Colons = Digit | Colon;
export class Timer extends Base_Entity {
  // timer entity itself just holds parts, there is no point in havinf the timer rectangle itself visible
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

// Digit stuff {
type Digit_Value = 0| 1 | 2 | 3 | 4 | 5  | 6 | 7 | 8 | 9 
export class Digit extends Base_Entity {
  // digit itself is not visible in world, only its parts
  visibility=false;
  value: Digit_Value = 0
  parts: Map<Digit_Part_Designation, Digit_Part> = new Map();
  constructor({x, y, width, height}: Position & Size) {
    super();
    this.x = x;
    this.y=y;
    this.makeParts({width, height});
  }
  getValue() : Digit_Value{
    return this.value;
  }
 setValue(val: Digit_Value) {
   this.value = val;
   let seledParts: Digit_Part[]=[];
   switch(val) {
   case 0:
        this.parts.forEach((p)=>{
          p.visibility= true;
        })
        const midA = this.getPart("midA")
        const midB = this.getPart("midB")
        midA.visibility=false;
        midB.visibility=false;
    break;
   case 1:
        this.parts.forEach((p)=>{
          p.visibility= false;
        })
        const rightVertA = this.getPart("rightVertA");
        const rightVertB = this.getPart("rightVertB");
        rightVertA.visibility=true;
        rightVertB.visibility=true;
    break;
    case 2:
         this.parts.forEach((p)=>{
          p.visibility= false;
        })
         seledParts=this.getParts("topA", "topB", "rightVertA", "midA", "midB", "leftVertB", "botA", "botB");
       seledParts.forEach(p=>{
         p.visibility = true;
       })
    break;
    case 3:
         this.parts.forEach((p)=>{
          p.visibility= false;
        })
         seledParts=this.getParts("topA", "topB", "rightVertA", "rightVertB", "midA", "midB", "botA", "botB");
       seledParts.forEach(p=>{
         p.visibility = true;
       })
    break;
    case 4:
         this.parts.forEach((p)=>{
          p.visibility= false;
        })
         seledParts=this.getParts("leftVertA", "midA", "midB", "rightVertA", "rightVertB");
       seledParts.forEach(p=>{
         p.visibility = true;
       })
    break;
    case 5:
         this.parts.forEach((p)=>{
          p.visibility= false;
        })
         seledParts=this.getParts(
           "topA", "topB", "leftVertA",
           "midA","midB", "rightVertB",
           "botA","botB"
           );
       seledParts.forEach(p=>{
         p.visibility = true;
       })
    break;
    case 6:
         this.parts.forEach((p)=>{
          p.visibility= false;
        })
         seledParts=this.getParts(
           "topA","topB",
           "leftVertA","leftVertB",
           "rightVertB",
           "midA","midB",
           "botA", "botB",
           );
       seledParts.forEach(p=>{
         p.visibility = true;
       })
    break;
    case 7:
         this.parts.forEach((p)=>{
          p.visibility= false;
        })
         seledParts=this.getParts(
          "topA",
          "topB",
          "rightVertA",
          "rightVertB",
           );
       seledParts.forEach(p=>{
         p.visibility = true;
       })
    break;
     case 8:
         this.parts.forEach((p)=>{
          p.visibility= true;
        })
    break;
    case 9:
         this.parts.forEach((p)=>{
          p.visibility= true;
        })
         seledParts=this.getParts(
          "leftVertB"
           );
       seledParts.forEach(p=>{
         p.visibility = false;
       })
    break;
   }
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

getParts<K extends Digit_Part_Designation>(...keys: K[]): Digit_Part[] {
  const result: Digit_Part[] = [];
  keys.forEach(key => {
    const part = this.parts.get(key);
    if (!part) {
      throw new Error(`Part ${key} not found`);
    }
    result.push(part);
  });
  return result;
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
  static isValidValue(num: number) : num is Digit_Value {
    const answer =  (
         num === 0 
      || num === 1
      || num === 2
      || num === 3
      || num === 4
      || num === 5
      || num === 6
      || num === 7
      || num === 8
      || num === 9
      )
      return answer;
    }
    
  
}
type Digit_Part_Designation =  
  | "topA" | "topB" 
  | "midA" | "midB" 
  | "botA" | "botB"
  | "leftVertA" | "leftVertB"
  | "rightVertA" | "rightVertB";
  /* Digit_Parts is not used anywhere,
  But maybe I will replace the parts map with thus instead
  */
  type Digit_Parts = {
    topA: Digit_Part,
    topB: Digit_Part,
    midA: Digit_Part,
    midB: Digit_Part,
    botA: Digit_Part,
    botB: Digit_Part,
    leftVertA: Digit_Part,
    leftVertB: Digit_Part,
    rightVertA: Digit_Part,
    rightVertB: Digit_Part,
  }
class Digit_Part extends Base_Entity {
  constructor({x,y, width, height}: Position & Size){
    super();
    this.setXY(x,y);
    this.width = width;
    this.height = height;
  }
}
// }


export class Colon extends Base_Entity {
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
