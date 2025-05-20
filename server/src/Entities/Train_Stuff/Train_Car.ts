
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
import { Bulk_Of_Train_Car_Code } from "./Bulk_Of_Train_Car_Code.js";


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
} & Position;
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
  Center_Box_Entity!: Base_Entity;
  Back_Side_Entity!: Base_Entity;
  Front_Side_Entity!: Base_Entity;
  defaultOrientation = "horizontal";
  twoPossibleEnds = ['firstEnd', 'secondEnd'];
  twoPossibleSides = ['frontSide', 'backSide'];
  frontSide = "firstEnd"; // firstEnd or secondEnd. on hor rails , first is left, on vert rails, first is top
  Walls_And_Doors = this.Create_And_Return_Car_Walls_And_Doors();
  defaultForceToMoveOnRail = 0.12;
  twoPossibleMovementDirections = ["backwards", "forwards"];
  currentMovementDirection: Train_Car_Movement_Direction = "backwards";
  lastMovementDirectionBeforeNull: Train_Car_Movement_Direction = null;
  Rail_Movement_Key = `Rail_Movement`;
  Riding_Force_Key = `Riding_Car_Id_${this.id}`;
  behaviour: Train_Car_Behaviour;
  bulk_of_code: Bulk_Of_Train_Car_Code;
  constructor({ x, y, size, rail, train }: Train_Car_Constructor) {
    if (!isFinite(x) || !isFinite(y) || !(size > 0)) {
      throw new Error(`x and y and size must be passed and be finite numbers. size must be greater than 0; Passed xysize are instead: ${x} and ${y} and ${size}`);
    }
    if (!(rail.hasTag("Rail"))) {
      throw new Error(`Rail entity must be provided; no Rail tag found`);

    }
    super();
    this.setColor("brown");
    this.addTag("Train_Car");


    this.behaviour = new Train_Car_Behaviour(this);
    this.bulk_of_code = new Bulk_Of_Train_Car_Code(this);

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
    return this.bulk_of_code.Add_Center_Box_Entity();
  }


  Add_Visual_Side_Entities() {
    return this.bulk_of_code.Add_Visual_Side_Entities();
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


  Get_Percentage_Point_Of_Car_Location_On_Rail(): number {

    return this.bulk_of_code.Get_Percentage_Point_Of_Car_Location_On_Rail();

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
    return this.bulk_of_code.correctlySetSidesAfterRailSwitch();
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



  get_car_end_closest_to(point: Point): Train_Car_End {
    return this.bulk_of_code.get_car_end_closest_to(point);
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


  determine_new_forces_for_movement_along_the_rail(): Forces_Values {
    return this.bulk_of_code.determine_new_forces_for_movement_along_the_rail();
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
    return this.bulk_of_code.Set_Car_Walls_And_Doors_Initial_Positions();

  }



}
