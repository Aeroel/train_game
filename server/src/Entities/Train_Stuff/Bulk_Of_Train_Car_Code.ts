import type { Point } from "#root/Type_Stuff.js";
import { Assert_That, Assert_That_Number_Is_Positive } from "#root/Type_Validation_Stuff.js";
import { World } from "#root/World.js";
import { Base_Entity } from "../Base_Entity.js";
import type { Train_Car, Train_Car_End, Train_Car_End_Name } from "./Train_Car.js";

export { Bulk_Of_Train_Car_Code }

class Bulk_Of_Train_Car_Code {
    car: Train_Car;
    constructor(train_car: Train_Car) {
        if (!train_car.hasTag("Train_Car")) {
            throw new Error("bulk: train car expected");
        }
        this.car = train_car;
    }

    Add_Center_Box_Entity() {
        // Calculate center of the car
        const centerX = this.car.x + (this.car.width / 2);
        const centerY = this.car.y + (this.car.height / 2);

        // Calculate area of the car
        const carArea = this.car.width * this.car.height;

        // Calculate size of the virtual box 
        const boxArea = carArea * 0.050;

        // Assuming the virtual box is square for simplicity
        const boxSize = Math.sqrt(boxArea);

        // Define virtual box dimensions
        const boxWidth = boxSize;
        const boxHeight = boxSize;

        // Calculate virtual box coordinates
        const boxX = centerX - (boxWidth / 2);
        const boxY = centerY - (boxHeight / 2);
        const boxEntity = new Base_Entity();
        boxEntity.setX(boxX);
        boxEntity.setY(boxY);
        boxEntity.setWidth(boxWidth);
        boxEntity.setHeight(boxHeight);
        boxEntity.setColor("gray");
        World.addEntity(boxEntity);
        this.car.Center_Box_Entity = boxEntity;
    }


    Add_Visual_Side_Entities() {
        const sideEntitySize = 25;
        this.car.Back_Side_Entity = new Base_Entity();
        this.car.Front_Side_Entity = new Base_Entity();

        this.car.Back_Side_Entity.setColor("purple");
        this.car.Front_Side_Entity.setColor("red");

        this.car.Front_Side_Entity.setWidth(sideEntitySize);
        this.car.Front_Side_Entity.setHeight(sideEntitySize);
        this.car.Front_Side_Entity.setX(this.car.getFrontSide().x);
        this.car.Front_Side_Entity.setY(this.car.getFrontSide().y);

        this.car.Back_Side_Entity.setWidth(sideEntitySize);
        this.car.Back_Side_Entity.setHeight(sideEntitySize);
        this.car.Back_Side_Entity.setX(this.car.getBackSide().x);
        this.car.Back_Side_Entity.setY(this.car.getBackSide().y);

        World.addEntity(this.car.Back_Side_Entity);
        World.addEntity(this.car.Front_Side_Entity);
    }

