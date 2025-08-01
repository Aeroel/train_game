
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Sliding_Door } from "#root/Entities/Sliding_Door.js";
import { Rail_Switch_Wall } from "#root/Entities/Train_Stuff/Rail_Switch_Wall.js"
import { Wall } from "#root/Entities/Wall.js";
import { World } from "#root/World.js";
import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";
import { Train_Car_Behaviour } from "#root/Entities/Train_Stuff/Train_Car_Behaviour.js";
import type { Rail } from "./Rail.js";
import type { Direction, Orientation, Point, Position, Collision_Info } from "#root/Type_Stuff.js";
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
export type Train_Car_In_Motion_Movement_Direction = "backwards" | "forwards"
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

  speedPerTick = 0.10 * 4;
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
 //   console.log(this.x, this.y)
    if (this.currentMovementDirection === null) {
      return false;
    }
    this.switchHandler();

    const newForces = this.determine_new_forces_for_movement_along_the_rail();

    this.forces.setAll(this.Rail_Movement_Key, newForces);
  }
  
  
  Get_Switch_Sensor_Collisions() {
    const Switch_Sensor_Collisions: Collision_Info[] = [];
    World.getCurrentEntities().forEach(entity => {
      if (this === entity) {
        return;
      }
      if (!(entity.hasTag("Rail_Switch_Wall"))) {
        return;
      }
      const rail_switch_wall = entity as Rail_Switch_Wall;
      const collisionInfo = Collision_Stuff.areEntitiesIntersecting(this, rail_switch_wall);
      if (!collisionInfo.Collision_Occurred) {
        return;
      }
      Switch_Sensor_Collisions.push(collisionInfo);
    });
    return Switch_Sensor_Collisions;
  }
  
  
  Get_Closest_Sensor_Collision() {
    const Switch_Sensor_Collisions = this.Get_Switch_Sensor_Collisions();
    const closest = this.getClosest(this.x, this.y, Switch_Sensor_Collisions);
    return closest;
  }
  
  
  switchHandler() {
      if (this.currentMovementDirection === null) {
        return;
      }
    let closest: Collision_Info | null = this.Get_Closest_Sensor_Collision();

    if(closest === null) {
       return;
     }
      const rail_switch_wall = closest.entityB as Rail_Switch_Wall;
      
      const beginningPos = {x: this.x, y: this.y}
      const nextPos = 
        this.calculateNextPositionBasedOnForcesAndDeltaTime()
      
      const supposedNextPos = {
        x:nextPos.x,
      y:nextPos.y}
      
      let Consumable_Budget;
      if(this.forwards.has('up') || this.forwards.has('down')) {
       Consumable_Budget = Math.abs(beginningPos.y - supposedNextPos.y)
      } else {
         Consumable_Budget = Math.abs(beginningPos.x - supposedNextPos.x)
      }
      let Budget_Remaining=Consumable_Budget;
    
 
      this.Sensor_Wall_Stuff(rail_switch_wall);
      /* and the most complicated thing I need to do is to sync up entities that remain in the car as I snap back the car */
      let spent = this.teleportAndBringPassengers(closest.Position_Before_Collision_A.x, closest.Position_Before_Collision_A.y)
      Budget_Remaining -= spent;
      // now begins the budget loop
      while(Budget_Remaining > 0) {
        const newForces = this.determine_new_forces_for_movement_along_the_rail();
        for(const dir in newForces) {
          const key = dir as keyof Forces_Values
          if(newForces[key] <= 0) {
            return;
          }
            newForces[key] = Budget_Remaining;
        }
        this.forces.setAll(this.Rail_Movement_Key, newForces);
        const closestSensorCollision = this.Get_Closest_Sensor_Collision();
        if(closestSensorCollision === null) {
          const finalPos = this.calculateNextPositionBasedOnForcesAndDeltaTime();
            this.teleportAndBringPassengers(finalPos.x, finalPos.y);
            return;
        }

        const pos = closestSensorCollision.Position_Before_Collision_A;
        spent = this.teleportAndBringPassengers(pos.x, pos.y);
        Budget_Remaining -= spent;
      }

  }


