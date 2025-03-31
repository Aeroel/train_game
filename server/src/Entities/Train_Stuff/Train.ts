import { Collision_Stuff } from "#root/Collision_Stuff.js";
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Rail } from "#root/Entities/Train_Stuff/Rail.js";
import { Train_Car } from "#root/Entities/Train_Stuff/Train_Car.js";
import type { Box, Position } from "#root/Type_Stuff.js";
import { World } from "#root/World.js";
import { log } from "console";

export class Train extends Base_Entity {
    x = 1;
    y = 1;
    Waiting = false;
    Waiting_Car: Train_Car | null = null;
    Waiting_To_Reach_Next_Rail = false;
    Waiting_Car_Current_Rail: Rail | null = null;
    cars: Train_Car[] = new Array();
    movDir: "forwards" | "backwards" = "forwards";
    frontSide: "firstEnd" | "secondEnd" = "secondEnd";
    constructor(rail: Rail, numberOfCars: number, carSquareSize: number) {
        super();
        let startPosition: Position;
        if (rail.getOrientation() === 'horizontal') {
            startPosition = {
                x: rail.getX(),
                y: rail.getY() - (carSquareSize / 2),
            };
        } else {
            startPosition = {
                x: rail.getX() - (carSquareSize / 2),
                y: rail.getY()
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
            const car = new Train_Car({ rail, size: carSquareSize, x: carX, y: carY });
            car.setFrontSide(this.frontSide);
            car.setMovementDirection(this.movDir);
            World.addEntity(car);
            this.cars.push(car);
            if (count > 0) {
                const prevCar: Train_Car = this.cars[(this.cars.length - 1)];
                car.Connect_Car_To(prevCar, "frontSide", "backSide");
            }
        }
    }
    Handle_Waiting() {
        if (this.Waiting) {
            if (this.Waiting_Car === null) {
                throw new Error(`Must never happen`);
            }

            const Next_Car = this.getNextCar(this.Waiting_Car);
            const Next_Car_Orientation = Next_Car.currentRail.getOrientation();
            let virtualWaitingCar: Box = { x: 0, y: 0, width: 0, height: 0 };
            let virtualNextCar: Box = { x: 0, y: 0, width: 0, height: 0 };
            if (Next_Car_Orientation === 'vertical') {
                virtualNextCar.x = 1;
                virtualNextCar.y = Next_Car.getY();
                virtualNextCar.width = 1;
                virtualNextCar.height = Next_Car.getHeight();

                virtualWaitingCar.x = 1;
                virtualWaitingCar.y = this.Waiting_Car.getY();
                virtualWaitingCar.width = 1;
                virtualWaitingCar.height = this.Waiting_Car.getHeight();
            } else {
                virtualNextCar.x = Next_Car.getX();
                virtualNextCar.y = 1;
                virtualNextCar.width = Next_Car.getWidth();
                virtualNextCar.height = 1;

                virtualWaitingCar.x = this.Waiting_Car.getX();
                virtualWaitingCar.y = 1;
                virtualWaitingCar.width = this.Waiting_Car.getWidth();
                virtualWaitingCar.height = 1;
            }
            if (Collision_Stuff.checkTouchOrIntersect(virtualNextCar, virtualWaitingCar)) {
                return;
            }

            const prevCars = this.getCarsBefore(Next_Car);
            prevCars.forEach((car) => {
                car.setMovementDirection(this.movDir);
            })
            const nextCars = this.getCarsAfter(this.Waiting_Car);
            nextCars.forEach(car => {
                car.stopMovement();
            })
            this.Waiting_To_Reach_Next_Rail = true;
            this.Waiting_Car_Current_Rail = this.Waiting_Car.currentRail;
            this.Waiting = false;

        }
    }
    Handle_Waiting_To_Reach_Next_Rail() {
        if (!this.Waiting_To_Reach_Next_Rail) {
            return;
        }
        if (this.Waiting_Car === null) {
            throw new Error(`Cannot be null without an error somewhere`);
        }
        const Done = !(this.Waiting_Car.currentRail === this.Waiting_Car_Current_Rail);
        if (Done) {
            const nextCars = this.getCarsAfter(this.Waiting_Car);
            nextCars.forEach(car => {
                car.setMovementDirection(this.movDir);
            })

        }
    }
    Handle_Not_Waiting() {
        if (this.Waiting || this.Waiting_To_Reach_Next_Rail) {
            return;
        }
        this.cars.slice().reverse().forEach((car: Train_Car, index: number) => {
            if (this.cars.length <= index + 1) {
                return;
            }
            const nextCar: Train_Car = this.cars[index + 1];
            if (car.currentRail.getOrientation() === nextCar.currentRail.getOrientation()) {
                return;
            }
            const carsBeforeNextCar: Train_Car[] = this.getCarsBefore(nextCar);
            carsBeforeNextCar.forEach((car) => {
                car.stopMovement();
            })
            this.Waiting = true;
            this.Waiting_Car = car;
        })
    }
    updateState() {

        this.Handle_Not_Waiting();
        this.Handle_Waiting();
        this.Handle_Waiting_To_Reach_Next_Rail();
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