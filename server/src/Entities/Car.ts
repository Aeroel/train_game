

import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Wall } from "#root/Entities/Wall.js";
import { World } from "#root/World.js";
import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js"
import { Pushable_Entity_With_Unpushable_Entities } from "#root/Collision_Stuff/Collision_Resolution_Methods/Pushable_Entity_With_Unpushable_Entities.js"

import type { Position } from "#root/Type_Stuff.js";

export { Car };
class Car extends Base_Entity {
 controls={
   right:false,
   left:false,
   up:false,
   down:false,
 }
 visibility=false;
 normalSpeedForBothAxes=0.1250;
 speedX= this.normalSpeedForBothAxes;
 speedY= this.normalSpeedForBothAxes;
  lastMovDirChange=0;
  changeEvery=1000;
  parts: Base_Entity[]=[]
  constructor({x,y}: {x:number,y:number}) {
    super();
    this.x=x;
    this.y=y;
    this.addTag("Car");
    this.color="purple"
    this.parts.push(new Wall().setXY(x,y).setWidth(400).setHeight(40).setColor(this.color))
    this.parts.push(new Wall().setXY(x,y).setWidth(40).setHeight(400).setColor(this.color))
    this.parts.push(new Wall().setXY(x+400,y).setWidth(40).setHeight(400).setColor(this.color))
    this.parts.push(new Wall().setXY(x,y+400).setWidth(400).setHeight(40).setColor(this.color))
  }
  
  addPartsToWorld({setThisToTrueToIndicateThatYouCalledThisFromWorld}: {setThisToTrueToIndicateThatYouCalledThisFromWorld: boolean}) {
    super.addPartsToWorld({setThisToTrueToIndicateThatYouCalledThisFromWorld})
     this.parts.forEach(p=>{
       World.addEntity(p)
     })
    
  }
  setColor(val: string){
    this.color=val;
    this.parts.forEach(p=>{
      p.color=val;
    })
    return this;
  }
  updateState() {
   setTimeout(()=>{
     this.speedX=2
     this.speedY=2
     this.setColor("yellow")
   }, 20000)
   this.dirUpdate();
    if (this.controls.right) {
      this.velocity.x.Add_Component({key:"Car_Controls", value:this.speedX});
    } else if (this.controls.left) {
      this.velocity.x.Add_Component({key:"Car_Controls",value: -this.speedX});
    }
    if (this.controls.up) {
      this.velocity.y.Add_Component({key:"Car_Controls", value:-this.speedY});
    }
    else if (this.controls.down) {
      this.velocity.y.Add_Component({key:"Car_Controls", value:this.speedY});
    }
    this.parts.forEach(w=>{
      w.vx=this.vx;
      w.vy=this.vy;
    })
  }

dirUpdate(){
  const now = Date.now()
  if(now < this.lastMovDirChange + this.changeEvery) {
    return
  }
  this.lastMovDirChange= now;
  this.controls.right=false;
  this.controls.left=false;
  this.controls.up=false;
  this.controls.down=false;

if(Math.random()>0.5) {
  return;
}

  if(Math.random() > 0.5) {
    this.controls.right= true;
  } else {
    this.controls.left= true;
  }
  if(Math.random() > 0.5) {
    this.controls.up= true;
  } else {
    this.controls.down  = true;
  }
  
}


}