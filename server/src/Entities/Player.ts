import * as fs from 'fs';
import * as path from 'path';


import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { SocketStorage } from "#root/SocketStorage.js";

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