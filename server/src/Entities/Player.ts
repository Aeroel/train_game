import { Collision_Stuff } from "#root/Collision_Stuff.js";
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Entity_Forces, type Force_Name as Force_Name } from "#root/Entities/Entity_Forces.js";
import { SocketStorage } from "#root/SocketStorage.js";
import type { Orientation, Position } from "#root/Type_Stuff.js";
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

      const Answer = Collision_Stuff.Did_A_Collision_Occur_And_What_Is_The_Position_Just_Before_Collision(player, wall_or_door);
      if (Answer.Collision_Occurred === false) {
        return;
      }

      player.setPosition(Answer.Position_Before_Collision_A);
      player.Vertical_Axis_Collision_Handler(wall_or_door);
      player.Horizontal_Axis_Collision_Handler(wall_or_door);

      return;

    })
  }
  Vertical_Axis_Collision_Handler(wall_or_door: Base_Entity) {
    const Keys_That_Are_Unique_To_Player_Up = this.forces.Get_Keys_Of_Force_Components_Of_A_Force_That_Are_Not_Present_In_Another_Entity_Forces("up", wall_or_door.forces);

    Keys_That_Are_Unique_To_Player_Up.forEach(key => {
      this.forces.set(key, "up", 0);
    })
    const Keys_That_Are_Unique_To_Player_Down = this.forces.Get_Keys_Of_Force_Components_Of_A_Force_That_Are_Not_Present_In_Another_Entity_Forces("down", wall_or_door.forces);

    Keys_That_Are_Unique_To_Player_Down.forEach(key => {
      this.forces.set(key, "down", 0);
    })
  }
  Horizontal_Axis_Collision_Handler(wall_or_door: Base_Entity) {
    const Keys_That_Are_Unique_To_Player_Left = this.forces.Get_Keys_Of_Force_Components_Of_A_Force_That_Are_Not_Present_In_Another_Entity_Forces("left", wall_or_door.forces);

    Keys_That_Are_Unique_To_Player_Left.forEach(key => {
      this.forces.set(key, "left", 0);
    })
    const Keys_That_Are_Unique_To_Player_Right = this.forces.Get_Keys_Of_Force_Components_Of_A_Force_That_Are_Not_Present_In_Another_Entity_Forces("right", wall_or_door.forces);

    Keys_That_Are_Unique_To_Player_Right.forEach(key => {
      this.forces.set(key, "right", 0);
    })
  }
}