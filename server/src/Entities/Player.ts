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
    super.updateState();
  }

  Collision_Manager() {

    const player = this;
    
    const filterFn = (entity: Base_Entity) => {
  return entity.hasTag("Wall") || entity.hasTag("Sliding_Door");
       };

    const Answer = Collision_Stuff.getClosestCollision(this, filterFn);
    if(Answer === null) {
      return;
    }
    this.forces.forEachComponent(comp=>{
      comp.forceValue=0
    })
    if(1>0)
    return; //<--- added triggers errror
    
    const entity = Answer.entityB;


      const playerSide = Collision_Stuff.Which_Side_Of_Entity_Is_Facing_Another_Entity(this, entity).aFace;
      const playerCollisionDirection = playerSide as Direction;
     const oppositeName=this.forces.Get_Opposite_Force_Name(playerCollisionDirection);


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

      return;

  }

  


}