    Get_Percentage_Point_Of_Car_Location_On_Rail() {
        let startSide;
        let finishSide;
        let Rail_End_To_Treat_As_Start;
        let Rail_End_To_Treat_As_Finish;
        const closestCarSideToFirstRailEnd = this.car.currentRail.Out_Of_Two_Sides_Get_One_Closest_To_Specified_End(
            this.car.getFrontSide(), 
            this.car.getBackSide(), 
            "firstEnd"
        );


        if (this.car.currentMovementDirection === 'backwards') {
            startSide = "frontSide";
            finishSide = "backSide";

        } else if (this.car.currentMovementDirection === 'forwards') {
            startSide = "backSide";
            finishSide = "frontSide";
        }
        if (startSide === 'frontSide' && closestCarSideToFirstRailEnd === 'frontSide') {
            Rail_End_To_Treat_As_Start = this.car.currentRail.getFirstEnd();
            Rail_End_To_Treat_As_Finish = this.car.currentRail.getSecondEnd();
        } else if (startSide === 'backSide' && closestCarSideToFirstRailEnd === 'backSide') {
            Rail_End_To_Treat_As_Start = this.car.currentRail.getFirstEnd();
            Rail_End_To_Treat_As_Finish = this.car.currentRail.getSecondEnd();
        } else if (startSide === 'frontSide' && closestCarSideToFirstRailEnd === 'backSide') {
            Rail_End_To_Treat_As_Start = this.car.currentRail.getSecondEnd();
            Rail_End_To_Treat_As_Finish = this.car.currentRail.getFirstEnd();
        } else if (startSide === 'backSide' && closestCarSideToFirstRailEnd === 'frontSide') {
            Rail_End_To_Treat_As_Start = this.car.currentRail.getSecondEnd();
            Rail_End_To_Treat_As_Finish = this.car.currentRail.getFirstEnd();
        } else {
            throw new Error("Impossible?");
        }
        let carCoordValue;
        let railStartCoordValue;
        let railFinishCoordValue;
        if (this.car.currentRail.orientation === 'horizontal') {
            carCoordValue = this.car.getCenterX();
            railStartCoordValue = Rail_End_To_Treat_As_Start.x;
            railFinishCoordValue = Rail_End_To_Treat_As_Finish.x;
        } else if (this.car.currentRail.orientation === 'vertical') {
            carCoordValue = this.car.getCenterY();
            railStartCoordValue = Rail_End_To_Treat_As_Start.y;
            railFinishCoordValue = Rail_End_To_Treat_As_Finish.y;
        } else {
            throw new Error(`Can't handle car rail orientation ${this.car.currentRail.orientation}`);
        }

        const Distance_Covered_By_Car_From_Start_So_Far = Math.abs(railStartCoordValue - carCoordValue);
        const Distance_From_Start_To_Finish = Math.abs(railStartCoordValue - railFinishCoordValue);
        const result = (Distance_Covered_By_Car_From_Start_So_Far / Distance_From_Start_To_Finish) * 100;

        //    log({Distance_Covered_By_Car_From_Start_So_Far, Distance_From_Start_To_Finish, railStartCoordValue, railFinishCoordValue, carCoordValue, Rail_End_To_Treat_As_Start, Rail_End_To_Treat_As_Finish, startSide, finishSide, result, x: this.car.getX(), y: this.car.getY(), ori:this.car.currentRail.getOrientation(), mov: this.car.currentMovementDirection, fs: this.car.frontSide, closestCarSideToFirstRailEnd})
        Assert_That_Number_Is_Positive(result);
        Assert_That(result >= 0 && result < 101, `Percentage result is ${result}`);
        return result;
    }


    determine_new_forces_for_movement_along_the_rail() {

        if (!this.car.Is_Moving()) {
            return this.car.forces.Get_No_Movement_Forces();
        }

        const defaultForceToMoveOnRail = this.car.defaultForceToMoveOnRail;
        const newForces = this.car.forces.Get_All_By_Key(this.car.Rail_Movement_Key);

        const backSide = this.car.getBackSide();
        const frontSide = this.car.getFrontSide();
        if (this.car.currentRail.orientation === 'vertical') {
            let upOrDown;
            if (this.car.currentMovementDirection === 'backwards') {
                upOrDown = backSide.y - this.car.getCenterY();
            } else if (this.car.currentMovementDirection === 'forwards') {
                upOrDown = frontSide.y - this.car.getCenterY();
            } else {
                throw new Error(`Movement direction invalid, right? ${this.car.currentMovementDirection}`);
            }
            if (upOrDown < 0) {
                newForces.up = defaultForceToMoveOnRail;
                newForces.down = 0;
            }
            if (upOrDown > 0) {
                newForces.down = defaultForceToMoveOnRail;
                newForces.up = 0;
            }
        } else if (this.car.currentRail.orientation === 'horizontal') {
            let leftOrRight;
            if (this.car.currentMovementDirection === 'backwards') {
                leftOrRight = backSide.x - this.car.getCenterX();
            } else if (this.car.currentMovementDirection === 'forwards') {
                leftOrRight = frontSide.x - this.car.getCenterX();
            } else {
                throw new Error(`Again, currentMovementDirection is not "backwards" or "forwards" even though just a moment ago in the beginning of determine_... function I checked that it is not null... Which means that some function call inbetween might have altered it`);
            }
            if (leftOrRight < 0) {
                newForces.left = defaultForceToMoveOnRail;
                newForces.right = 0;
            }
            if (leftOrRight > 0) {
                newForces.right = defaultForceToMoveOnRail;
                newForces.left = 0;
            }
        }
        return newForces;
    }

