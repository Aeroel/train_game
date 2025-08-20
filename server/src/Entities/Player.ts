import * as fs from 'fs';
import * as path from 'path';

import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js"
import { Game_Loop} from "#root/Game_Loop.js"
import { resolvePlayerVsWalls } from "#root/Collision_Stuff/Entity_Interactions/PlayerVsWalls.js"
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { SocketStorage } from "#root/SocketStorage.js";
import { Helper_Functions} from "#root/Helper_Functions.js"
import {Pushable_Entity_With_Unpushable_Entities} from "#root/Collision_Stuff/Entity_Interactions/Pushable_Entity_With_Unpushable_Entities.js"

import { log } from "console";
import type { Socket } from "socket.io";
import type { Position } from "#root/Type_Stuff.js";

export { Player };
class Player extends Base_Entity {
  controls = {
    right: false,
    left: false,
    up: false,
    down: false,
  };
  lastSaveTime=0;
  speedUp = false;
  intangibility = false;
 normalSpeedForBothAxes=0.5;
 spedUpSpeedForBothAxes=1.25;
 speedX= this.normalSpeedForBothAxes;
 speedY= this.normalSpeedForBothAxes;
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
      this.speedX = this.spedUpSpeedForBothAxes;
      this.speedY = this.spedUpSpeedForBothAxes;
    } else {
      this.speedX = this.normalSpeedForBothAxes;
      this.speedY = this.normalSpeedForBothAxes;
    }

    if (this.controls.right) {
      this.velocity.x.Add_Component({key:"Player_Controls", value:this.speedX});
    } else if (this.controls.left) {
      this.velocity.x.Add_Component({key:"Player_Controls",value: -this.speedX});
    }
    if (this.controls.up) {
      this.velocity.y.Add_Component({key:"Player_Controls", value:-this.speedY});
    }
    else if (this.controls.down) {
      this.velocity.y.Add_Component({key:"Player_Controls", value:this.speedY});
    }

  const now = Date.now();
   const timeToSave = now - this.lastSaveTime >= 1000;
  if (timeToSave) {
    this.saveStateToFile();
    this.lastSaveTime = now;
  }

  }

collisionManager() {
 Pushable_Entity_With_Unpushable_Entities.resolve({pushableEntity: this});
// resolvePlayerVsWalls(this)
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