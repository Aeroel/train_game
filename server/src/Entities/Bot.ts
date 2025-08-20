

import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js"

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

collisionManager(
  {lastCall=false}:
  {lastCall?: boolean}
  ={}) {
    console.log(this.x, this.y, this.velocity.x.components)
  
  const closestCollision = Collision_Stuff.getClosestCollision(this, (other)=>other.hasTag("Wall") || other.hasTag("Sliding_Door"));
  if(!(closestCollision)) {
    return;
  } 
  
  
  const otherEntity = closestCollision.entityB;
  const Player_Position_Just_Before_Collision = closestCollision.Position_Just_Before_Collision_A; 
  const xDistTraveledBetweenStartingPointAndCollisionPoint = Player_Position_Just_Before_Collision.x - this.x;
  const yDistTraveledBetweenStartingPointAndCollisionPoint = Player_Position_Just_Before_Collision.y - this.y;
  console.log(xDistTraveledBetweenStartingPointAndCollisionPoint,yDistTraveledBetweenStartingPointAndCollisionPoint)
  

   const playerFace = closestCollision.aFacingB;
   const otherEntityFace = closestCollision.bFacingA;
   const newPlayerPos = {
     x:0,
     y:0
   }
   
   const offset = 0;
   const offsetX = Math.sign(this.velocity.x.get()) * 0;
   const offsetY = Math.sign(this.velocity.y.get()) * 0;
   const playerBeforeCollY= offsetY + Player_Position_Just_Before_Collision.y 
   const playerBeforeCollX= offsetX + Player_Position_Just_Before_Collision.x; 
   switch(otherEntityFace) {
     case "right":
        newPlayerPos.x = otherEntity.x + otherEntity.width + offset;
        newPlayerPos.y = playerBeforeCollY;
      break;
      
      case "left":
        newPlayerPos.x = otherEntity.x - offset - this.width;
        newPlayerPos.y = playerBeforeCollY;
      break;
      
      case "up":
        newPlayerPos.x = playerBeforeCollX
        newPlayerPos.y = otherEntity.y - offset - this.height;
      break;
      
      case "down":
        newPlayerPos.x = playerBeforeCollX
        newPlayerPos.y = otherEntity.y + otherEntity.height + offset;
      break;
      default:
       throw new Error("Must neve happen")
      break;
      
   } 
   this.setPosition(newPlayerPos);
  switch(playerFace) {
    case "up":
      case "down":
   this.velocity.y.nullify();
   otherEntity.velocity.y.Add_To(this.velocity.y);
   break;
       case "left":
      case "right":
    this.velocity.x.nullify();
    otherEntity.velocity.x.Add_To(this.velocity.x);
      break;
  }
   

    if(lastCall) {
      return;
    }

   this.collisionManager({lastCall: true});
}




}