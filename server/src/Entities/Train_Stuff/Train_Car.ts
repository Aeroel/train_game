import { My_Assert } from "#root/My_Assert.js"
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Sliding_Door } from "#root/Entities/Sliding_Door.js";
import { Rail_Switch_Wall } from "#root/Entities/Train_Stuff/Rail_Switch_Wall.js"
import { Wall } from "#root/Entities/Wall.js";
import { log } from "#root/My_Log.js";
import { World } from "#root/World.js";
import { World_Tick} from "#root/World_Tick.js";
import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js";
import {Pushable_Entity_With_Unpushable_Entities} from "#root/Collision_Stuff/Collision_Resolution_Methods/Pushable_Entity_With_Unpushable_Entities.js"
import { Train_Car_Behaviour } from "#root/Entities/Train_Stuff/Train_Car_Behaviour.js";
import { Train_Car_Static } from "#root/Entities/Train_Stuff/Train_Car_Static.js"
import type { Rail } from "#root/Entities/Train_Stuff/Rail.js";
import type { Direction, Orientation, Point, Position, Collision_Info } from "#root/Type_Stuff.js";

import { Simple_Auto_Increment_Id_Generator } from "#root/Simple_Auto_Increment_Id_Generator.js";
import type { Train } from "#root/Entities/Train_Stuff/Train.js";
import { Bulk_Of_Train_Car_Code } from "#root/Entities/Train_Stuff/Bulk_Of_Train_Car_Code.js";
import type { Velocity_Component} from "#root/Entities/Entity_Velocity.js"

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

export type Train_Car_Motion = null | "backwards" | "forwards";

export type Train_Car_Motions_Directions = {
  backwards: Train_Car_Motion_Directions,
  forwards: Train_Car_Motion_Directions,
}



class Train_Car extends Base_Entity {
  debug_id = Simple_Auto_Increment_Id_Generator.generateId("Train_Car");
  prevSensor: Rail_Switch_Wall = new Rail_Switch_Wall(0,0, [],  [],0, 0);
  train: Train;
 passengers: Base_Entity[] = [];
 collectedPassengersForThisTick = false;
  Wall_And_Door_Thickness = 5;

  Center_Box_Entity: Base_Entity = new Base_Entity();


  Walls_And_Doors = this.Create_And_Return_Car_Walls_And_Doors();

