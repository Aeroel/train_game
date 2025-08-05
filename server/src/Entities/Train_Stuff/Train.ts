import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Rail } from "#root/Entities/Train_Stuff/Rail.js";
import { Train_Car, Train_Car_Motion_Direction } from "#root/Entities/Train_Stuff/Train_Car.js";
import type { Box, Direction, Position } from "#root/Type_Stuff.js";
import { World } from "#root/World.js";
import { log } from "console";

export type Train_Movement_Motion = null| "backwards" | "forwards"

export class Train extends Base_Entity {
    x = 1;
    y = 1;
    Waiting = false;
    Waiting_Car: Train_Car | null = null;
    Waiting_To_Reach_Next_Rail = false;
    Waiting_Car_Current_Rail: Rail | null = null;
    cars: Train_Car[] = new Array();
    movMotion: Train_Movement_Motion = "forwards";
    frontSide: "firstEnd" | "secondEnd" = "secondEnd";
    stopAllCars() {
        this.cars.forEach(car => {
            car.stopMovement();
        })
    }
    constructor(rail: Rail, Forwards_Movement_Directions: Train_Car_Motion_Direction, Backwards_Movement_Directions: Train_Car_Motion_Direction, movementDirection: 'forwards' | 'backwards', numberOfCars: number, carSquareSize: number) {
        super();
        this.movMotion = movementDirection;
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
            car.setMovementDirection(this.movMotion);
            World.addEntity(car);
            console.log("pushed", car.forwards, car.x, car.y)
            this.cars.push(car);
            car.setMovementDirection(movementDirection);
            if (count > 0) {
                const prevCar: Train_Car = this.cars[(this.cars.length - 1)];
                car.Connect_Car_To(prevCar, "frontSide", "backSide");
            }
        }
    }
    setMovementDirection(dir: "backwards"|"forwards"|null) {
      this.cars.forEach(car=>{
        car.setMovementDirection(dir)
      })
    }
    stopMovement() {
      
      this.stopAllCars();
    }
    updateState() {
      this.cars.forEach(car=> {
        if(car.behaviour.Get_Touching_Stop_Spot()===null) {
          return;
        }
        this.stopMovement();
      })
        super.updateState();
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