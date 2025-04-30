
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Sliding_Door } from "#root/Entities/Sliding_Door.js";
import { Wall } from "#root/Entities/Wall.js";
import { World } from "#root/World.js";
import { Collision_Stuff } from "#root/Collision_Stuff.js";
import { Helper_Functions } from "#root/Helper_Functions.js";
import { Train_Car_Behaviour } from "#root/Entities/Train_Stuff/Train_Car_Behaviour.js";
import type { Rail } from "./Rail.js";
import type { Point, Position } from "#root/Type_Stuff.js";
import type { Forces_Values } from "../Entity_Forces.js";
import { log } from "console";
import { Assert_That, Assert_That_Number_Is_Positive } from "#root/Type_Validation_Stuff.js";
import { Simple_Auto_Increment_Id_Generator } from "#root/Simple_Auto_Increment_Id_Generator.js";
import type { Train } from "./Train.js";

export { Train_Car };

interface Train_Car_Constructor {
  x: Base_Entity['x'],
  y: Base_Entity['y'],
  size: Base_Entity['x'] | Base_Entity['y'],
  rail: Rail,
  train: Train,
}

export type Train_Car_End = {
  name: Train_Car_End_Name
} & Position
export type Train_Car_Side = "frontSide" | "backSide";
export type Train_Car_End_Name = "firstEnd" | "secondEnd";
export type Train_Car_Movement_Direction = null | "backwards" | "forwards";
export type Train_Car_Connected_Cars = {
  frontSide: null | Train_Car,
  backSide: null | Train_Car
};

class Train_Car extends Base_Entity {
  debug_id = Simple_Auto_Increment_Id_Generator.generateId("Train_Car");
  connectedCars: Train_Car_Connected_Cars = { frontSide: null, backSide: null };
  train: Train;
  Wall_And_Door_Thickness = 5;
  currentRail!: Rail;
  previousRail!: Rail;
  defaultOrientation = "horizontal";
  twoPossibleEnds = ['firstEnd', 'secondEnd'];
  twoPossibleSides = ['frontSide', 'backSide'];
  frontSide = "firstEnd"; // firstEnd or secondEnd. on hor rails , first is left, on vert rails, first is top
  Walls_And_Doors = this.Create_And_Return_Car_Walls_And_Doors();
  defaultForceToMoveOnRail = 120;
  twoPossibleMovementDirections = ["backwards", "forwards"];
  currentMovementDirection: Train_Car_Movement_Direction = "backwards";
  lastMovementDirectionBeforeNull: Train_Car_Movement_Direction = null;
  Center_Box_Entity!: Base_Entity;
  Back_Side_Entity!: Base_Entity;
  Front_Side_Entity!: Base_Entity;
  Rail_Movement_Key = `Rail_Movement`;
  Riding_Force_Key = `Riding_Car_Id_${this.id}`;
  behaviour;
  constructor({ x, y, size, rail, train}: Train_Car_Constructor) {
    if (!Helper_Functions.isNumber(x) || !Helper_Functions.isNumber(y) || !Helper_Functions.isNumber(size)) {
      throw new Error(`x and y and size must be passed and be numbers, Passed xysize are instead: ${x} and ${y} and ${size}`);
    }
    if (!rail) {
      throw new Error(`Rail must be provided`);

    }
    super();
    this.setColor("brown");
    this.addTag("Train_Car");

    this.train = train;
    this.previousRail = rail;
    this.setCurrentRail(rail);
    this.setX(x);
    this.setY(y);
    this.Set_To_Square_Of_Size(size);


    this.Add_Car_Walls_And_Doors();
    this.Add_Visual_Side_Entities();
    this.Add_Center_Box_Entity();

    this.Init_Force_Keys();
    this.behaviour = new Train_Car_Behaviour(this);
    this.Init_Propagation()
  }
  Connect_Car_To(otherCar: Train_Car, otherCarSide: keyof Train_Car["connectedCars"], thisCarSide: keyof Train_Car["connectedCars"]) {
    this.connectedCars[thisCarSide] = otherCar;
    otherCar.connectedCars[otherCarSide] = this;

  }
  Init_Propagation() {
    // all walls and doors of the car
    for (const wall_or_door of Object.values(this.Walls_And_Doors)) {
      this.forces.Add_To_Propagation_List(wall_or_door);
      if (wall_or_door instanceof Sliding_Door) {
        for (const sensor of Object.values(wall_or_door.sensors)) {
          this.forces.Add_To_Propagation_List(sensor)
        }
      }

    }
    // and visual sides
    this.forces.Add_To_Propagation_List(this.Front_Side_Entity);
    this.forces.Add_To_Propagation_List(this.Back_Side_Entity);
    // and the central box
    this.forces.Add_To_Propagation_List(this.Center_Box_Entity);

  }
  Init_Force_Keys() {
    this.forces.Init_A_Key_For_Each_Force(this.Rail_Movement_Key);
  }

