import { Collision_Stuff } from "#root/Collision_Stuff.js";
import { World } from "#root/World.js";
import type { Station_Stop_Spot } from "../Station_Stop_Spot.js";
import type { Train_Car, Train_Car_Movement_Direction } from "./Train_Car.js";

export { Train_Car_Behaviour };


class Train_Car_Behaviour {
    /*
          when a train touches station stop spot, it slows down and stops. It waits for 5 seconds before continuing to move it same direction as before.
     */
    car: Train_Car;
    lastSpot: null | Station_Stop_Spot = null;
    Is_Waiting_For_Five_Seconds: boolean  = false;
    Closing_Doors: boolean = false;
    storedMovementDirection: Train_Car_Movement_Direction = null;
    pauseBegunAt = 0;
    constructor(ofThisCar: Train_Car) {
        if(!ofThisCar.hasTag("Train_Car")) {
            throw new Error(`Expected train car, got '${JSON.stringify(ofThisCar)}'`);
        }
        this.car = ofThisCar;
    }
    behaviour() {
        
        const spotOrNull = this.Get_Touching_Stop_Spot();
        const Touching_A_Stop_Spot = !(spotOrNull === null);
        const Not_The_Same_One_As_Before = !(spotOrNull === this.lastSpot);
        if (Touching_A_Stop_Spot && Not_The_Same_One_As_Before) {
            this.Pause_Movement();
            this.Open_Doors();
            this.lastSpot = spotOrNull;
            this.Is_Waiting_For_Five_Seconds = true;
        }
        if (this.Is_Waiting_For_Five_Seconds && this.Did_Five_Seconds_Pass()) {
            this.Close_Doors();
            this.Is_Waiting_For_Five_Seconds = false;
            this.Closing_Doors=true
        }
        if(this.Closing_Doors) {
        let A_Random_Representative_Door
        if(this.car.orientation==='vertical') {
          A_Random_Representative_Door = this.car.Walls_And_Doors.Left_Side_Top_Door;
        } else {
          A_Random_Representative_Door = this.car.Walls_And_Doors.Top_Left_Door;
        }
        if(A_Random_Representative_Door.getState()==='closed') {
        this.Continue_Moving();
        this.Closing_Doors = false;
        }
        }


    }

    Pause_Movement() {
        this.storedMovementDirection = this.car.currentMovementDirection;
        this.pauseBegunAt = Date.now();
        this.car.stopMovement();

    }

    Did_Five_Seconds_Pass() {
        const currTimestamp = Date.now();
        const answer = (currTimestamp > ((5 * 1000) + this.pauseBegunAt));
        return answer;
    }

    Continue_Moving() {
        this.car.setMovementDirection(this.storedMovementDirection);
        this.Is_Waiting_For_Five_Seconds = false;
    }
    Get_Touching_Stop_Spot() : null | Station_Stop_Spot {
        let spotOrNull = null;
        World.getCurrentEntities().forEach(entity => {
            if (this.car === entity) {
                return null;
            }
            if (!entity.hasTag("Station_Stop_Spot")) {
                return null;

            }
            if (!Collision_Stuff.areEntitiesTouching(this.car, entity)) {
                return null;

            }
           spotOrNull = entity as Station_Stop_Spot;
        });
        return spotOrNull;
    }

    Open_Doors() {
        if(this.car.orientation === 'horizontal') {
            this.car.Walls_And_Doors.Top_Left_Door.open();
            this.car.Walls_And_Doors.Top_Right_Door.open();
            this.car.Walls_And_Doors.Bottom_Left_Door.open();
            this.car.Walls_And_Doors.Bottom_Right_Door.open();
        } else {
            this.car.Walls_And_Doors.Left_Side_Top_Door.open();
            this.car.Walls_And_Doors.Left_Side_Bottom_Door.open();
            this.car.Walls_And_Doors.Right_Side_Top_Door.open();
            this.car.Walls_And_Doors.Right_Side_Bottom_Door.open();
        }
    }

    Close_Doors() {
        if(this.car.orientation === 'horizontal') {
            this.car.Walls_And_Doors.Top_Left_Door.close();
            this.car.Walls_And_Doors.Top_Right_Door.close();
            this.car.Walls_And_Doors.Bottom_Left_Door.close();
            this.car.Walls_And_Doors.Bottom_Right_Door.close();
        } else {
            this.car.Walls_And_Doors.Left_Side_Top_Door.close();
            this.car.Walls_And_Doors.Left_Side_Bottom_Door.close();
            this.car.Walls_And_Doors.Right_Side_Top_Door.close();
            this.car.Walls_And_Doors.Right_Side_Bottom_Door.close();
        }
    }

}