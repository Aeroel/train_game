import * as fs from 'fs';
import * as path from 'path';


import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Entity_Forces, type Force_Name as Force_Name , type Forces} from "#root/Entities/Entity_Forces.js";
import { SocketStorage } from "#root/SocketStorage.js";
import type { Box, Direction, Orientation, Position, Collision_Info } from "#root/Type_Stuff.js";
import { World } from "#root/World.js";
import { log } from "console";
import type { Socket } from "socket.io";
export { Player };
class Player extends Base_Entity {
  controls = {
    right: false,
    left: false,
    up: false,
    down: false,
  };
  lastSaveTime=0;
  marked: Base_Entity[] = [];
  speedUp = false;
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
  updateState() {
    if(this.speedUp) {
      this.speedPerTick = 1.00;
    } else {
      this.speedPerTick = 0.50;
    }

    if (this.controls.right) {
      this.forces.set("Player_Controls", "right", this.speedPerTick);
    }
    if (this.controls.left) {
      this.forces.set("Player_Controls", "left", this.speedPerTick);
    }
    if (this.controls.up) {
      this.forces.set("Player_Controls", "up", this.speedPerTick);
    }
    if (this.controls.down) {
      this.forces.set("Player_Controls", "down", this.speedPerTick);
    }

const now = Date.now();

  if (now - this.lastSaveTime >= 1000) {
    this.saveXYToFile();
    this.lastSaveTime = now;
  }

    this.Position_Management();
  }

Position_Management() {
  const filtFn = (entity: Base_Entity) => {
  const canCollide = (entity.hasTag("Wall") || entity.hasTag("Sliding_Door"));
    return canCollide;
  }
  const coll = Collision_Stuff.getClosestCollision(this, filtFn);
  if(!coll) {
   super.advancePositionFully();
   return;
  }
if(!coll.entityB.isMoving()) {
  this.stationary(coll)
} else {
  this.ambulatory(coll)
}
  
  
}
ambulatory(coll: Collision_Info) {
  const looking = Collision_Stuff.Boxes_Looking(coll.Last_Box_Before_Collision_A, coll.Last_Box_Before_Collision_B)
  this.forces.nullify(looking.Entity_A_Looks_At_B_Direction);
  const other = coll.entityB;
  const otherPos = coll.Theoretical_Ending_Position_B;
  const pos: Position={x:this.x,y:this.y};
  switch(looking.Entity_A_Looks_At_B_Direction) {
    case "up":
         pos.y = otherPos.y+other.height;
         pos.y++
      break;
    case "down":
        pos.y = otherPos.y-this.height;
        pos.y--;
      break;
    case "right":
      pos.x= otherPos.x - this.width;
      pos.x--;
      break;
    case "left":
      pos.x = otherPos.x + other.width;
      pos.x++;
      break;
  }
  this.setPosition(pos)
}
stationary(coll: Collision_Info) {
    this.setPosition(coll.Position_Before_Collision_A);
 
  const looking = Collision_Stuff.Boxes_Looking(coll.Last_Box_Before_Collision_A, coll.Last_Box_Before_Collision_B)
  this.forces.nullify(looking.Entity_A_Looks_At_B_Direction);
}

  saveXYToFile() {
    const savePath = path.resolve("player_save.json");

  const data = {
    x: this.x,
    y: this.y
  };

  try {
    fs.writeFileSync(savePath, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save player position:", err);
  }
  }

  readSavedXY() {
  const savePath = path.resolve("player_save.json");

  if (!fs.existsSync(savePath)) {
    console.warn("No save file found. Starting with default position.");
    return;
  }

  try {
    const file = fs.readFileSync(savePath, "utf-8");
    const data = JSON.parse(file);
    this.setXY(data.x, data.y);
  } catch (err) {
    console.error("Failed to read player position:", err);
  }
}



}