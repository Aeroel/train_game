import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Rail } from "#root/Entities/Train_Stuff/Rail.js";
import type { Station_Stop_Spot } from "#root/Entities/Station_Stop_Spot.js"
import { Train_Car, type Train_Car_Motion_Directions } from "#root/Entities/Train_Stuff/Train_Car.js";
import type { Box, Direction, Position, Collision_Info } from "#root/Type_Stuff.js";
import { World } from "#root/World.js";
import { log } from "console";

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
        waitingSince = 0;
    
    constructor(rail: Rail, Forwards_Movement_Directions: Train_Car_Motion_Directions, Backwards_Movement_Directions: Train_Car_Motion_Directions, movementMotion: 'forwards' | 'backwards', numberOfCars: number, carSquareSize: number) {
        super();
        this.movementMotion = movementMotion;

        let startPosition: Position = this.getStartingPosition(rail, carSquareSize);
        for (let count = 0; count < numberOfCars; count++) {
              this.spawnCar(startPosition, count, rail, Forwards_Movement_Directions, Backwards_Movement_Directions, movementMotion, numberOfCars, carSquareSize)
        }
        

    }
   
   
    
    
    updateState() {
      if(this.begunWaiting && Date.now() >(this.waitingSince + this.waitPeriodMs) ) {
        this.begunWaiting = false;
        this.resumeMovement();
        if(this.currentStopSpot===null){
          throw new Error("Station_Stop_Spot is null")
        }
        this.closeDoors(this.currentStopSpot.Which_Door_Of_A_Car_To_Open_And_Close);
      } else {
       this.checkForUpcomingStopSpot();
      }
        super.updateState();
    }

checkForUpcomingStopSpot() {
    if (!this.isMoving()) return; // no point checking if stationary
    const frontCar = this.getFrontCar();

    // Find the closest collision where the other entity is a StopSpot
    const collision = Collision_Stuff.getClosestCollision(
        frontCar,
        (other) => other.hasTag("Station_Stop_Spot")
    );

    if (!collision) {
      return;
    }
     const stopSpotEntity = collision.entityB as Station_Stop_Spot;
    if((this.currentStopSpot === stopSpotEntity )) {
      return;
    }

        this.begunWaiting = true;
        this.waitingSince = Date.now();
        this.currentStopSpot = stopSpotEntity;
        this.openDoors(this.currentStopSpot.Which_Door_Of_A_Car_To_Open_And_Close)
        this.alignCars(collision);
        this.stopMovement();
}
openDoors(dir: Direction) {
  this.cars.forEach(car=> {
    car.openDoors(dir);
  })
}
closeDoors(dir: Direction) {
  this.cars.forEach(car=> {
    car.closeDoors(dir);
  })
}

alignCars(collision: Collision_Info) {

    // Calculate how far we need to shift everything
    const frontCar = this.getFrontCar();
   // Stop movement for the entire train immediately
    const before = collision.Position_Just_Before_Collision_A;

    const deltaX = before.x - frontCar.x;
    const deltaY = before.y - frontCar.y;

    // Apply the delta to every car and update their internals
    for (const car of this.cars) {
        car.teleportCarContentsAndPassengersByDelta(deltaX, deltaY);
        if(car === frontCar) {
          continue;
        }
        car.setXY(car.x + deltaX, car.y + deltaY);
    }
}



getStartingPosition(rail: Rail, carSquareSize: number) {
  let startPosition = {x:0,y:0};
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
        
        return startPosition;
}
spawnCar(startPosition: Position, count: number, rail: Rail, Forwards_Movement_Directions: Train_Car_Motion_Directions, Backwards_Movement_Directions: Train_Car_Motion_Directions, movementMotion: 'forwards' | 'backwards', numberOfCars: number, carSquareSize: number) {
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
    

getFrontCar() {
    const res = this.determineFrontAndBackCars();
    return res.front;
}

getBackCar() {
    const res = this.determineFrontAndBackCars();

    return res.back;
}



    determineFrontAndBackCars() {
    if (!this.isMoving()) {
        throw new Error("Cannot get back car of a stationary train");
    }

    const dirs = this.getActiveMovementDirections();
    if (!dirs || dirs.length === 0) {
        throw new Error("Could not get motion dirs or empty.")
    }

    const sortedCars = [...this.cars].sort((a, b) => this.compareCarsByDirection(a, b, dirs));
    return {
        front: sortedCars[0],
        back: sortedCars[sortedCars.length - 1],
    };
}

// --------------------
// Helpers
// --------------------
getActiveMovementDirections(): Train_Car_Motion_Directions {
    if (this.movementMotion === "forwards") {
        return this.cars[0].motionsDirections.forwards;
    } else if (this.movementMotion === "backwards") {
        return this.cars[0].motionsDirections.backwards;
    }
    return [];
}

compareCarsByDirection(a: Train_Car, b: Train_Car, dirs: Train_Car_Motion_Directions): number {
    // Vertical
    if (dirs.includes("up")) {
        if (a.y !== b.y) return a.y - b.y; // smallest y first
    } else if (dirs.includes("down")) {
        if (a.y !== b.y) return b.y - a.y; // largest y first
    }

    // Horizontal
    if (dirs.includes("left")) {
        if (a.x !== b.x) return a.x - b.x; // smallest x first
    } else if (dirs.includes("right")) {
        if (a.x !== b.x) return b.x - a.x; // largest x first
    }

    return 0; // tie
}


}