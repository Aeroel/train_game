
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Sliding_Door } from "#root/Entities/Sliding_Door.js";
import { Rail_Switch_Wall } from "#root/Entities/Train_Stuff/Rail_Switch_Wall.js"
import { Wall } from "#root/Entities/Wall.js";
import { World } from "#root/World.js";
import { Collision_Stuff } from "#root/Collision_Stuff.js";
import { Train_Car_Behaviour } from "#root/Entities/Train_Stuff/Train_Car_Behaviour.js";
import type { Rail } from "./Rail.js";
import type { Direction, Orientation, Point, Position } from "#root/Type_Stuff.js";
import type { Forces_Values } from "../Entity_Forces.js";
import { Simple_Auto_Increment_Id_Generator } from "#root/Simple_Auto_Increment_Id_Generator.js";
import type { Train } from "./Train.js";
import { Bulk_Of_Train_Car_Code } from "./Bulk_Of_Train_Car_Code.js";


export { Train_Car };

interface Train_Car_Constructor {
  backwards: Direction,
  forwards: Direction,
  x: Base_Entity['x'],
  y: Base_Entity['y'],
  size: Base_Entity['x'] | Base_Entity['y'],
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

  Center_Box_Entity!: Base_Entity;


  Walls_And_Doors = this.Create_And_Return_Car_Walls_And_Doors();

  defaultForceToMoveOnRail = 0.12 * 4;
  twoPossibleMovementDirections = ["backwards", "forwards"];
  currentMovementDirection: Train_Car_Movement_Direction = "backwards";
  lastMovementDirectionBeforeNull: Train_Car_Movement_Direction = null;
  forwards = new Set<Direction>();
  backwards = new Set<Direction>();

  Rail_Movement_Key = `Rail_Movement`;
  Riding_Force_Key = `Riding_Car_Id_${this.id}`;

  behaviour: Train_Car_Behaviour;
  bulk_of_code: Bulk_Of_Train_Car_Code;
  orientation: Orientation = "horizontal"

  constructor({ backwards, forwards, x, y, size, train }: Train_Car_Constructor) {
    if (!isFinite(x) || !isFinite(y) || !(size > 0)) {
      throw new Error(`x and y and size must be passed and be finite numbers. size must be greater than 0; Passed xysize are instead: ${x} and ${y} and ${size}`);
    }
    super();
    this.setColor("brown");
    this.addTag("Train_Car");
    this.forwards.add(forwards);
    this.backwards.add(backwards);
    if(forwards === "down" || forwards === "up") {
      this.orientation = "vertical"
    } else {
      this.orientation = "horizontal"
    }

    this.behaviour = new Train_Car_Behaviour(this);
    this.bulk_of_code = new Bulk_Of_Train_Car_Code(this);

    this.train = train;
    this.setX(x);
    this.setY(y);
    this.Set_To_Square_Of_Size(size);


    this.Add_Car_Walls_And_Doors();
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
    // and the central box
    this.forces.Add_To_Propagation_List(this.Center_Box_Entity);

  }


  Init_Force_Keys() {
    this.forces.Init_A_Key_For_Each_Force(this.Rail_Movement_Key);
  }


  Add_Center_Box_Entity() {
    return this.bulk_of_code.Add_Center_Box_Entity();
  }



  Rail_Handler() {


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



  stopMovement() {
    this.lastMovementDirectionBeforeNull = this.currentMovementDirection;
    this.currentMovementDirection = null;
    this.forces.setAll(this.Rail_Movement_Key, this.forces.Get_No_Movement_Forces());

  }


  move_handler() {
    if (this.currentMovementDirection === null) {
      return false;
    }
    this.switchHandler();
    this.Rail_Handler();

    const newForces = this.determine_new_forces_for_movement_along_the_rail();

    this.forces.setAll(this.Rail_Movement_Key, newForces);
  }
  switchHandler() {

    World.getCurrentEntities().forEach(entity => {
      if (this === entity) {
        return;
      }
      if (!(entity.hasTag("Rail_Switch_Wall"))) {
        return;
      }
      const rail_switch_wall = entity as Rail_Switch_Wall;
      if (this.currentMovementDirection === null) {
        return;
      }
      const movementDirs = this.currentMovementDirs();
      if(movementDirs === null){
        return;
      }
      let identical = true;
      movementDirs.forEach((dir: Direction) => {
        if(!(rail_switch_wall.acceptsWhenDirectionsAre.includes(dir))) {
          identical = false;
        }
      })
      if (!(identical)) {
        return;
      }

      // todo: use areEntitiesIntersecting instead
      if (Collision_Stuff.areEntitiesTouching(this, rail_switch_wall)) {
        this.train.stopAllCars();
      }

    })
  }

  currentMovementDirs() {
    if(this.currentMovementDirection === null) {
      return null;
    }
    return this[this.currentMovementDirection];
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
