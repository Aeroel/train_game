import { Collision_Stuff } from "#root/Collision_Stuff.js";
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Entity_Forces, type Force_Name as Force_Name } from "#root/Entities/Entity_Forces.js";
import { SocketStorage } from "#root/SocketStorage.js";
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
  standardMovementSpeed = 120;
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
  updateState() {
    if (this.controls.right) {
      this.forces.set("Player_Controls", "right", this.standardMovementSpeed);
    }
    if (this.controls.left) {
      this.forces.set("Player_Controls", "left", this.standardMovementSpeed);
    }
    if (this.controls.up) {
      this.forces.set("Player_Controls", "up", this.standardMovementSpeed);
    }
    if (this.controls.down) {
      this.forces.set("Player_Controls", "down", this.standardMovementSpeed);
    }
    this.Collision_Manager();
    super.updateState();
  }
  Collision_Manager() {
    const player = this;
    World.getCurrentEntities().forEach((entity: Base_Entity) => {
      if (player === entity) {
        return;
      }
      const Can_Collide = (entity.hasTag("Wall") || entity.hasTag("Sliding_Door"));
      if (!Can_Collide) {
        return;
      }
      const wall_or_door = entity;

      if (!Collision_Stuff.areEntitiesTouching(player, wall_or_door)) {
        return;
      }

      const playerSide = Collision_Stuff.Which_Side_Of_Entity_Is_Facing_Another_Entity(player, wall_or_door);
      let Force_Which_Caused_Collision: Force_Name = 'up';
      switch (playerSide) {
        case "bottom":
          Force_Which_Caused_Collision = 'down'
          break;
        case "top":
          Force_Which_Caused_Collision = 'up'
          break;
        case "left":
          Force_Which_Caused_Collision = 'left'
          break;
        case "right":
          Force_Which_Caused_Collision = 'right'
          break;
      }
      const Keys_That_Are_Not_Shared_Between_Player_And_Entity = this.forces.Get_Keys_Of_Force_Components_Of_A_Force_That_Are_Not_Present_In_Another_Entity_Forces(Force_Which_Caused_Collision, wall_or_door.forces);
      Keys_That_Are_Not_Shared_Between_Player_And_Entity.forEach(key => {
        this.forces.set(key, Force_Which_Caused_Collision, 0);
      })

      return;

    })
  }
}