  normalSpeedForBothAxes = 0.10 * 10;
  currentSpeedForBothAxes = this.normalSpeedForBothAxes;
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
  }
  
    updateState() {
    this.collectCarPassengers();
    this.addToPropagationList();
    this.move_handler();
   super.updateState();
  }
  
  
  collectCarPassengers() {
        this.collectedPassengersForThisTick = true;
    const passengers: Base_Entity[]=[];
    const all = Collision_Stuff.findCollisions(this, (other)=>other.hasTag("Can_Ride_Train"));
    if(all.length ===0) {
      return
    }
    
    all.forEach(coll=>{
      const passenger = coll.entityB;
      this.passengers.push(passenger)
    })
  }

  
  Clean_Up() {
    this.velocity.Clear_Propagation_List();
    this.collectedPassengersForThisTick = false;
    this.passengers = [];

    super.Clean_Up();
  }
  
  addToPropagationList() {
      this.Add_Car_Walls_And_Doors_To_Propagation();
      if(!this.collectedPassengersForThisTick) {
        throw new Error("You forgot to collect passengers");
      }
        this.passengers.forEach(passenger=>{
          this.velocity.Add_To_Propagation_List(passenger.velocity);
        })
}
  
  move_handler() {
  const {vx, vy} = this.determine_new_velocity_for_movement_along_the_rail(); 
   this.velocity.x.Add_Component({key:this.Rail_Movement_Key, value:vx.value});
   this.velocity.y.Add_Component({key:this.Rail_Movement_Key,value: vy.value});

    if (this.currentMovementMotion === null) {
      return false;
    }
    
    this.switchHandler();
    this.currentSpeedForBothAxes = this.normalSpeedForBothAxes;
  }
  
  
  
   
  switchHandler() {
    const switchWallCollision = this .Get_Closest_Switch_Wall_Collision();
    if(!switchWallCollision) {
      return;
    }
        if(switchWallCollision.time===0){
      throw new Error("Car begins in overlap")
    }
    const wall = switchWallCollision.entityB as Rail_Switch_Wall;
    this.Modify_Car_Motion_Directions_On_Switch_Wall_Touch(wall)

    const face = Collision_Stuff.normalToFace(switchWallCollision.normal);
    
    const newPos={
      x: wall.x,
      y: wall.y
    }
    const offset = 5;
    switch(face) {
      case "bottom":
        newPos.y = wall.y + wall.height + offset;
      break;
      case "top":
        newPos.y = wall.y - this.height - offset;
      break;
      case "right":
        newPos.x = wall.x + wall.width - offset;
      break;
      case "left":
        newPos.x = wall.x - this.width + offset;
      break;

    }
    let velocity_budget = this.Get_Velocity_Budget();
    let displacement = this.teleportAndBringPassengers(newPos);
    let spent_velocity = displacement / World_Tick.deltaTime;
    velocity_budget -= spent_velocity;
    
    this.currentSpeedForBothAxes = velocity_budget;
    let updatedVel = this.determine_new_velocity_for_movement_along_the_rail();
    this.velocity.x.Add_Component({key:this.Rail_Movement_Key, value: updatedVel.vx.value})
    this.velocity.y.Add_Component({key:this.Rail_Movement_Key, value: updatedVel.vy.value})
  this.switchHandler();
    
  }

  Get_Velocity_Budget(){
if(this.motionsDirections["forwards"].includes('up') || this.motionsDirections["forwards"].includes('down')) {
    return this.velocity.y.Get_Component_By_Key(this.Rail_Movement_Key).value;
    } else {
    return this.velocity.x.Get_Component_By_Key(this.Rail_Movement_Key).value;
    }
  }
  setMotionsDirections(forwards: Train_Car_Motion_Directions, backwards: Train_Car_Motion_Directions) {
   Train_Car_Static.setMotionsDirections(this, forwards, backwards);
 
  }
  

  Init_Force_Keys() {
    const component= {value:0,key:this.Rail_Movement_Key}
    this.velocity.x.Add_Component(component);
    this.velocity.y.Add_Component(component);
  }
  
  Add_Car_Walls_And_Doors_To_Propagation() {
    // all walls and doors of the car
    for (const wall_or_door of Object.values(this.Walls_And_Doors)) {
      this.velocity.Add_To_Propagation_List(wall_or_door.velocity);
      if (wall_or_door instanceof Sliding_Door) {
        for (const sensor of Object.values(wall_or_door.sensors)) {
          this.velocity.Add_To_Propagation_List(sensor.velocity)
        }
      }

    }
    // and the central box
    this.velocity.Add_To_Propagation_List(this.Center_Box_Entity.velocity);

  }



  Add_Center_Box_Entity() {
    return this.bulk_of_code.Add_Center_Box_Entity();
  }




  stopMovement() {
   
   if(this.currentMovementMotion === null) {
     return;
   }
    this.lastMovementMotionBeforeNull = this.currentMovementMotion;
    
    this.currentMovementMotion = null;

    this.velocity.x.Add_Component({key:this.Rail_Movement_Key, value:0});
    this.velocity.y.Add_Component({key:this.Rail_Movement_Key, value:0});

  }

  
  
  Get_Closest_Switch_Wall_Collision() {
    const closest = Collision_Stuff.getClosestCollision(this, (other)=> {
      if(!other.hasTag("Rail_Switch_Wall")) {
        return false;
        }
        const Switch_Wall = other as Rail_Switch_Wall;
        return Switch_Wall.areDirectionsAlignedForTrigger(this.getCurrentMovementDirs());
      
    });
    return closest;
  }
  



