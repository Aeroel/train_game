import type { Direction, Point } from "#root/Type_Stuff.js";
import type { Velocity_Component} from "#root/Entities/Entity_Velocity.js";

import { World } from "#root/World.js";
import { Base_Entity } from "../Base_Entity.js";
import type { Train_Car } from "./Train_Car.js";

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



   
    determine_new_velocity_for_movement_along_the_rail(): {vx: Velocity_Component, vy: Velocity_Component }{
         const newVelocity = {
           vx: {key:this.car.Rail_Movement_Key, value:0},
           vy: {key:this.car.Rail_Movement_Key, value:0}
        }
        if (!this.car.Is_Moving() || this.car.currentMovementMotion === null) {
            return newVelocity;
        }




        this.car.motionsDirections[this.car.currentMovementMotion].forEach((dir: Direction) => {
            const {axis, value} = this.car.velocity.directionToAxisVelocity({
               key:this.car.Rail_Movement_Key,
               value: this.car.normalSpeedForBothAxes,
               direction: dir
             })
             if(axis==='y') {
               newVelocity.vy.value=value;
             } else {
               newVelocity.vx.value = value;
             }
        })


        return newVelocity;
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