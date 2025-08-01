import { Collision_Stuff } from "#root/Collision_Stuff.js";
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
    this.Collision_Manager();
 if(!this.justUpdated) {
    super.updateState();
  } else {
    this.justUpdated = false;
 }
  }
nullifyForcesInBothDirs(
  player: Player, 
  playerCollisionDirection: Direction, entity: Base_Entity,
oppositeName: Direction ) {
       const forces = player.forces.Get_Keys_Of_Force_Components_Of_A_Force_That_Are_Not_Present_In_Another_Entity_Forces(playerCollisionDirection, entity.forces);
       
       
  
}
  Collision_Manager() {

    const player = this;
    const Answer = this.getClosestCollision();
    if(Answer === null) {
      return;
    }

    const entity = Answer.entityB;
      const tempPlayerBox: Box = {
        x: Answer.Position_Before_Collision_A.x,
        y: Answer.Position_Before_Collision_A.y,
        width: player.width,
        height: player.height
      };
      const tempEntBox: Box = {
        x: Answer.Position_Before_Collision_B.x,
        y: Answer.Position_Before_Collision_B.y,
        width: entity.width,
        height: entity.height
      };
      const playerSide = Collision_Stuff.Which_Side_Of_Entity_Is_Facing_Another_Entity(tempPlayerBox, tempEntBox).aFace;
      const playerCollisionDirection = playerSide as Direction;

       const oppositeName = player.forces.Get_Opposite_Force_Name(playerCollisionDirection);  

        this.nullifyForcesInBothDirs(player, playerCollisionDirection, entity, oppositeName)

     const entityFinalPos = Answer.Theoretical_Ending_Position_B;
     let playerX = player.x;
     let playerY = player.y;
  
     switch(oppositeName) {
       case "right":
         playerX = entityFinalPos.x + entity.width;
         playerX++;

        break;
        case "left":
        playerX = entityFinalPos.x - player.width;
        playerX--;
        break;
        
        case "up":
          playerY = entityFinalPos.y - player.height;
          playerY--;
        break;
        case "down":
          playerY = entityFinalPos.y + entity.height;
          playerY++;
        break;
     }
     player.setXY(playerX, playerY);

    this.justUpdated=true;
      return;

  }

  
    getAllColls(): Collision_Info[] {
    const player = this;
    const allCollisions: Collision_Info[] =[];
        World.getCurrentEntities().forEach((entity: Base_Entity) => {
      if (player === entity) {
        return;
      }
      
      // check if it is even close enough
      if(!Collision_Stuff.areCloseEnoughToBotherLookingForACollisionFurther(player, entity)) {
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


      allCollisions.push(Answer)
    });
    return allCollisions;
  }
  
   getClosestCollision(): Collision_Info | null {
  const allDetectedCollPairs: Collision_Info[] = this.getAllColls();
  if (allDetectedCollPairs.length === 0) {
    return null;
  }

  if (allDetectedCollPairs.length === 1) {
    return allDetectedCollPairs[0];
  }

  // Helper: squared distance between two positions
  function distSq(a: Position, b: Position): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  const playerStart = allDetectedCollPairs[0].Starting_Position_A;

  let closest: Collision_Info = allDetectedCollPairs[0];
  let minDistSq = distSq(playerStart, closest.Position_Before_Collision_A);

  for (let i = 1; i < allDetectedCollPairs.length; i++) {
    const curr = allDetectedCollPairs[i];
    const currDistSq = distSq(playerStart, curr.Position_Before_Collision_A);

    if (currDistSq < minDistSq) {
      closest = curr;
      minDistSq = currDistSq;
    }
  }

  return closest;
}

}