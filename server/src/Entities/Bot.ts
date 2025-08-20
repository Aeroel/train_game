

import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js"
import { Pushable_Entity_With_Unpushable_Entities } from "#root/Collision_Stuff/Entity_Interactions/Pushable_Entity_With_Unpushable_Entities.js"

import type { Position } from "#root/Type_Stuff.js";

export { Bot };
class Bot extends Base_Entity {
 controls={
   right:false,
   left:false,
   up:false,
   down:false,
 }
 normalSpeedForBothAxes=0.125;
 speedX= this.normalSpeedForBothAxes;
 speedY= this.normalSpeedForBothAxes;
  lastMovDirChange=0;
  changeEvery=1000;
  constructor() {
    super();
    this.addTag("Bot");
    this.addTag("Wall")
    this.addTag("Can_Ride_Train");
  }
  
  updateState() {

   this.dirUpdate();
    if (this.controls.right) {
      this.velocity.x.Add_Component({key:"Bot_Controls", value:this.speedX});
    } else if (this.controls.left) {
      this.velocity.x.Add_Component({key:"Bot_Controls",value: -this.speedX});
    }
    if (this.controls.up) {
      this.velocity.y.Add_Component({key:"Bot_Controls", value:-this.speedY});
    }
    else if (this.controls.down) {
      this.velocity.y.Add_Component({key:"Bot_Controls", value:this.speedY});
    }
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

if(Math.random()>0.7) {
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

collisionManager() {
 Pushable_Entity_With_Unpushable_Entities.resolve({pushableEntity: this}); 
}


}