  Add_Center_Box_Entity() {
    const car = this;
    // Calculate center of the car
    const centerX = car.x + (car.width / 2);
    const centerY = car.y + (car.height / 2);

    // Calculate area of the car
    const carArea = car.width * car.height;

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
    this.Center_Box_Entity = boxEntity;
  }

  Add_Visual_Side_Entities() {
    const sideEntitySize = 25;

    this.Back_Side_Entity = new Base_Entity();
    this.Front_Side_Entity = new Base_Entity();

    this.Back_Side_Entity.setColor("purple");
    this.Front_Side_Entity.setColor("red");

    this.Front_Side_Entity.setWidth(sideEntitySize);
    this.Front_Side_Entity.setHeight(sideEntitySize);
    this.Front_Side_Entity.setX(this.getFrontSide().x);
    this.Front_Side_Entity.setY(this.getFrontSide().y);

    this.Back_Side_Entity.setWidth(sideEntitySize);
    this.Back_Side_Entity.setHeight(sideEntitySize);
    this.Back_Side_Entity.setX(this.getBackSide().x);
    this.Back_Side_Entity.setY(this.getBackSide().y);

    World.addEntity(this.Back_Side_Entity);
    World.addEntity(this.Front_Side_Entity);
  }
  setCurrentRail(rail: Rail) {
    this.previousRail = this.currentRail;
    this.currentRail = rail;

  }


  getFrontSide() {
    if (this.frontSide === 'firstEnd') {
      return this.getFirstEnd();
    }
    return this.getSecondEnd();
  }
  getBackSide() {
    if (this.frontSide === 'firstEnd') {
      return this.getSecondEnd();
    }
    return this.getFirstEnd();
  }
  getLeftSide() {
    if (this.currentRail.orientation === 'vertical') {
      if (this.frontSide === 'firstEnd') {
        return { x: this.x, y: (this.getY() + (this.getHeight() / 2)) };
      } else {
        return { x: this.x + this.getWidth(), y: (this.getY() + (this.getHeight() / 2)) };
      }
    } else {
      if (this.frontSide === 'firstEnd') {
        return { x: this.x + (this.getWidth() / 2), y: (this.getY() + (this.getHeight())) };
      } else {
        return { x: this.x + (this.getWidth() / 2), y: (this.getY()) };
      }
    }
  }
  getRightSide() {
    if (this.currentRail.orientation === 'vertical') {
      if (this.frontSide === 'firstEnd') {
        return { x: this.x + this.getWidth(), y: (this.getY() + (this.getHeight() / 2)) };
      } else {
        return { x: this.x, y: (this.getY() + (this.getHeight() / 2)) };
      }
    } else {
      if (this.frontSide === 'firstEnd') {
        return { x: this.x + (this.getWidth() / 2), y: (this.getY()) };
      } else {
        return { x: this.x + (this.getWidth() / 2), y: (this.getY() + (this.getHeight())) };
      }
    }
  }
  getFirstEnd(): Position {
    switch (this.currentRail.orientation) {
      case "vertical":
        return { x: this.x, y: this.getCenterY() - (this.getHeight() / 2) };
        break;
      case "horizontal":
        return { x: this.getCenterX() - (this.getWidth() / 2), y: this.y };
        break;
    }
  }

