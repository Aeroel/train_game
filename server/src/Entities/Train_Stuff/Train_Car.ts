import { Assert } from "#root/Assert.js"
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Sliding_Door } from "#root/Entities/Sliding_Door.js";
import { Rail_Switch_Wall } from "#root/Entities/Train_Stuff/Rail_Switch_Wall.js"
import { Wall } from "#root/Entities/Wall.js";
import { World } from "#root/World.js";
import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";
import { Train_Car_Behaviour } from "#root/Entities/Train_Stuff/Train_Car_Behaviour.js";
import { Train_Car_Static } from "#root/Entities/Train_Stuff/Train_Car_Static.js"
import type { Rail } from "#root/Entities/Train_Stuff/Rail.js";
import type { Direction, Orientation, Point, Position, Collision_Info } from "#root/Type_Stuff.js";
import type { Directions_Values } from "#root/Entities/Entity_Movement_Forces.js";
import { Simple_Auto_Increment_Id_Generator } from "#root/Simple_Auto_Increment_Id_Generator.js";
import type { Train } from "#root/Entities/Train_Stuff/Train.js";
import { Bulk_Of_Train_Car_Code } from "#root/Entities/Train_Stuff/Bulk_Of_Train_Car_Code.js";


export { Train_Car };

interface Train_Car_Constructor {
  Backwards_Movement_Directions: Train_Car_Motion_Directions,
  Forwards_Movement_Directions: Train_Car_Motion_Directions,
  x: Base_Entity['x'],
  y: Base_Entity['y'],
  size: Base_Entity['x'] | Base_Entity['y'],
  train: Train,

}

export type Train_Car_Motion_Directions = Direction[]

  
  
export type Train_Car_End = {
  name: Train_Car_End_Name
} & Position;

export type Train_Car_End_Name = "firstEnd" | "secondEnd";
export type Train_Car_Motion = null | "backwards" | "forwards";

export type Train_Car_Motions_Directions = {
  backwards: Train_Car_Motion_Directions,
  forwards: Train_Car_Motion_Directions,
}



class Train_Car extends Base_Entity {
  debug_id = Simple_Auto_Increment_Id_Generator.generateId("Train_Car");

  train: Train;
 passengers: Base_Entity[] = [];
  Wall_And_Door_Thickness = 5;

  Center_Box_Entity!: Base_Entity;


  Walls_And_Doors = this.Create_And_Return_Car_Walls_And_Doors();

  speedPerTick = 0.10 * 10;
  twoPossibleMovementMotions = ["backwards", "forwards"];

  currentMovementMotion: Train_Car_Motion = "backwards";

  lastMovementMotionBeforeNull: Train_Car_Motion = null;

motionsDirections: Train_Car_Motions_Directions = {
    forwards: [],
    backwards: [],
};

  Rail_Movement_Key = `Movement_Car_Id_${this.id}`;

  behaviour: Train_Car_Behaviour;
  bulk_of_code: Bulk_Of_Train_Car_Code;
  orientation: Orientation = "horizontal"

