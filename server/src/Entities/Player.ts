import * as fs from 'fs';
import * as path from 'path';

import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js"

import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { SocketStorage } from "#root/SocketStorage.js";

import { log } from "console";
import type { Socket } from "socket.io";
import type { Position } from "#root/Type_Stuff.js";
import { Collision_Logger} from "#root/Collision_Stuff/Collision_Logger.js"
export { Player };
class Player extends Base_Entity {
  controls = {
    right: false,
    left: false,
    up: false,
    down: false,
  };
  lastSaveTime=0;
  previousPositions:Position[]=[]
  marked: Base_Entity[] = [];
  speedUp = false;
  intangibility = false;
  speedPerTick = 0.10;
  justUpdated = false;
  socketId: Socket["id"] = "none";
  
  constructor() {
    super();
    this.addTag("Player");
    this.addTag("Can_Ride_Train");
  }
  setVisionRange(visionRange: number) {
    this.visionRange = visionRange;
  }
  setSocketId(id: Socket["id"]) {
    this.socketId = id;
  }
  getSocket() {
    return SocketStorage.find(socket => socket.id === this.socketId);
  }
  swapSpeedUp() {
    this.speedUp = !this.speedUp;
  }
  swapIntangibility() {
    this.intangibility = !this.intangibility;
  }
  
  updateState() {
    if(this.speedUp) {
      this.speedPerTick = 1.00;
    } else {
      this.speedPerTick = 0.50;
    }

    if (this.controls.right) {
      this.movementForces.Set_Component("Player_Controls", "right", this.speedPerTick);
    }
    if (this.controls.left) {
      this.movementForces.Set_Component("Player_Controls", "left", this.speedPerTick);
    }
    if (this.controls.up) {
      this.movementForces.Set_Component("Player_Controls", "up", this.speedPerTick);
    }
    if (this.controls.down) {
      this.movementForces.Set_Component("Player_Controls", "down", this.speedPerTick);
    }

const now = Date.now();

  if (now - this.lastSaveTime >= 1000) {
    this.saveStateToFile();
    this.lastSaveTime = now;
  }

  }



collisionManager(calledTimes: number = 0) {
if(calledTimes >1) {
  return;
}
  if(this.intangibility) {
    return;
  }
  const closestCollision = Collision_Stuff.getClosestCollision(this, (other)=>other.hasTag("Wall") || other.hasTag("Sliding_Door"));
  if(!(closestCollision)) {
    return;
  } 
  
  
  const otherEntity = closestCollision.entityB;
  const Player_Position_Just_Before_Collision = closestCollision.Position_Just_Before_Collision_A; 
  
   const faces = Collision_Stuff.With_Which_Sides_Do_Two_Entities_Face_Each_Other(this, otherEntity);
   if(!faces) {
     // this probably means they are intersecting so we cant cleanly determine the answer. in that case something failed if we ever got to this, so just skip I guess.
     console.log("Oopsie, must never happen and be resolved");
     return;
   }
   const {aFace: playerFace, bFace: otherEntityFace} = faces;
   const newPlayerPos = {
     x:0,
     y:0
   }
   
   const offset = 0;
   switch(otherEntityFace) {
     case "right":
        newPlayerPos.x = otherEntity.x + otherEntity.width + offset;
        newPlayerPos.y = Player_Position_Just_Before_Collision.y
      break;
      
      case "left":
        newPlayerPos.x = otherEntity.x - offset - this.width;
        newPlayerPos.y = Player_Position_Just_Before_Collision.y;
      break;
      
      case "up":
        newPlayerPos.x = Player_Position_Just_Before_Collision.x
        newPlayerPos.y = otherEntity.y - offset - this.height;
      break;
      
      case "down":
        newPlayerPos.x = Player_Position_Just_Before_Collision.x
        newPlayerPos.y = otherEntity.y + otherEntity.height + offset;
      break;
      default:
       throw new Error("Must neve happen")
      break;
      
   } 
   this.setPosition(newPlayerPos);

   this.movementForces.nullify(playerFace);
   this.movementForces.Receive_Force_Components_Of_A_Direction_From_Another_Entity_That_Are_Not_Already_Present(otherEntityFace, otherEntity);
    
   this.collisionManager(calledTimes+1);
}

savePosition(pos: Position) {
  if (this.previousPositions.length === 4) {
    this.previousPositions.shift(); // remove first element
  }
  this.previousPositions.push(pos);

}
  saveStateToFile() {
    const savePath = path.resolve("player_save.json");

  const data = {
    x: this.x,
    y: this.y,
    visionRange: this.visionRange,
    
  };

  try {
    fs.writeFileSync(savePath, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save player position:", err);
  }
  }

  readSavedState() {
  const savePath = path.resolve("player_save.json");

  if (!fs.existsSync(savePath)) {
    console.warn("No save file found. Starting with default position.");
    return;
  }

  try {
    const file = fs.readFileSync(savePath, "utf-8");
    const data = JSON.parse(file);
    this.setXY(data.x, data.y);
    this.visionRange = data.visionRange;
  } catch (err) {
    console.error("Failed to read player position:", err);
  }
}



}