  getSecondEnd(): Position {
    switch (this.currentRail.orientation) {
      case "vertical":
        return { x: this.x, y: this.getCenterY() + (this.getHeight() / 2) };
        break;
      case "horizontal":
        return { x: this.getCenterX() + (this.getWidth() / 2), y: this.y };
        break;
    }
  }


  Get_Rail_End_Closest_To_Car_Side(side: Train_Car_Side) {
    if (!this.twoPossibleSides.includes(side)) {
      throw new Error(`Side "${side}" invalid, not in twoPossibleSides {${this.twoPossibleSides.toString()}}`);
    }
    const frontSide = this.getFrontSide();
    const backSide = this.getBackSide();

    let sideWeAreWorkingWith;
    if (side === 'frontSide') {
      sideWeAreWorkingWith = frontSide;
    } else {
      sideWeAreWorkingWith = backSide;
    }


    const closest_rail_end = this.currentRail.getEndClosestTo(sideWeAreWorkingWith);
    return closest_rail_end;
  }
  Get_Percentage_Point_Of_Car_Location_On_Rail() {
    let startSide;
    let finishSide;
    let Rail_End_To_Treat_As_Start;
    let Rail_End_To_Treat_As_Finish;
    const closestCarSideToFirstRailEnd = this.currentRail.outOfTwoSidesGetOneClosestToSpecifiedEnd(this.getFrontSide(), this.getBackSide(), "firstEnd");
    

    if (this.currentMovementDirection === 'backwards') {
      startSide = "frontSide";
      finishSide = "backSide";

    } else if (this.currentMovementDirection === 'forwards') {
      startSide = "backSide";
      finishSide = "frontSide";
    }
    if (startSide === 'frontSide' && closestCarSideToFirstRailEnd === 'frontSide') {
      Rail_End_To_Treat_As_Start = this.currentRail.getFirstEnd();
      Rail_End_To_Treat_As_Finish = this.currentRail.getSecondEnd();
    } else if (startSide === 'backSide' && closestCarSideToFirstRailEnd === 'backSide') {
      Rail_End_To_Treat_As_Start = this.currentRail.getFirstEnd();
      Rail_End_To_Treat_As_Finish = this.currentRail.getSecondEnd();
    } else if (startSide === 'frontSide' && closestCarSideToFirstRailEnd === 'backSide') {
      Rail_End_To_Treat_As_Start = this.currentRail.getSecondEnd();
      Rail_End_To_Treat_As_Finish = this.currentRail.getFirstEnd();
    } else if (startSide === 'backSide' && closestCarSideToFirstRailEnd === 'frontSide') {
      Rail_End_To_Treat_As_Start = this.currentRail.getSecondEnd();
      Rail_End_To_Treat_As_Finish = this.currentRail.getFirstEnd();
    } else {
      throw new Error("Impossible?");
    }
    let carCoordValue;
    let railStartCoordValue;
    let railFinishCoordValue;
    if (this.currentRail.orientation === 'horizontal') {
      carCoordValue = this.getCenterX();
      railStartCoordValue = Rail_End_To_Treat_As_Start.x;
      railFinishCoordValue = Rail_End_To_Treat_As_Finish.x;
    } else if (this.currentRail.orientation === 'vertical') {
      carCoordValue = this.getCenterY();
      railStartCoordValue = Rail_End_To_Treat_As_Start.y;
      railFinishCoordValue = Rail_End_To_Treat_As_Finish.y;
    } else {
      throw new Error(`Can't handle car rail orientation ${this.currentRail.orientation}`);
    }

    const Distance_Covered_By_Car_From_Start_So_Far = Math.abs(railStartCoordValue - carCoordValue);
    const Distance_From_Start_To_Finish = Math.abs(railStartCoordValue - railFinishCoordValue);
    const result = (Distance_Covered_By_Car_From_Start_So_Far / Distance_From_Start_To_Finish) * 100;

//    log({Distance_Covered_By_Car_From_Start_So_Far, Distance_From_Start_To_Finish, railStartCoordValue, railFinishCoordValue, carCoordValue, Rail_End_To_Treat_As_Start, Rail_End_To_Treat_As_Finish, startSide, finishSide, result, x: this.getX(), y: this.getY(), ori:this.currentRail.getOrientation(), mov: this.currentMovementDirection, fs: this.frontSide, closestCarSideToFirstRailEnd})
    Assert_That_Number_Is_Positive(result);
    Assert_That(result > 0 && result < 101);
    return result;

  }
  Rail_Handler() {
    const percentage = this.Get_Percentage_Point_Of_Car_Location_On_Rail();
    
    if (percentage < 99.00) {
      return;
    }

    const currentRail = this.currentRail;
    const thisCar = this;
    const currentRailEndClosestToCar = currentRail.getEndClosestTo(thisCar);

    const nextRailIfAny = currentRailEndClosestToCar.connectedRail;
    if (!nextRailIfAny) {

      this.stopMovement();
      this.train.stopAllCars();
      return;
    }


    this.setCurrentRail(nextRailIfAny);
    this.correctlySetSidesAfterRailSwitch();

  }

