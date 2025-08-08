import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Rail } from "#root/Entities/Train_Stuff/Rail.js";
import type { Station_Stop_Spot } from "#root/Entities/Station_Stop_Spot.js"
import { Train_Car, type Train_Car_Motion_Directions } from "#root/Entities/Train_Stuff/Train_Car.js";
import type { Box, Direction, Position } from "#root/Type_Stuff.js";
import { World } from "#root/World.js";
import { log } from "console";

export type Train_Movement_Motion = null| "backwards" | "forwards"

export class Train extends Base_Entity {
    state: "waiting_at_station" | "in_transit" = "in_transit";
    x = 1;
    y = 1;
    cars: Train_Car[] = new Array();
    movementMotion: Train_Movement_Motion = "forwards";
    begunWaitingAt =0;
    begunWaitingForDoorsAt =0;
    previousMovementMotion: Train_Movement_Motion = "forwards";
    Doors_to_control: Direction="right";
    doorsState: "open"|"closed" = "closed";
    lastStationStopSpot: null | Station_Stop_Spot = null;
    currentStationStopSpot: null | Station_Stop_Spot = null;

    constructor(rail: Rail, Forwards_Movement_Directions: Train_Car_Motion_Directions, Backwards_Movement_Directions: Train_Car_Motion_Directions, movementMotion: 'forwards' | 'backwards', numberOfCars: number, carSquareSize: number) {
        super();
        this.movementMotion = movementMotion;
        this.previousMovementMotion = this.movementMotion;
        let startPosition: Position;
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
        for (let count = 0; count < numberOfCars; count++) {
              this.spawnCar(startPosition, count, rail, Forwards_Movement_Directions, Backwards_Movement_Directions, movementMotion, numberOfCars, carSquareSize)
        }
    }
   
   
    
    
    updateState() {
       this.stateHandler();
      
        super.updateState();
    }
 stateHandler() {
    switch(this.state) {
      case "in_transit":
        this.Handle_in_transit_state();
      break;
      case "waiting_at_station":
        this.Handle_waiting_at_station_state();
      break;
      
    }
 }
 Handle_in_transit_state() {
      const Did_the_train_reach_a_station = this.Did_the_train_reach_a_station();
      if(Did_the_train_reach_a_station.answer ==="no") {
        return;
      }
      console.log("yw")
        this.pauseMovement();
        this.state="waiting_at_station";
        
        if(!Did_the_train_reach_a_station.Doors_to_control) {
        throw new Error("Hmm... Door directioj must not be undefined or null")
      }
        this.Doors_to_control = Did_the_train_reach_a_station.Doors_to_control;
        
        this.begunWaitingAt = Date.now();
        this.begunWaitingForDoorsAt = this.begunWaitingAt
 }
 
 Did_the_train_reach_a_station() {
   let answer = "no";
   let Doors_to_control;
   const train = this;
   this.cars.forEach(car=> {
     Collision_Stuff.getClosestCollision(
       car, 
       (other)=>{
         if(!other.hasTag("Station_Stop_Spot")){
           return false;
         }
         if(train.lastStationStopSpot !== null && train.lastStationStopSpot === other) {
           return false;
         }
        
           answer = "yes";
           const station_stop_spot = other as Station_Stop_Spot;
           Doors_to_control = station_stop_spot.Which_Door_Of_A_Car_To_Open_And_Close;
           this.lastStationStopSpot = station_stop_spot;
           return true;
       }
     );
   });
   return { answer, Doors_to_control};
 }
 
 Handle_waiting_at_station_state() {
   
   const Is_it_time_for_the_train_to_leave_the_station = this.Is_it_time_for_the_train_to_leave_the_station();
   const Is_it_time_for_the_doors_to_close = this.Is_it_time_for_the_doors_to_close();
  if(Is_it_time_for_the_doors_to_close.answer ==="yes") {
    this.closeDoors();
  }
   if(Is_it_time_for_the_train_to_leave_the_station.answer === "yes") {
      this.leave();
   } else {
       this.Wait();
   }
 }
 
 leave() {
   
        const Are_the_doors_closed = this.Are_the_doors_closed();
     if(Are_the_doors_closed.answer ==='no') {
       this.closeDoors();
     } else {
       this.proceedToLeaveTheStation();
     }
 }
 
 Are_the_doors_closed() {
 let answer = "no";
 
 return { answer }
}
closeDoors() {
  this.doorsState = "closed";
  const Which_door_to_close= this.Which_door_to_open_and_close(); 
  this.cars.forEach(car => {
    car.closeDoors(Which_door_to_close)
  })
}

Which_door_to_open_and_close() {
  return this.Doors_to_control;
}

 proceedToLeaveTheStation() {
   this.state = "in_transit";
   this.lastStationStopSpot = this.currentStationStopSpot;
   this.resumeMovement();
 }
 Is_it_time_for_the_doors_to_close() {
      const waiting = 7000;
   const currentTime = Date.now();
   const Is_wait_time_is_over = this.doorsState ==="open" && currentTime > (this.begunWaitingForDoorsAt + waiting);
   let answer = "no";
   if(Is_wait_time_is_over===true) {
     answer = "yes";
   }
   return { answer };
 }
 Is_it_time_for_the_train_to_leave_the_station() {
   const waiting = 10000;
   const currentTime = Date.now();
   const Is_wait_time_is_over = currentTime > (this.begunWaitingAt + waiting);
   let answer = "no";
   if(Is_wait_time_is_over===true) {
     answer = "yes";
   }
   return { answer };
 }
 Wait() {
        const Are_the_doors_open =  this.Are_the_doors_open();
     if(Are_the_doors_open.answer ==="no") {
       this.openDoors();
     }
 }
 
 openDoors() {
   this.doorsState = "open"
   this.cars.forEach(car => {
     car.openDoors(this.Doors_to_control);
   })
 }
 Are_the_doors_open() {
   let answer= "no";
   if(this.doorsState ==='open') {
     answer = "yes";
   }
   return { answer}
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
    pauseMovement() {
      this.previousMovementMotion = this.movementMotion;
      this.stopMovement();
    }
    resumeMovement() {
      this.setMovementMotion(this.previousMovementMotion);
    }

    getCarsBefore(car: Train_Car): Train_Car[] {
        const index = this.cars.indexOf(car);
        return index === -1 ? [] : this.cars.slice(0, index);
    }
    getCarsAfter(car: Train_Car): Train_Car[] {
        const index = this.cars.indexOf(car);
        return index === -1 ? [] : this.cars.slice(index + 1);
    }
    getNextCar(car: Train_Car): Train_Car {
        const index = this.cars.indexOf(car);
        const nextCarIndex = index + 1;
        const nextCarExists = (nextCarIndex >= 0 && nextCarIndex < this.cars.length);
        if (!nextCarExists) {
            throw new Error(`getNextCar() called when there is no next car`)
        }
        return this.cars[nextCarIndex];
    }
}