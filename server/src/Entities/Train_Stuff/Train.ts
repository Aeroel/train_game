import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";
import { My_Assert } from "#root/My_Assert.js";
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { log } from "#root/My_Log.js";
import type { Rail } from "#root/Entities/Train_Stuff/Rail.js";
import { Station_Stop_Spot } from "#root/Entities/Station_Stop_Spot.js"
import { Train_Car, type Train_Car_Motion_Directions } from "#root/Entities/Train_Stuff/Train_Car.js";
import type { Box, Direction, Position, Collision_Info } from "#root/Type_Stuff.js";
import { World } from "#root/World.js";
import { My_Events } from "#root/My_Events.js";

export type Train_Movement_Motion = null| "backwards" | "forwards"

export class Train extends Base_Entity {
    x = 1;
    y = 1;
    cars: Train_Car[] = new Array();
    spot: Station_Stop_Spot = new Station_Stop_Spot({x:0,y:0, Which_Door_Of_A_Car_To_Open_And_Close:"left"});
    state: "stoppingAtStation" | "waitingForDoorsToOpen" | "waitingSomeTimeAtStation" |"waitingForDoorsToClose" |"leavingStation"| "going" = "going"
    movementMotion: Train_Movement_Motion = "forwards";

    Forwards_Movement_Directions: Train_Car_Motion_Directions =[];
    Backwards_Movement_Directions: Train_Car_Motion_Directions=[];
        beforePauseMovementMotion: Train_Movement_Motion = null;
        
    stopTime= 0;
    stopFor=10_000;
    constructor(rail: Rail, Forwards_Movement_Directions: Train_Car_Motion_Directions, Backwards_Movement_Directions: Train_Car_Motion_Directions, movementMotion: 'forwards' | 'backwards', numberOfCars: number, carSquareSize: number) {
        super();
        this.movementMotion = movementMotion;

        let startPosition: Position = this.getStartingPosition(rail, carSquareSize);
        for (let count = 0; count < numberOfCars; count++) {
              this.spawnCar(startPosition, count, rail, Forwards_Movement_Directions, Backwards_Movement_Directions, movementMotion, numberOfCars, carSquareSize)
        }
        

    }
   
   setState(state: Train['state']) {

     this.state = state;
   }
    
    
    updateState() {
       this.stateHandler();
        super.updateState();
    }
    getState() {
      return this.state;
    }
stateHandler() {
  switch(this.getState()) {
    case "going":
      // nothing
    break;
    case "stoppingAtStation":
      this.openDoors();
      this.setState("waitingForDoorsToOpen")
    break;
    case "waitingForDoorsToOpen":
      if(this.doorsAreOpened()) {
        this.stopTime = Date.now();
        this.setState("waitingSomeTimeAtStation")
      }
    break;
    case "waitingSomeTimeAtStation":
      const currTime = Date.now();
        if(currTime > (this.stopTime + this.stopFor)) {
          this.closeDoors();
          this.setState("waitingForDoorsToClose")
        }
    break;
    case "waitingForDoorsToClose":
      if(this.doorsAreClosed()) {
        this.setState("leavingStation");
      }
    break;
    case "leavingStation":
       this.resumeMovement();
       this.setState("going")
    break;
  }
}

doorsAreClosed() {
  return this.cars[0].areDoorsClosed(this.spot.Which_Door_Of_A_Car_To_Open_And_Close)
}
doorsAreOpened() {
    return this.cars[0].areDoorsOpened(this.spot.Which_Door_Of_A_Car_To_Open_And_Close)
}
openDoors() {
 My_Events.emit(`Doors_Of_Train_At_Stop_Spot_${this.spot.id}_Opening`, {});
  for (const trainCar of this.cars) {
      trainCar.openDoors(this.spot.Which_Door_Of_A_Car_To_Open_And_Close)
  }
}
closeDoors() {
 My_Events.emit(`Doors_Of_Train_At_Stop_Spot_${this.spot.id}_Closing`, {});
  for (const trainCar of this.cars) {
      trainCar.closeDoors(this.spot.Which_Door_Of_A_Car_To_Open_And_Close)
  }
}

alignCars(collision: Collision_Info) {
    // Calculate how far we need to shift everything
    const frontCar = collision.entityB;
    const stopSpot = collision.entityA;
    const normal = collision.normal;
   // Stop movement for the entire train immediately 
   const before = {x:0,y:0}
//   throw new Error(JSON.stringify(collision.normal))
/*/ the normal should be flipped, but it is wrong. it shpild if if normal y===1, then we push car below, not up. But for some reason the actual game acts as if I flipped the objecrs and thus their normal. I do not know why. but flipping the comditions seems to work
.. very mysterious
*/
if(normal.y === 1) {
  before.x = frontCar.x;
  before.y = stopSpot.y - frontCar.height; 
} else if (normal.y === -1) {
  before.x = frontCar.x;
  before.y = stopSpot.y+stopSpot.height; 
} else if (normal.x === 1) {
    before.x = stopSpot.x - frontCar.width;
    before.y = frontCar.y;
} else if (normal.x === -1) {
      before.x = stopSpot.x + stopSpot.width;
    before.y = frontCar.y;
}

    const deltaX = before.x - frontCar.x;
    const deltaY = before.y - frontCar.y;

    // Apply the delta to every car and update their internals
    for (const car of this.cars) {
        car.moveCarAndItsContentsAndPassengers({x: car.x+deltaX, y:car.y+deltaY});

    }
}



getStartingPosition(rail: Rail, carSquareSize: number) {
  let startPosition = {x:0,y:0};
  const railMiddleX = ((rail.getX() + rail.getX()+ rail.getWidth()) / 2);
  const railMiddleY = ((rail.getY() + rail.getY()+ rail.getHeight()) / 2);
  log("Train.ts:getStartingPosition:rail",rail)
          if (rail.getOrientation() === 'horizontal') {
            startPosition = {
                x: rail.getX() +(0.5*rail.width),
                y: railMiddleY - (carSquareSize / 2),
            };
        } else {

            startPosition = {
                x: railMiddleX - (carSquareSize / 2),
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
    
    
    stop() {
       this.pauseMovement();
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