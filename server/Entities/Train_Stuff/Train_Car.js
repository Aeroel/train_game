
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Sliding_Door } from "#root/Entities/Sliding_Door.js";
import { Wall } from "#root/Entities/Wall.js";
import { World } from "#root/World.js";
import { Collision_Stuff } from "#root/Collision_Stuff.js";
import { Train_Car_Behaviour } from "#root/Entities/Train_Stuff/Train_Car_Behaviour.js";
import { Helper_Functions } from "#root/Helper_Functions.js";

export { Train_Car };

class Train_Car extends Base_Entity {
  Wall_And_Door_Thickness = 5;
  currentRail = undefined;
  previousRail = undefined;
  defaultOrientation = "horizontal";
  orientation = this.defaultOrientation;
  previousOrientation = this.orientation;
  twoPossibleEnds = ['firstEnd', 'secondEnd'];
  frontSide = "firstEnd"; // firstEnd or secondEnd
  Walls_And_Doors = {};
  defaultForceToMoveOnRail = 120;
  twoPossibleMovementDirections = ["backwards", "forwards"];
  currentMovementDirection = "backwards";
  lastMovementDirectionBeforeNull = null;
  Center_Box_Entity = {};
  constructor({ x, y, size, rail }) {
    if (!Helper_Functions.isNumeric(x) || !Helper_Functions.isNumeric(y) || !Helper_Functions.isNumeric(size)) {
      throw new Error(`x and y and size must be passed and be numbers, Passed xysize are instead: ${x} and ${y} and ${size}`);
    }
    if (!rail) {
      throw new Error(`Rail must be provided`);

    }
    super();
    this.setColor("brown");
    this.addTag("Train_Car");

    this.setCurrentRail(rail);
    this.setX(x);
    this.setY(y);
    this.Set_To_Square_Of_Size(size);

    this.Insert_Behaviour_Logic();

    this.Add_Car_Walls_And_Doors();

    this.Add_Visual_Side_Entities();
    this.Add_Center_Box_Entity();
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

  Insert_Behaviour_Logic() {
    Helper_Functions.Apply_Mixins(this.constructor, Train_Car_Behaviour);
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
  setCurrentRail(rail) {
    this.previousRail = this.currentRail;
    this.currentRail = rail;
    this.orientation = this.currentRail.orientation;

  }

  is_center_of_car_touching_current_rail() {
    const answer = Collision_Stuff.Do_Entities_Touch_Through_All_Tick_Subpositions(this.Center_Box_Entity, this.currentRail);
    return answer;
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
  getFirstEnd() {
    switch (this.currentRail.orientation) {
      case "vertical":
        return { x: this.x, y: this.getCenterY() - (this.getHeight() / 2) };
        break;
      case "horizontal":
        return { x: this.getCenterX() - (this.getWidth() / 2), y: this.y };
        break;
    }
  }

  getSecondEnd() {
    switch (this.currentRail.orientation) {
      case "vertical":
        return { x: this.x, y: this.getCenterY() + (this.getHeight() / 2) };
        break;
      case "horizontal":
        return { x: this.getCenterX() + (this.getWidth() / 2), y: this.y };
        break;
    }
  }

  is_it_time_to_potentially_switch_rails() {
    return (!this.is_center_of_car_touching_current_rail());
  }

  maybeSwitchRailsOrStopAndRemainOnCurrent() {

    const currentRail = this.currentRail;
    const thisCar = this;
    const currentRailEndClosestToCar = currentRail.getEndClosestTo(thisCar);

    const nextRailIfAny = currentRailEndClosestToCar.rail;
    if (!nextRailIfAny) {
      
      this.stopMovement();
      return;
    }


    this.setCurrentRail(nextRailIfAny);
    
    const newCurrentRailEndClosestToCar = this.currentRail.getEndClosestTo(thisCar);

    const deltaX = newCurrentRailEndClosestToCar.x - this.Center_Box_Entity.getX(); // 5 - 8 = -3
    const deltaY = newCurrentRailEndClosestToCar.y - this.Center_Box_Entity.getY(); // 7 - 5 = 2
    const absDX = Math.abs(deltaX);
    const absDY = Math.abs(deltaY);

    let carLeftOrRight = 'right';
    let XZeroForce = 'left';
    if (deltaX < 0) {
      carLeftOrRight = 'left';
      XZeroForce = 'right';
    }
    let carUpOrDown = 'down';
    let YZeroForce = 'up';
    if (deltaY < 0) {
      carUpOrDown = 'up';
      YZeroForce = 'down';
    }
    const newForces = {};
    newForces[XZeroForce] = 0;
    newForces[YZeroForce] = 0;
    newForces[carLeftOrRight] = absDX;
    newForces[carUpOrDown] = absDY;
    this.setForces(newForces);
    

  }


  get_car_end_closest_to(point) {

    const firstEnd = this.getFirstEnd();
    const secondEnd = this.getSecondEnd();

    // Calculate distances to the point
    const distanceToFirst = calculateDistance(firstEnd, point);
    const distanceToSecond = calculateDistance(secondEnd, point);

    // Determine which end is closer
    if (distanceToFirst < distanceToSecond) {
      return { ...firstEnd, name: "firstEnd" };
    } else {
      return { ...secondEnd, name: "secondEnd" };
    }
    function calculateDistance(end, point) {
      return Math.sqrt(Math.pow(end.x - point.x, 2) + Math.pow(end.y - point.y, 2));
    }
  }

  stopMovement() {
    
    this.lastMovementDirectionBeforeNull = this.currentMovementDirection;
    this.currentMovementDirection = null;

    const negForces = {};
    for (var force in this.forces) {
      if (!Object.prototype.hasOwnProperty.call(this.forces, force)) {
        continue;
      }
      negForces[force] = -(this.forces[force]);
      this.forces[force] = 0;
    }
    this.Add_Forces_To_Entities_That_Are_Located_On_The_Car(negForces);

  }
  setFrontSide(end) {
    if (!this.twoPossibleEnds.includes(end)) {
      throw new Error(`Invalid end ${end}`);

    }
    this.frontSide = end;
  }
  setBackSide(end) {
    if (!this.twoPossibleEnds.includes(end)) {
      throw new Error(`Invalid end ${end}`);

    }
    this.frontSide = this.oppositeOf(end, this.twoPossibleEnds);
  }


  move_handler() {
    if (this.currentMovementDirection === null) {
      return false;
    }
    if (this.isTryingToMoveBeyondTheRail()) {
      console.log("true");
      
      this.maybeSwitchRailsOrStopAndRemainOnCurrent();
      if (this.currentMovementDirection === null) {
        return false;
      }
      return;
    }
    const newForces = this.determine_new_forces_for_movement_along_the_rail();

    this.setForces(newForces);
  }
  determine_new_forces_for_movement_along_the_rail() {
    const defaultForceToMoveOnRail = this.defaultForceToMoveOnRail;
    const newForces = { ...this.forces };
    if (this.currentMovementDirection === null) {
      return this.forces;
    }
    const backSide = this.getBackSide();
    const frontSide = this.getFrontSide();
    if (this.currentRail.orientation === 'vertical') {
      let upOrDown;
      if (this.currentMovementDirection === 'backwards') {
        upOrDown = backSide.y - this.getCenterY();
      } else if (this.currentMovementDirection === 'forwards') {
        upOrDown = frontSide.y - this.getCenterY();
      }
      if (upOrDown < 0) {
        newForces.up = defaultForceToMoveOnRail;
      }
      if (upOrDown > 0) {
        newForces.down = defaultForceToMoveOnRail;
      }
    } else if (this.currentRail.orientation === 'horizontal') {
      let leftOrRight;
      if (this.currentMovementDirection === 'backwards') {
        leftOrRight = backSide.x - this.getCenterX();
      } else if (this.currentMovementDirection === 'forwards') {
        leftOrRight = frontSide.x - this.getCenterX();
      }
      if (leftOrRight < 0) {
        newForces.left = defaultForceToMoveOnRail;
      }
      if (leftOrRight > 0) {
        newForces.right = defaultForceToMoveOnRail;
      }
    }
    return newForces;
  }
  setMovementDirection(dir) {
    if (!this.twoPossibleMovementDirections.includes(dir)) {
      throw new Error(`Invalid mov dir ${dir} `);
    }
    this.currentMovementDirection = dir;
  }

  isTryingToMoveBeyondTheRail() {
    return (!this.is_center_of_car_touching_current_rail());
  }

  updateState() {
    this.move_handler();
    this.Propagate_Forces_Affecting_The_Car_To_Entities_That_Are_Located_On_The_Car();
    super.updateState();
  }

  Propagate_Forces_Affecting_The_Car_To_Entities_That_Are_Located_On_The_Car() {
    const car_forces = this.forces;
    this.Add_Forces_To_Entities_That_Are_Located_On_The_Car(car_forces);
  }
  Add_Forces_To_Entities_That_Are_Located_On_The_Car(forces) {

    // all walls and doors of the car
    for (const wall_or_door of Object.values(this.Walls_And_Doors)) {
      wall_or_door.setForces(forces);
    }
    // and visual sides
    this.Front_Side_Entity.setForces(forces);
    this.Back_Side_Entity.setForces(forces);
    // and the central box
    this.Center_Box_Entity.setForces(forces);


    // all passengers
    World.getCurrentEntities().forEach(entity => {
      if (!this.Car_Has_Entity_For_A_Passenger(entity)) {
        return;
      }

      entity.setForces(forces);
    });


  }
  Car_Has_Entity_For_A_Passenger(entity) {
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
  Create_Car_Walls_And_Doors() {
    this.Walls_And_Doors = {
      Top_Left_Wall: new Wall(),
      Top_Left_Door: new Sliding_Door(),
      Top_Right_Door: new Sliding_Door(),
      Top_Right_Wall: new Wall(),

      Left_Side_Top_Wall: new Wall(),
      Left_Side_Top_Door: new Sliding_Door(),
      Left_Side_Bottom_Door: new Sliding_Door(),
      Left_Side_Bottom_Wall: new Wall(),

      Right_Side_Top_Wall: new Wall(),
      Right_Side_Top_Door: new Sliding_Door(),
      Right_Side_Bottom_Door: new Sliding_Door(),
      Right_Side_Bottom_Wall: new Wall(),

      Bottom_Left_Wall: new Wall(),
      Bottom_Left_Door: new Sliding_Door(),
      Bottom_Right_Door: new Sliding_Door(),
      Bottom_Right_Wall: new Wall(),
    };
  }
  Add_Car_Walls_And_Doors() {
    this.Create_Car_Walls_And_Doors();
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