    get_car_end_closest_to(point: Point): Train_Car_End {
        const firstEnd = this.car.getFirstEnd();
        const secondEnd = this.car.getSecondEnd();

        // Calculate distances to the point
        const distanceToFirst = calculateDistance(firstEnd, point);
        const distanceToSecond = calculateDistance(secondEnd, point);

        // Determine which end is closer
        if (distanceToFirst < distanceToSecond) {
            const result: Train_Car_End = { ...firstEnd, name: "firstEnd" };
            return result;
        } else {
            const result: Train_Car_End = { ...secondEnd, name: "secondEnd" };
            return result;
        }
        function calculateDistance(end: Point, point: Point) {
            return Math.sqrt(Math.pow(end.x - point.x, 2) + Math.pow(end.y - point.y, 2));
        }
    }


    correctlySetSidesAfterRailSwitch() {
        if (this.car.currentRail.orientation === this.car.previousRail.orientation) {
            return;
        }
        const farthestRailEnd = this.car.currentRail.getEnd(this.car.oppositeOf(this.car.currentRail.getEndClosestTo(this.car).name, this.car.currentRail.twoPossibleEnds));

        const car_end_closest_to_farthest_rail_end = this.car.get_car_end_closest_to(farthestRailEnd);

        if (this.car.currentMovementDirection === 'forwards') {
            this.car.setFrontSide(car_end_closest_to_farthest_rail_end.name);
        }

        if (this.car.currentMovementDirection === 'backwards') {
            this.car.setBackSide(car_end_closest_to_farthest_rail_end.name);
        }
    }


