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
nullifyForcesInBothDirs(0layer: Player, playerCollisionDirection: Direction, entity: Base_Entity, oppositeName: Direction ) {
          // get all forces moving player to the right except those also affecting the collided with entity
       const forces = player.forces.Get_Keys_Of_Force_Components_Of_A_Force_That_Are_Not_Present_In_Another_Entity_Forces(playerCollisionDirection, entity.forces);
       forces.forEach(key=> {
         // set them to zero
         player.forces.set(key, playerCollisionDirection, 0)
       }) 
    
       // remove all opposite forces as well
              const forcesOpposite = player.forces.Get_Keys_Of_Force_Components_Of_A_Force_That_Are_Not_Present_In_Another_Entity_Forces(oppositeName, entity.forces);
       forcesOpposite.forEach(key=> {
         // set them to zero
         player.forces.set(key, oppositeName, 0)
       }) 
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
        y: Answer.Position_Before_Collision_A.x,
        width: player.width,
        height: player.height
      };
      const playerSide = Collision_Stuff.Which_Side_Of_Entity_Is_Facing_Another_Entity(tempPlayerBox, entity);
      const playerCollisionDirection = { "right": "right", "left": "left", "bottom": "down", "top": "up" }[playerSide] as Direction;

       const oppositeName = player.forces.Get_Opposite_Force_Name(playerCollisionDirection);  

        this.nullifyForcesInBothDirs(player, playerCollisionDirection, entity, oppositeName)

   const removeForceEntryOnceForceBecomesZero= true;
   const forceId = Math.random().toString();

 let orientation: Orientation = 'vertical';
   if(playerCollisionDirection ==="right" || playerCollisionDirection ==="left") {
orientation = "horizontal";
   } else {
     orientation = "vertical"
   }
   
     player.setPosition(Answer.Position_Before_Collision_A);
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
          playerY = entityFinalPos.y + entityFinalPos.height;
          playerY++;
        break;
     }
     player.setXY(playerX, playerY);
     

           let isMovingOnTheOtherAxis = false;
           let netAxis = player.forces.Get_Net_Axis_Force("vertical")
         let savedArr = [];
         const saved ={choice: "none", right:0,left:0,up:0,down:0};
           if(orientation==="vertical") {
                      netAxis = player.forces.Get_Net_Axis_Force("horizontal");    isMovingOnTheOtherAxis = 0 < netAxis;
           } else {
             netAxis = player.forces.Get_Net_Axis_Force("vertical");
             isMovingOnTheOtherAxis = (0 < netAxis);
           }
           let tempId2 = Math.random().toString();
           if(isMovingOnTheOtherAxis) {

           if(orientation ==="horizontal") {
             if(netAxis > 0 ) {
               saved.down = netAxis;
               saved.choice = "down";
             } else {
               saved.up = netAxis;
               saved.choice = "up";
             }
           } else {
               if(netAxis > 0 ) {
               saved.right = netAxis;
               saved.choice = "right";
             } else {
               saved.left = netAxis;
               saved.choice = "left";
             }
           }
           const savedChoice = saved.choice as keyof Forces;
           const forceArray =  player.forces.forces[savedChoice];

           for (const force of forceArray) {
  savedArr.push({...force})
    player.forces.set(force.key, savedChoice, 0);
}
           }
           super.updateState();
           this.justUpdated = true;
           player.forces.set(forceId, oppositeName, 0);
           if(isMovingOnTheOtherAxis) {
          const savedChoice = saved.choice as keyof Forces;
                        for (const force of savedArr) {
  player.forces.set(force.key, savedChoice, force.forceValue);
}
// and here I have to ask again, I guess? whether a collision happens now. I think the procedure must be the same, yes?
// so I might be able to extract the above logic into a funtion and just call it here a second time
  this.andSecondTime();
           }
      return;

  }
  andSecondTime() {
    const player = this;
   const Answer = this.getClosestCollision();
   if(Answer === null) {
     return;
   }
   const entity = Answer.entityB;
      
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
       const oppositeName = player.forces.Get_Opposite_Force_Name(playerCollisionDirection);
       
              const forcesOpposite = player.forces.Get_Keys_Of_Force_Components_Of_A_Force_That_Are_Not_Present_In_Another_Entity_Forces(oppositeName, entity.forces);
       forcesOpposite.forEach(key=> {
         // set them to zero
         player.forces.set(key, oppositeName, 0)
       }) 
   const removeForceEntryOnceForceBecomesZero= true;
   const forceId = Math.random().toString();

 let orientation: Orientation = 'vertical';
 let remaining= 0;
   if(playerCollisionDirection ==="right" || playerCollisionDirection ==="left") {
orientation = "horizontal";
     const budget = Math.abs(Answer.Starting_Position_B.x - Answer.Theoretical_Ending_Position_B.x);
     const spent = Math.abs(Answer. Starting_Position_B.x - Answer.Position_Before_Collision_B.x);
      remaining = Math.abs(
     budget - spent
       );
   } else {
     orientation = "vertical"
        const budget = Math.abs(Answer.Starting_Position_B.y - Answer.Theoretical_Ending_Position_B.y);
     const spent = Math.abs(Answer. Starting_Position_B.y - Answer.Position_Before_Collision_B.y);
      remaining = Math.abs(
     budget - spent
       );  
   }
   
     player.setPosition(Answer.Position_Before_Collision_A);
     
           player.forces.set(forceId, oppositeName, remaining, removeForceEntryOnceForceBecomesZero);
           super.updateState();
           player.forces.set(forceId, oppositeName, 0);
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