  correctlySetSidesAfterRailSwitch() {
    if(this.currentRail.orientation === this.previousRail.orientation) {
      return null;
    }
    const farthestRailEnd = this.currentRail.getEnd(this.oppositeOf(this.currentRail.getEndClosestTo(this).name, this.currentRail.twoPossibleEnds));

    const car_end_closest_to_farthest_rail_end = this.get_car_end_closest_to(farthestRailEnd);

    if (this.currentMovementDirection === 'forwards') {
      this.setFrontSide(car_end_closest_to_farthest_rail_end.name);
    }

    if (this.currentMovementDirection === 'backwards') {
      this.setBackSide(car_end_closest_to_farthest_rail_end.name);
    }
  }
  oppositeOf(val: any, vals: any) {
    // Check if val exists in vals
    if (vals.includes(val)) {
      // Find and return the opposite value
      return vals.find((v: any) => v !== val);
    }
    // If val is not found, return undefined or any other indication
    return undefined;
  }



  get_car_end_closest_to(point: Point) {

    const firstEnd = this.getFirstEnd();
    const secondEnd = this.getSecondEnd();

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

  stopMovement() {
    this.lastMovementDirectionBeforeNull = this.currentMovementDirection;
    this.currentMovementDirection = null;
    this.forces.setAll(this.Rail_Movement_Key, this.forces.Get_No_Movement_Forces());

  }
  setFrontSide(end: Train_Car_End_Name) {
    if (!this.twoPossibleEnds.includes(end)) {
      throw new Error(`Invalid end ${end}`);

    }
    this.frontSide = end;
  }
  setBackSide(end: Train_Car_End_Name) {
    if (!this.twoPossibleEnds.includes(end)) {
      throw new Error(`Invalid end ${end}`);

    }
    this.frontSide = this.oppositeOf(end, this.twoPossibleEnds);
  }


  move_handler() {
    if (this.currentMovementDirection === null) {
      return false;
    }
    this.Rail_Handler();

    const newForces = this.determine_new_forces_for_movement_along_the_rail();

    this.forces.setAll(this.Rail_Movement_Key, newForces);
  }
  Is_Moving(): boolean {
    const isMoving: boolean = (this.currentMovementDirection === 'backwards' || this.currentMovementDirection === 'forwards');
    return isMoving;
  }
  determine_new_forces_for_movement_along_the_rail() {

    if (!this.Is_Moving()) {
      return this.forces.Get_No_Movement_Forces();
    }

    const defaultForceToMoveOnRail = this.defaultForceToMoveOnRail;
    const newForces = this.forces.Get_All_By_Key(this.Rail_Movement_Key);

    const backSide = this.getBackSide();
    const frontSide = this.getFrontSide();
    if (this.currentRail.orientation === 'vertical') {
      let upOrDown;
      if (this.currentMovementDirection === 'backwards') {
        upOrDown = backSide.y - this.getCenterY();
      } else if (this.currentMovementDirection === 'forwards') {
        upOrDown = frontSide.y - this.getCenterY();
      } else {
        throw new Error(`Movement direction invalid, right? ${this.currentMovementDirection}`);
      }
      if (upOrDown < 0) {
        newForces.up = defaultForceToMoveOnRail;
        newForces.down = 0;
      }
      if (upOrDown > 0) {
        newForces.down = defaultForceToMoveOnRail;
        newForces.up = 0;
      }
    } else if (this.currentRail.orientation === 'horizontal') {
      let leftOrRight;
      if (this.currentMovementDirection === 'backwards') {
        leftOrRight = backSide.x - this.getCenterX();
      } else if (this.currentMovementDirection === 'forwards') {
        leftOrRight = frontSide.x - this.getCenterX();
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
  setMovementDirection(dir: Train_Car_Movement_Direction) {
    if (dir !== null && !(this.twoPossibleMovementDirections.includes(dir))) {
      throw new Error(`Invalid mov dir ${dir} `);
    }
    this.currentMovementDirection = dir;
  }


  updateState() {
    this.behaviour.behaviour();
    this.move_handler();
    this.Propagate_Forces_Affecting_The_Car_To_Entities_That_Are_Located_On_The_Car();
    super.updateState();
  }

  Propagate_Forces_Affecting_The_Car_To_Entities_That_Are_Located_On_The_Car() {
    const car_forces = this.forces.Get_All_By_Key(this.Rail_Movement_Key);
    this.Add_Forces_To_Entities_That_Are_Located_On_The_Car(car_forces);
  }
  Add_Forces_To_Entities_That_Are_Located_On_The_Car(forces: Forces_Values) {

    const forceKey = this.Riding_Force_Key;


    // all passengers
    World.getCurrentEntities().forEach((entity: Base_Entity) => {
      if (!this.Car_Has_Entity_For_A_Passenger(entity)) {
        return;
      }

      entity.forces.setAll(forceKey, forces);
    });


  }
  Car_Has_Entity_For_A_Passenger(entity: Base_Entity) {
    if (entity === this) {
      return false;
    }
    if (!entity.hasTag("Can_Ride_Train")) {
      return false;
    }
    if (!Collision_Stuff.areEntitiesTouching(this, entity)) {
      return false;
    }
    return true;
  }

  /* 
  
  */
  Create_And_Return_Car_Walls_And_Doors() {
    return {
      Top_Left_Wall: new Wall(),
      Top_Left_Door: new Sliding_Door("left"),
      Top_Right_Door: new Sliding_Door("right"),
      Top_Right_Wall: new Wall(),

      Left_Side_Top_Wall: new Wall(),
      Left_Side_Top_Door: new Sliding_Door("up"),
      Left_Side_Bottom_Door: new Sliding_Door("down"),
      Left_Side_Bottom_Wall: new Wall(),

      Right_Side_Top_Wall: new Wall(),
      Right_Side_Top_Door: new Sliding_Door("up"),
      Right_Side_Bottom_Door: new Sliding_Door("down"),
      Right_Side_Bottom_Wall: new Wall(),

      Bottom_Left_Wall: new Wall(),
      Bottom_Left_Door: new Sliding_Door("left"),
      Bottom_Right_Door: new Sliding_Door("right"),
      Bottom_Right_Wall: new Wall(),
    };

  }
  Add_Car_Walls_And_Doors() {
    this.Create_And_Return_Car_Walls_And_Doors();
    this.Set_Car_Walls_And_Doors_Initial_Positions();
    this.Add_Car_Walls_And_Doors_To_World();

  }
  Add_Car_Walls_And_Doors_To_World() {
    Object.values(this.Walls_And_Doors).forEach(wall => {
      World.addEntity(wall);
    });
  }
  Set_Car_Walls_And_Doors_Initial_Positions() {
    const carX = this.getX();
    const carY = this.getY();
    const carWidth = this.getWidth();
    const carHeight = this.getHeight();
    const Top_And_Bottom_Entity_Width = carWidth / 4; // because top (and bot and left and right, too) has four entities (wall, door, door, wall)
    const Offset_To_The_Right_Of_One_Wall_Or_Door = Top_And_Bottom_Entity_Width;
    const Top_And_Bottom_Entity_Height = this.Wall_And_Door_Thickness;

    const TLW = {
      x: carX,
      y: carY,
      width: Top_And_Bottom_Entity_Width,
      height: Top_And_Bottom_Entity_Height
    };
    this.Walls_And_Doors.Top_Left_Wall.setXYWH(TLW.x, TLW.y, TLW.width, TLW.height);


    const TLD = {
      x: carX + Offset_To_The_Right_Of_One_Wall_Or_Door,
      y: carY,
      width: Top_And_Bottom_Entity_Width,
      height: Top_And_Bottom_Entity_Height
    };
    this.Walls_And_Doors.Top_Left_Door.setXYWH(
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
    this.Walls_And_Doors.Top_Right_Door.setXYWH(
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
    this.Walls_And_Doors.Top_Right_Wall.setXYWH(
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
    this.Walls_And_Doors.Bottom_Left_Wall.setXYWH(
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
    this.Walls_And_Doors.Bottom_Left_Door.setXYWH(
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
    this.Walls_And_Doors.Bottom_Right_Door.setXYWH(
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
    this.Walls_And_Doors.Bottom_Right_Wall.setXYWH(BRW.x, BRW.y, BRW.width, BRW.height);





    // general definitions for both left and right side walls and doors

    const X_Of_Each_Left_Side_Entity = carX;

    const Represents_Total_Height_That_All_Four_Left_Side_Entities_Take_Up = (carHeight - (2 * Top_And_Bottom_Entity_Height));
    const Height_Of_Each_Left_Or_Right_Side_Entity = (Represents_Total_Height_That_All_Four_Left_Side_Entities_Take_Up / 4);

    const Downwards_Offset_Due_To_The_Top_Wall = this.Wall_And_Door_Thickness;
    const Downwards_Offset_Due_To_A_Single_Entity_Above = (1 * Height_Of_Each_Left_Or_Right_Side_Entity);

    const Width_Of_Each_Left_Or_Right_Side_Entity = this.Wall_And_Door_Thickness;


    // now specifically *left* side walls and doors
    const LSTW = {
      x: X_Of_Each_Left_Side_Entity,
      y: carY + Downwards_Offset_Due_To_The_Top_Wall,
      width: Width_Of_Each_Left_Or_Right_Side_Entity,
      height: Height_Of_Each_Left_Or_Right_Side_Entity,
    };
    this.Walls_And_Doors.Left_Side_Top_Wall.setXYWH(LSTW.x, LSTW.y, LSTW.width, LSTW.height);

    const LSTD = {
      x: X_Of_Each_Left_Side_Entity,
      y: carY + Downwards_Offset_Due_To_The_Top_Wall + Downwards_Offset_Due_To_A_Single_Entity_Above,
      width: Width_Of_Each_Left_Or_Right_Side_Entity,
      height: Height_Of_Each_Left_Or_Right_Side_Entity,
    };
    this.Walls_And_Doors.Left_Side_Top_Door.setXYWH(LSTD.x, LSTD.y, LSTD.width, LSTD.height);

    const LSBD = {
      x: X_Of_Each_Left_Side_Entity,
      y: carY + Downwards_Offset_Due_To_The_Top_Wall + Downwards_Offset_Due_To_A_Single_Entity_Above + Downwards_Offset_Due_To_A_Single_Entity_Above,
      width: Width_Of_Each_Left_Or_Right_Side_Entity,
      height: Height_Of_Each_Left_Or_Right_Side_Entity,
    };
    this.Walls_And_Doors.Left_Side_Bottom_Door.setXYWH(LSBD.x, LSBD.y, LSBD.width, LSBD.height);

    const LSBW = {
      x: X_Of_Each_Left_Side_Entity,
      y: carY + Downwards_Offset_Due_To_The_Top_Wall + Downwards_Offset_Due_To_A_Single_Entity_Above + Downwards_Offset_Due_To_A_Single_Entity_Above + Downwards_Offset_Due_To_A_Single_Entity_Above,
      width: Width_Of_Each_Left_Or_Right_Side_Entity,
      height: Height_Of_Each_Left_Or_Right_Side_Entity,
    };
    this.Walls_And_Doors.Left_Side_Bottom_Wall.setXYWH(LSBW.x, LSBW.y, LSBW.width, LSBW.height);


    // now for the right side walls and doors

    const X_Of_Each_Right_Side_Entity = carX + carWidth - this.Wall_And_Door_Thickness;

    const RSTW = {
      x: X_Of_Each_Right_Side_Entity,
      y: carY + Downwards_Offset_Due_To_The_Top_Wall,
      width: Width_Of_Each_Left_Or_Right_Side_Entity,
      height: Height_Of_Each_Left_Or_Right_Side_Entity,
    };
    this.Walls_And_Doors.Right_Side_Top_Wall.setXYWH(RSTW.x, RSTW.y, RSTW.width, RSTW.height);

    const RSTD = {
      x: X_Of_Each_Right_Side_Entity,
      y: carY + Downwards_Offset_Due_To_The_Top_Wall + Downwards_Offset_Due_To_A_Single_Entity_Above,
      width: Width_Of_Each_Left_Or_Right_Side_Entity,
      height: Height_Of_Each_Left_Or_Right_Side_Entity,
    };
    this.Walls_And_Doors.Right_Side_Top_Door.setXYWH(RSTD.x, RSTD.y, RSTD.width, RSTD.height);

    const RSBD = {
      x: X_Of_Each_Right_Side_Entity,
      y: carY + Downwards_Offset_Due_To_The_Top_Wall + Downwards_Offset_Due_To_A_Single_Entity_Above + Downwards_Offset_Due_To_A_Single_Entity_Above,
      width: Width_Of_Each_Left_Or_Right_Side_Entity,
      height: Height_Of_Each_Left_Or_Right_Side_Entity,
    };
    this.Walls_And_Doors.Right_Side_Bottom_Door.setXYWH(RSBD.x, RSBD.y, RSBD.width, RSBD.height);

    const RSBW = {
      x: X_Of_Each_Right_Side_Entity,
      y: carY + Downwards_Offset_Due_To_The_Top_Wall + Downwards_Offset_Due_To_A_Single_Entity_Above + Downwards_Offset_Due_To_A_Single_Entity_Above + Downwards_Offset_Due_To_A_Single_Entity_Above,
      width: Width_Of_Each_Left_Or_Right_Side_Entity,
      height: Height_Of_Each_Left_Or_Right_Side_Entity,
    };
    this.Walls_And_Doors.Right_Side_Bottom_Wall.setXYWH(RSBW.x, RSBW.y, RSBW.width, RSBW.height);


  }



}