Sensor_Wall_Stuff(rail_switch_wall: Rail_Switch_Wall) {
  if(this.currentMovementDirection === null) {
    throw new Error("do not call sensor stuff func unless you know train is moving, bro")
  }
        const movementDirs = this.currentMovementDirs();
      if(movementDirs === null){
        return;
      }
      const theCarMovementWillTriggerTheWall = rail_switch_wall.areDirectionsAlignedForTrigger(movementDirs);
    if(!theCarMovementWillTriggerTheWall) {
      return;
    }


      // Okay, so from point, we know that the wall and car need us to process the logic
      this[this.currentMovementDirection] = new Set<Direction>(rail_switch_wall.modifiesCarTo);
      this[this.getOppositeCarMovementDirection(this.currentMovementDirection)] = new Set<Direction>(this.getOppositeDirections(rail_switch_wall.modifiesCarTo));
}
  teleportAndBringPassengers(toX: number, toY: number) {
    const carDeltaX = toX - this.x;
    const carDeltaY = toY - this.y;

    this.x = toX;
    this.y = toY;

const carContentsAndPassengers = this.getCarContentsAndPassengers();
    for (const entity of carContentsAndPassengers) {
      const newX = entity.x + carDeltaX;
      const newY = entity.y + carDeltaY;
      entity.setXY(newX, newY);
    }
    if(this.forwards.has('up') || this.forwards.has('down')) {
    return carDeltaY;
    } else {
      return carDeltaX;
    }
  }
  getCarContentsAndPassengers(): Base_Entity[] {
    const entities: Base_Entity[] =[];
    entities.push(...this.forces.Entities_That_Also_Get_The_Forces_Of_This_Entity);
        World.getCurrentEntities().forEach((entity: Base_Entity) => {
      if (!this.Car_Has_Entity_For_A_Passenger(entity)) {
        return;
      }
        entities.push(entity)
    });
    return entities
  }
  
  
  getOppositeCarMovementDirection(dir: Train_Car_Movement_Direction) {
   if(dir === null) {
    throw new Error("dir is null, but this must not happen. Check the code leading up to this.") 
   }
   else if(dir==="backwards") {
     return "forwards"
   }
   else if(dir==="forwards") {
     return "backwards"
   } else {
    throw new Error("Should not happen, yes?");
   }
  }
  getOppositeDirections(dirs: Direction[]) {
    const oppositeDirs: Direction[] = []
    dirs.forEach((dir: Direction) => {
      oppositeDirs.push(this.getOppositeDirection(dir));
    })
    return oppositeDirs
  }
 getOppositeDirection(dir:Direction): Direction {
   switch(dir) {
     case "up":
       return "down";
      break;
     case "down":
       return "up";
      break;
     case "left":
       return "right";
      break;
     case "right":
       return "left";
      break;
   }
 }
  currentMovementDirs() {
    if(this.currentMovementDirection === null) {
      return null;
    }
    const theSet= this[this.currentMovementDirection];
    const asArray = [...theSet];
    return asArray
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
 //   this.behaviour.behaviour();
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
 getClosest(
  x: number,
  y: number,
  colls: Collision_Info[]
): Collision_Info | null {
  if(colls.length === 0) {
    return null;
  }
  if(colls.length === 1) {
    return colls[0]
  }
  let closest: Collision_Info = colls[0];
  let minDistSq = Infinity;

  for (const info of colls) {
    const dx = info.Position_Before_Collision_B.x - x;
    const dy = info.Position_Before_Collision_B.y - y;
    const distSq = dx * dx + dy * dy;

    if (distSq < minDistSq) {
      minDistSq = distSq;
      closest = info;
    }
  }

  return closest;
}



}
