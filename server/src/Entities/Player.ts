import { Collision_Stuff } from "#root/Collision_Stuff.js";
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Entity_Forces, type Force_Name as Force_Name } from "#root/Entities/Entity_Forces.js";
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
  speedUp = false;
  standardMovementSpeed = 0.10;
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
      this.standardMovementSpeed = 1.00;
    } else {
      this.standardMovementSpeed = 0.50;
    }

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

      const Answer = Collision_Stuff.areEntitiesIntersecting(player, entity);
      if (Answer.Collision_Occurred === false) {
        return;
      }
      
      const tempPlayerBox: Box = {
        x: Answer.Position_Before_Collision_A.x,
        y: Answer.Position_Before_Collision_A.x,
        width: player.width,
        height: player.height
      };
      const playerSide = Collision_Stuff.Which_Side_Of_Entity_Is_Facing_Another_Entity(tempPlayerBox, entity);
      const playerCollisionDirection = { "right": "right", "left": "left", "bottom": "down", "top": "up" }[playerSide] as Direction;
  
        // get all forces moving player to the right except those also affecting the collided with entity
       const forces = player.forces.Get_Keys_Of_Force_Components_Of_A_Force_That_Are_Not_Present_In_Another_Entity_Forces(playerCollisionDirection, entity.forces);
       forces.forEach(key=> {
         // set them to zero
         player.forces.set(key, playerCollisionDirection, 0)
       }) 
    
 
       // remove all opposite forces as well
       const oppositeName = player.Get_Opposite_Force_Name(playerCollisionDirection);
       
              const forcesOpposite = player.forces.Get_Keys_Of_Force_Components_Of_A_Force_That_Are_Not_Present_In_Another_Entity_Forces(oppositeName, entity.forces);
       forcesOpposite.forEach(key=> {
         // set them to zero
         player.forces.set(key, oppositeName, 0)
       }) 
   const removeForceEntryOnceForceBecomesZero= true;
   const forceId = Math.random().toString();
 
   if(playerCollisionDirection ==="right" || playerCollisionDirection ==="left") {
     const budget = Math.abs(Answer.Starting_Position_B.x - Answer.Theoretical_Ending_Position_B.x);
     const spent = Math.abs(Answer. Starting_Position_B.x - Answer.Position_Before_Collision_B.x);
     const remaining = Math.abs(
     budget - spent
       );
   } else {
        const budget = Math.abs(Answer.Starting_Position_B.y - Answer.Theoretical_Ending_Position_B.y);
     const spent = Math.abs(Answer. Starting_Position_B.y - Answer.Position_Before_Collision_B.y);
     const remaining = Math.abs(
     budget - spent
       );  
   }
   
     player.setPosition(Answer.Position_Before_Collision_A);
     
           player.forces.set(forceId, oppositeName, remaining, removeForceEntryOnceForceBecomesZero);
           
           this.updateState();
           player.forces.set(forceId, oppositeName, 0);

      return;

    })
  }
}