    Set_Car_Walls_And_Doors_Initial_Positions() {
        const carX = this.car.getX();
        const carY = this.car.getY();
        const carWidth = this.car.getWidth();
        const carHeight = this.car.getHeight();
        const Top_And_Bottom_Entity_Width = carWidth / 4; // because top (and bot and left and right, too) has four entities (wall, door, door, wall)
        const Offset_To_The_Right_Of_One_Wall_Or_Door = Top_And_Bottom_Entity_Width;
        const Top_And_Bottom_Entity_Height = this.car.Wall_And_Door_Thickness;

        const TLW = {
            x: carX,
            y: carY,
            width: Top_And_Bottom_Entity_Width,
            height: Top_And_Bottom_Entity_Height
        };
        this.car.Walls_And_Doors.Top_Left_Wall.setXYWH(TLW.x, TLW.y, TLW.width, TLW.height);


        const TLD = {
            x: carX + Offset_To_The_Right_Of_One_Wall_Or_Door,
            y: carY,
            width: Top_And_Bottom_Entity_Width,
            height: Top_And_Bottom_Entity_Height
        };
        this.car.Walls_And_Doors.Top_Left_Door.setXYWH(
            TLD.x,
            TLD.y,
            TLD.width,
            TLD.height
        );

        const TRD = {
            x: carX + Offset_To_The_Right_Of_One_Wall_Or_Door + Offset_To_The_Right_Of_One_Wall_Or_Door,
            y: carY,
            width: Top_And_Bottom_Entity_Width,
            height: Top_And_Bottom_Entity_Height
        };
        this.car.Walls_And_Doors.Top_Right_Door.setXYWH(
            TRD.x,
            TRD.y,
            TRD.width,
            TRD.height
        );


        const TRW = {
            x: carX + Offset_To_The_Right_Of_One_Wall_Or_Door + Offset_To_The_Right_Of_One_Wall_Or_Door + Offset_To_The_Right_Of_One_Wall_Or_Door,
            y: carY,
            width: Top_And_Bottom_Entity_Width,
            height: Top_And_Bottom_Entity_Height,
        };
        this.car.Walls_And_Doors.Top_Right_Wall.setXYWH(
            TRW.x,
            TRW.y,
            TRW.width,
            TRW.height
            ,
        );

        // now bot side

        const Bottom_Entities_Y = ((carY + carHeight) - Top_And_Bottom_Entity_Height);
        const BLW = {
            x: carX,
            y: Bottom_Entities_Y,
            width: Top_And_Bottom_Entity_Width,
            height: Top_And_Bottom_Entity_Height,
        };
        this.car.Walls_And_Doors.Bottom_Left_Wall.setXYWH(
            BLW.x,
            BLW.y,
            BLW.width,
            BLW.height);

        const BLD = {
            x: carX + Offset_To_The_Right_Of_One_Wall_Or_Door,
            y: Bottom_Entities_Y,
            width: Top_And_Bottom_Entity_Width,
            height: Top_And_Bottom_Entity_Height,
        };
        this.car.Walls_And_Doors.Bottom_Left_Door.setXYWH(
            BLD.x,
            BLD.y,
            BLD.width,
            BLD.height
        );

        const BRD = {
            x: carX + Offset_To_The_Right_Of_One_Wall_Or_Door + Offset_To_The_Right_Of_One_Wall_Or_Door,
            y: Bottom_Entities_Y,
            width: Top_And_Bottom_Entity_Width,
            height: Top_And_Bottom_Entity_Height,
        };
        this.car.Walls_And_Doors.Bottom_Right_Door.setXYWH(
            BRD.x,
            BRD.y,
            BRD.width,
            BRD.height
        );

        const BRW = {
            x: carX + Offset_To_The_Right_Of_One_Wall_Or_Door + Offset_To_The_Right_Of_One_Wall_Or_Door + Offset_To_The_Right_Of_One_Wall_Or_Door,
            y: Bottom_Entities_Y,
            width: Top_And_Bottom_Entity_Width,
            height: Top_And_Bottom_Entity_Height,
        };
        this.car.Walls_And_Doors.Bottom_Right_Wall.setXYWH(BRW.x, BRW.y, BRW.width, BRW.height);





        // general definitions for both left and right side walls and doors

        const X_Of_Each_Left_Side_Entity = carX;

        const Represents_Total_Height_That_All_Four_Left_Side_Entities_Take_Up = (carHeight - (2 * Top_And_Bottom_Entity_Height));
        const Height_Of_Each_Left_Or_Right_Side_Entity = (Represents_Total_Height_That_All_Four_Left_Side_Entities_Take_Up / 4);

        const Downwards_Offset_Due_To_The_Top_Wall = this.car.Wall_And_Door_Thickness;
        const Downwards_Offset_Due_To_A_Single_Entity_Above = (1 * Height_Of_Each_Left_Or_Right_Side_Entity);

        const Width_Of_Each_Left_Or_Right_Side_Entity = this.car.Wall_And_Door_Thickness;


        // now specifically *left* side walls and doors
        const LSTW = {
            x: X_Of_Each_Left_Side_Entity,
            y: carY + Downwards_Offset_Due_To_The_Top_Wall,
            width: Width_Of_Each_Left_Or_Right_Side_Entity,
            height: Height_Of_Each_Left_Or_Right_Side_Entity,
        };
        this.car.Walls_And_Doors.Left_Side_Top_Wall.setXYWH(LSTW.x, LSTW.y, LSTW.width, LSTW.height);

        const LSTD = {
            x: X_Of_Each_Left_Side_Entity,
            y: carY + Downwards_Offset_Due_To_The_Top_Wall + Downwards_Offset_Due_To_A_Single_Entity_Above,
            width: Width_Of_Each_Left_Or_Right_Side_Entity,
            height: Height_Of_Each_Left_Or_Right_Side_Entity,
        };
        this.car.Walls_And_Doors.Left_Side_Top_Door.setXYWH(LSTD.x, LSTD.y, LSTD.width, LSTD.height);

        const LSBD = {
            x: X_Of_Each_Left_Side_Entity,
            y: carY + Downwards_Offset_Due_To_The_Top_Wall + Downwards_Offset_Due_To_A_Single_Entity_Above + Downwards_Offset_Due_To_A_Single_Entity_Above,
            width: Width_Of_Each_Left_Or_Right_Side_Entity,
            height: Height_Of_Each_Left_Or_Right_Side_Entity,
        };
        this.car.Walls_And_Doors.Left_Side_Bottom_Door.setXYWH(LSBD.x, LSBD.y, LSBD.width, LSBD.height);

        const LSBW = {
            x: X_Of_Each_Left_Side_Entity,
            y: carY + Downwards_Offset_Due_To_The_Top_Wall + Downwards_Offset_Due_To_A_Single_Entity_Above + Downwards_Offset_Due_To_A_Single_Entity_Above + Downwards_Offset_Due_To_A_Single_Entity_Above,
            width: Width_Of_Each_Left_Or_Right_Side_Entity,
            height: Height_Of_Each_Left_Or_Right_Side_Entity,
        };
        this.car.Walls_And_Doors.Left_Side_Bottom_Wall.setXYWH(LSBW.x, LSBW.y, LSBW.width, LSBW.height);


        // now for the right side walls and doors

        const X_Of_Each_Right_Side_Entity = carX + carWidth - this.car.Wall_And_Door_Thickness;

        const RSTW = {
            x: X_Of_Each_Right_Side_Entity,
            y: carY + Downwards_Offset_Due_To_The_Top_Wall,
            width: Width_Of_Each_Left_Or_Right_Side_Entity,
            height: Height_Of_Each_Left_Or_Right_Side_Entity,
        };
        this.car.Walls_And_Doors.Right_Side_Top_Wall.setXYWH(RSTW.x, RSTW.y, RSTW.width, RSTW.height);

        const RSTD = {
            x: X_Of_Each_Right_Side_Entity,
            y: carY + Downwards_Offset_Due_To_The_Top_Wall + Downwards_Offset_Due_To_A_Single_Entity_Above,
            width: Width_Of_Each_Left_Or_Right_Side_Entity,
            height: Height_Of_Each_Left_Or_Right_Side_Entity,
        };
        this.car.Walls_And_Doors.Right_Side_Top_Door.setXYWH(RSTD.x, RSTD.y, RSTD.width, RSTD.height);

        const RSBD = {
            x: X_Of_Each_Right_Side_Entity,
            y: carY + Downwards_Offset_Due_To_The_Top_Wall + Downwards_Offset_Due_To_A_Single_Entity_Above + Downwards_Offset_Due_To_A_Single_Entity_Above,
            width: Width_Of_Each_Left_Or_Right_Side_Entity,
            height: Height_Of_Each_Left_Or_Right_Side_Entity,
        };
        this.car.Walls_And_Doors.Right_Side_Bottom_Door.setXYWH(RSBD.x, RSBD.y, RSBD.width, RSBD.height);

        const RSBW = {
            x: X_Of_Each_Right_Side_Entity,
            y: carY + Downwards_Offset_Due_To_The_Top_Wall + Downwards_Offset_Due_To_A_Single_Entity_Above + Downwards_Offset_Due_To_A_Single_Entity_Above + Downwards_Offset_Due_To_A_Single_Entity_Above,
            width: Width_Of_Each_Left_Or_Right_Side_Entity,
            height: Height_Of_Each_Left_Or_Right_Side_Entity,
        };
        this.car.Walls_And_Doors.Right_Side_Bottom_Wall.setXYWH(RSBW.x, RSBW.y, RSBW.width, RSBW.height);

    }

}