  constructor({ Backwards_Movement_Directions, Forwards_Movement_Directions, x, y, size, train }: Train_Car_Constructor) {
    if (!isFinite(x) || !isFinite(y) || !(size > 0)) {
      throw new Error(`x and y and size must be passed and be finite numbers. size must be greater than 0; Passed xysize are instead: ${x} and ${y} and ${size}`);
    }
    super();
    this.setColor("brown");
    this.addTag("Train_Car");
    
    Train_Car_Static.setMotionsDirections(this, Forwards_Movement_Directions, Backwards_Movement_Directions);
   
    if(Forwards_Movement_Directions.includes("down") || Forwards_Movement_Directions.includes("up")) {
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
    this.Add_Car_Walls_And_Doors_To_Propagation();
  }
  
  setMotionsDirections(forwards: Train_Car_Motion_Directions, backwards: Train_Car_Motion_Directions) {
   Train_Car_Static.setMotionsDirections(this, forwards, backwards);
 
  }
  

  Init_Force_Keys() {
    this.movementForces.Init_A_Component_With_Same_Key_For_Each_Direction(this.Rail_Movement_Key);
  }
  
  Add_Car_Walls_And_Doors_To_Propagation() {
    // all walls and doors of the car
    for (const wall_or_door of Object.values(this.Walls_And_Doors)) {
      this.movementForces.Add_Entity_To_Propagation_List(wall_or_door);
      if (wall_or_door instanceof Sliding_Door) {
        for (const sensor of Object.values(wall_or_door.sensors)) {
          this.movementForces.Add_Entity_To_Propagation_List(sensor)
        }
      }

    }
    // and the central box
    this.movementForces.Add_Entity_To_Propagation_List(this.Center_Box_Entity);

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
   
   if(this.currentMovementMotion === null) {
     return;
   }
    this.lastMovementMotionBeforeNull = this.currentMovementMotion;
    
    this.currentMovementMotion = null;

    this.movementForces.Set_A_Component_For_Each_Direction_By_Same_Key(this.Rail_Movement_Key, this.movementForces.Get_No_Movement_Forces());

  }


  move_handler() {
  const forces = this.determine_new_forces_for_movement_along_the_rail(); 
   this.movementForces.Set_A_Component_For_Each_Direction_By_Same_Key(this.Rail_Movement_Key, forces);
 //   console.log(this.x, this.y)
    if (this.currentMovementMotion === null) {
      return false;
    }
    
    this.switchHandler();
  }
  
  
  Get_Switch_Sensor_Collisions() {
    const Switch_Sensor_Collisions: Collision_Info[] = [];
    
   const all= Collision_Stuff.findAllCollisions(this, (other)=>other.hasTag("Rail_Switch_Wall"));
   
   if(!all) {
     return Switch_Sensor_Collisions;
     }
     
     all.forEach(collisionInfo=> {
      const rail_switch_wall = collisionInfo.entityB as Rail_Switch_Wall;
      if(!this.Sensor_Accepts(rail_switch_wall)) {
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
      if (this.currentMovementMotion === null) {
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
      if(this.motionsDirections["forwards"].includes('up') || this.motionsDirections["forwards"].includes('down')) {
       Consumable_Budget = Math.abs(beginningPos.y - supposedNextPos.y)
      } else {
         Consumable_Budget = Math.abs(beginningPos.x - supposedNextPos.x)
      }
      let Budget_Remaining=Consumable_Budget;
 
      this.Sensor_Wall_Stuff(rail_switch_wall);
      /* and the most complicated thing I need to do is to sync up entities that remain in the car as I snap back the car */
      let spent = this.teleportAndBringPassengers(closest.Position_Just_Before_Collision_A.x, closest.Position_Just_Before_Collision_A.y)
      Budget_Remaining -= spent;
      // now begins the budget loop
      while(Budget_Remaining > 0) {
        const newForces = this.determine_new_forces_for_movement_along_the_rail();
        for(const dir in newForces) {
          const key = dir as keyof Directions_Values
          if(newForces[key] <= 0) {
            return;
          }
            newForces[key] = Budget_Remaining;
        }
        this.movementForces.Set_A_Component_For_Each_Direction_By_Same_Key(this.Rail_Movement_Key, newForces);
        const closestSensorCollision = this.Get_Closest_Sensor_Collision();
        if(closestSensorCollision === null) {
           const finalPos = this.calculateNextPositionBasedOnForcesAndDeltaTime();
            this.teleportAndBringPassengers(finalPos.x, finalPos.y);
        this.movementForces.Set_A_Component_For_Each_Direction_By_Same_Key(this.Rail_Movement_Key, this.movementForces.Get_No_Movement_Forces());
            return;
        }

        const pos = closestSensorCollision.Position_Just_Before_Collision_A;
        spent = this.teleportAndBringPassengers(pos.x, pos.y);
        Budget_Remaining -= spent;
      }
    
      this.movementForces.Set_A_Component_For_Each_Direction_By_Same_Key(this.Rail_Movement_Key, this.movementForces.Get_No_Movement_Forces());

  }

Sensor_Accepts(rail_switch_wall: Rail_Switch_Wall) {
          const movementDirs = this.currentMovementDirs();
      if(movementDirs === null){

        return false;
      }
     //console.log(rail_switch_wall.triggersUponContactWithCarIf)
      const theCarMovementWillTriggerTheWall = rail_switch_wall.areDirectionsAlignedForTrigger(movementDirs);

      return theCarMovementWillTriggerTheWall;
}
Sensor_Wall_Stuff(rail_switch_wall: Rail_Switch_Wall) {
  if(this.currentMovementMotion === null) {
    throw new Error("do not call sensor stuff func unless you know train is moving, bro")
  }
  // I think this call is du0licate from switch sensor collisions check but too lazy to think and afraid to remove. but probably redundant and pointless to do it again here
   if(!this.Sensor_Accepts(rail_switch_wall)) {
     return;
   }
      // Okay, so from point, we know that the wall and car need us to process the logic
      this.setMotionDirections(this.currentMovementMotion, rail_switch_wall.modifiesCarTo);
      
      this.setMotionDirections(this.getOppositeCarMovementMotion(this.currentMovementMotion), this.getOppositeDirections(rail_switch_wall.modifiesCarTo))
}

setMotionDirections(motion: Train_Car_Motion, directions: Train_Car_Motion_Directions) {
  Train_Car_Static.setMotionDirections(this, motion, directions);
}
  teleportAndBringPassengers(toX: number, toY: number) {
    Assert.that(
      this.currentMovementMotion !== null, );
    Assert.that(
      this.motionsDirections.forwards.length > 0 && this.motionsDirections.backwards.length > 0,
      );
    
    const carDeltaX = toX - this.x;
    const carDeltaY = toY - this.y;

    this.x = toX;
    this.y = toY;

   this.teleportCarContentsAndPassengersByDelta(carDeltaX, carDeltaY);
    if(this.motionsDirections["forwards"].includes('up') || this.motionsDirections["forwards"].includes('down')) {
    return carDeltaY;
    } else {
      return carDeltaX;
    }
  }
  teleportCarContentsAndPassengersByDelta(dx: number, dy: number) {

    const carContentsAndPassengers = this.getCarContentsAndPassengers();
    for (const entity of carContentsAndPassengers) {
      const newX = entity.x + dx;
      const newY = entity.y + dy;
      entity.setXY(newX, newY);

    }
  }
  getCarContentsAndPassengers(): Base_Entity[] {
    const entities: Base_Entity[] =[];
    entities.push(...this.movementForces.Entities_That_Also_Get_The_Forces_Of_This_Entity);
    return entities
  }
  
  
  getOppositeCarMovementMotion(motion: Train_Car_Motion) {
   if(motion === null) {
    throw new Error("motion is null, but this must not happen. Check the code leading up to this.") 
   }
   else if(motion==="backwards") {
     return "forwards"
   }
   else if(motion==="forwards") {
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
    if(this.currentMovementMotion === null) {
      return null;
    }
    return this.motionsDirections[this.currentMovementMotion];
  }
  Is_Moving(): boolean {
    const isMoving: boolean = (this.currentMovementMotion === 'backwards' || this.currentMovementMotion === 'forwards');
    return isMoving;
  }


  determine_new_forces_for_movement_along_the_rail(): Directions_Values {
    return this.bulk_of_code.determine_new_forces_for_movement_along_the_rail();
  }

closeDoors(dir: Direction) {
  switch(dir) {
    case "right":
            this.Walls_And_Doors.Right_Side_Top_Door.close();
            this.Walls_And_Doors.Right_Side_Bottom_Door.close();
    break;
    case "left":
           this.Walls_And_Doors.Left_Side_Top_Door.close();
            this.Walls_And_Doors.Left_Side_Bottom_Door.close();
    break;
    case "up":
           this.Walls_And_Doors.Top_Left_Door.close();
            this.Walls_And_Doors.Top_Right_Door.close(); 
    break;
    case "down":
            this.Walls_And_Doors.Bottom_Left_Door.close();
            this.Walls_And_Doors.Bottom_Right_Door.close();
    break;
  }
}
openDoors(dir: Direction) {
  switch(dir) {
    case "right":
            this.Walls_And_Doors.Right_Side_Top_Door.open();
            this.Walls_And_Doors.Right_Side_Bottom_Door.open();
    break;
    case "left":
           this.Walls_And_Doors.Left_Side_Top_Door.open();
            this.Walls_And_Doors.Left_Side_Bottom_Door.open();
    break;
    case "up":
           this.Walls_And_Doors.Top_Left_Door.open();
            this.Walls_And_Doors.Top_Right_Door.open(); 
    break;
    case "down":
            this.Walls_And_Doors.Bottom_Left_Door.open();
            this.Walls_And_Doors.Bottom_Right_Door.open();
    break;
  }
}

  setMovementMotion(motion: Train_Car_Motion) {
    if (motion !== null && !(this.twoPossibleMovementMotions.includes(motion))) {
      throw new Error(`Invalid mov motion ${motion} `);
    }
    if(motion===null) {
      this.stopMovement();
      return;
    }
    this.currentMovementMotion = motion;
    const forces = this.determine_new_forces_for_movement_along_the_rail();
      this.movementForces.Set_A_Component_For_Each_Direction_By_Same_Key(this.Rail_Movement_Key, forces);
  }

addToPropagationList() {
      this.Add_Car_Walls_And_Doors_To_Propagation();
         this.determineCarPassengers(); 
}
  updateState() {
    this.addToPropagationList();
    this.move_handler();
    super.updateState();
  }
  determineCarPassengers() {
    const passengers: Base_Entity[]=[];
    const all = Collision_Stuff.findAllCollisions(this, (other)=>other.hasTag("Can_Ride_Train"));
    if(!all) {
      return
    }
    
    this.passengers = all.map(coll=>coll.entityB);
    const car = this;
    this.passengers.forEach(passenger=>{
      car.movementForces.Add_Entity_To_Propagation_List(passenger)
    })
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
  cleanUp() {
    this.movementForces.Clear_Propagation_List();
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
    const dx = info.Position_Just_Before_Collision_A.x - x;
    const dy = info.Position_Just_Before_Collision_A.y - y;
    const distSq = dx * dx + dy * dy;

    if (distSq < minDistSq) {
      minDistSq = distSq;
      closest = info;
    }
  }

  return closest;
}



}