Modify_Car_Motion_Directions_On_Switch_Wall_Touch(rail_switch_wall: Rail_Switch_Wall) {
  if(this.currentMovementMotion === null) {
    throw new Error("do not call sensor stuff func unless you know train is moving, bro")
  }

      // Okay, so from point, we know that the wall and car need us to process the logic
      this.setMotionDirections(this.currentMovementMotion, rail_switch_wall.modifiesCarTo);
      
      this.setMotionDirections(this.getOppositeCarMovementMotion(this.currentMovementMotion), this.getOppositeDirections(rail_switch_wall.modifiesCarTo))
}

setMotionDirections(motion: Train_Car_Motion, directions: Train_Car_Motion_Directions) {
  Train_Car_Static.setMotionDirections(this, motion, directions);
}


  teleportAndBringPassengers(newPos: Position) {
    My_Assert.that(
      this.currentMovementMotion !== null, );
    My_Assert.that(
      this.motionsDirections.forwards.length > 0 && this.motionsDirections.backwards.length > 0,
      );
    
    const carDeltaX = newPos.x - this.x;
    const carDeltaY = newPos.y - this.y;

    this.x = newPos.x;
    this.y = newPos.y;

   this.teleportCarContentsAndPassengersByDelta(carDeltaX, carDeltaY);
   
    if(this.motionsDirections["forwards"].includes('up') || this.motionsDirections["forwards"].includes('down')) {
    return carDeltaY;
    } else {
      return carDeltaX;
    }
  }
  
  teleportCarContentsAndPassengersByDelta(dx: number, dy: number) {
    const allThingsOnCar = this.getCarContentsAndPassengers()
    const collidableParts = allThingsOnCar.filter(e=>e.hasTag("Wall") || e.hasTag("Sliding_Door"));
        const carPassengers = allThingsOnCar.filter(e=>{
      return e.hasTag('Can_Ride_Train')
    });
     const addVX = dx / World_Tick.deltaTime;
      const addVY = dy / World_Tick.deltaTime;
      
    for (const entity of collidableParts) {
      const tempKey = `${Math.random()}`;
     entity.velocity.x.Add_Component({
       key: tempKey,
       value: addVX
     })
     entity.velocity.y.Add_Component({
       key: tempKey,
       value: addVY
     })
     const collisions = Collision_Stuff.findCollisions(entity, other => other.hasTag("Can_Ride_Train")).filter(col=>!(carPassengers.includes(col.entityB)))
      for(const coll of collisions) {

     //   Pushable_Entity_With_Unpushable_Entities.resolveCollision(coll)
      }
      entity.velocity.x.Remove_Component({
        key:tempKey
      })
      entity.velocity.y.Remove_Component({
        key:tempKey
      })
      
        const newX = entity.x + dx;
      const newY = entity.y + dy;
      entity.setXY(newX, newY);
    }

    for (const entity of carPassengers) {
      const newX = entity.x + dx;
      const newY = entity.y + dy;
      entity.setXY(newX, newY);

    }
  }
  getCarContentsAndPassengers(): Base_Entity[] {
    const entities: Base_Entity[] =[];
    entities.push(this.Center_Box_Entity);
    entities.push(...Object.values(this.Walls_And_Doors));
    entities.push(...this.passengers);
    console.log(entities.length);
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
  getCurrentMovementDirs() {
    if(this.currentMovementMotion === null) {
      return null;
    }
    return this.motionsDirections[this.currentMovementMotion];
  }
  Is_Moving(): boolean {
    const isMoving: boolean = (this.currentMovementMotion === 'backwards' || this.currentMovementMotion === 'forwards');
    return isMoving;
  }


  determine_new_velocity_for_movement_along_the_rail(): {vx: Velocity_Component, vy: Velocity_Component} {
    return this.bulk_of_code.determine_new_velocity_for_movement_along_the_rail();
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
    const newVel = this.determine_new_velocity_for_movement_along_the_rail();
      this.velocity.x.Add_Component(newVel.vx );
      this.velocity.y.Add_Component(newVel.vy );
  }


 

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
