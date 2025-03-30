import { Base_Entity } from "#root/Entities/Base_Entity.js";
import type { Rail } from "#root/Entities/Train_Stuff/Rail.js";
import { Train_Car } from "#root/Entities/Train_Stuff/Train_Car.js";
import type { Position } from "#root/Type_Stuff.js";
import { World } from "#root/World.js";
import { log } from "console";

export class Train extends Base_Entity {
    x = 1;
    y = 1;
    cars: Train_Car[] = new Array();
    constructor(rail: Rail, numberOfCars: number, carSquareSize: number) {
        super();
        numberOfCars = 1;
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
            car.setFrontSide("secondEnd");
            car.setMovementDirection("forwards");
            World.addEntity(car);
           this.cars.push(car);
           if(count > 0) {
            const prevCar: Train_Car = this.cars[(this.cars.length - 1)];
            car.Connect_Car_To(prevCar, "frontSide", "backSide");
           }
        }
    }
    updateState() {
        this.cars.slice().reverse().forEach((car: Train_Car) => {
            
        })
        super.updateState();
    }
}