import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { log } from "#root/My_Log.js";
import type { Rail } from "#root/Entities/Train_Stuff/Rail.js";
import type { Station_Stop_Spot } from "#root/Entities/Station_Stop_Spot.js"
import { Train_Car, type Train_Car_Motion_Directions } from "#root/Entities/Train_Stuff/Train_Car.js";
import type { Box, Direction, Position, Collision_Info } from "#root/Type_Stuff.js";
import { World } from "#root/World.js";

export type Train_Movement_Motion = null| "backwards" | "forwards"

export class Train extends Base_Entity {
    state: "waiting_at_station" | "in_transit" = "in_transit";
    x = 1;
    y = 1;
    cars: Train_Car[] = new Array();
    movementMotion: Train_Movement_Motion = "forwards";

    Forwards_Movement_Directions: Train_Car_Motion_Directions =[];
    Backwards_Movement_Directions: Train_Car_Motion_Directions=[];
        beforePauseMovementMotion: Train_Movement_Motion = null;
        
        currentStopSpot: Station_Stop_Spot | null = null;
        begunWaiting = false;
        waitPeriodMs= 10 * 1000;
        waitOnDoorPeriodMs= 5 * 1000;
        waitingSince = 0;
        begunWaitingOnDoor = false;
        waitingOnDoorSince =0;
    
    constructor(rail: Rail, Forwards_Movement_Directions: Train_Car_Motion_Directions, Backwards_Movement_Directions: Train_Car_Motion_Directions, movementMotion: 'forwards' | 'backwards', numberOfCars: number, carSquareSize: number) {
        super();
        this.movementMotion = movementMotion;

        let startPosition: Position = this.getStartingPosition(rail, carSquareSize);
        for (let count = 0; count < numberOfCars; count++) {
              this.spawnCar(startPosition, count, rail, Forwards_Movement_Directions, Backwards_Movement_Directions, movementMotion, numberOfCars, carSquareSize)
        }
        

    }
   
   
    
    
    updateState() {

        super.updateState();
    }


alignCars(collision: Collision_Info) {
    // Calculate how far we need to shift everything
    const frontCar = this.cars[0];
   // Stop movement for the entire train immediately 
    const before = Collision_Stuff.timeToPosition(this, collision.time);

    const deltaX = before.x - frontCar.x;
    const deltaY = before.y - frontCar.y;

    // Apply the delta to every car and update their internals
    for (const car of this.cars) {
        car.moveCarContentsAndPassengersByDelta(deltaX, deltaY);
        car.setXY(car.x + deltaX, car.y + deltaY);
    }
}



getStartingPosition(rail: Rail, carSquareSize: number) {
  let startPosition = {x:0,y:0};
  const orientation = rail.getOrientation;
  log("Train.ts:getStartingPosition:rail",rail)
          if (rail.getOrientation() === 'horizontal') {
            startPosition = {
                x: rail.getX() +(0.5*rail.width),
                y: rail.getY() - (carSquareSize / 2),
            };
        } else {
            startPosition = {
                x: rail.getX() - (carSquareSize / 2),
                y: rail.getY() + (rail.height*0.5)
            }
        }
        log("getStartingPosition:", startPosition)
        return startPosition;
}
spawnCar(startPosition: Position, count: number, rail: Rail, Forwards_Movement_Directions: Train_Car_Motion_Directions, Backwards_Movement_Directions: Train_Car_Motion_Directions, movementMotion: 'forwards' | 'backwards', numberOfCars: number, carSquareSize: number) {
  log("spawnCar:startPosition",startPosition)
              let carX;
            let carY;
            if (rail.getOrientation() === 'horizontal') {
                carX = startPosition.x + (count * carSquareSize);
                carY = startPosition.y;
            } else {
                carX = startPosition.x;
                carY = startPosition.y + (count * carSquareSize);
            }
            const car = new Train_Car({ Backwards_Movement_Directions, Forwards_Movement_Directions,  size: carSquareSize, x: carX, y: carY, train: this });
            car.setMovementMotion(this.movementMotion);
            World.addEntity(car);
            console.log("pushed", car.motionsDirections, car.x, car.y)
            this.cars.push(car);
            car.setMovementMotion(movementMotion);
            if (count > 0) {
                const prevCar: Train_Car = this.cars[(this.cars.length - 1)];

            }
}

    setMovementMotion(motion: Train_Movement_Motion) {
      this.movementMotion = motion;
      this.cars.forEach(car=>{
        car.setMovementMotion(motion)
      })
    }
    
    
    stopAllCars() {
        this.stopMovement();
    }
    
    stopMovement() {
      
      this.setMovementMotion(null);
    }
    isMoving() {
      return !(this.movementMotion === null);
    }
    pauseMovement() {
      if(!(this.isMoving())) {
        throw new Error("Calling pauseMovement on a train that is not moving")
      }
      this.beforePauseMovementMotion = this.movementMotion;
      this.stopMovement();
    }
    resumeMovement() {
      this.setMovementMotion(this.beforePauseMovementMotion);
    }
    

}