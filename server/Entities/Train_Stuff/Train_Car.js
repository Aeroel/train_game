
import { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Sliding_Door } from "#root/Entities/Sliding_Door.js";
import { Wall } from "#root/Entities/Wall.js";
import { World } from "#root/World.js";
import { Train_Car_Static } from "#root/Entities/Train_Stuff/Train_Car_Static.js";
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
  constructor({ x, y, size }) {
    if (!Helper_Functions.isNumeric(x) || !Helper_Functions.isNumeric(y) || !Helper_Functions.isNumeric(size)) {
      throw new Error("x and y and size must be passed and be numbers");
    }
    super();
    this.setColor("brown");
    this.addTag("Train_Car");
    this.setX(x);
    this.setX(y);
    this.setSquare(size);

    this.Create_Car_Walls_And_Doors();
    this.Add_Car_Walls_And_Doors_To_World();
    this.Set_Car_Walls_And_Doors_Initial_Positions();

    this.Insert_Behaviour_Logic();
    this.addVisualSideEntities();
  }

  Insert_Behaviour_Logic() {
    Helper_Functions.Apply_Mixins(this.constructor, Train_Car_Behaviour);
  }
  addVisualSideEntities() {
    const sideEntitySize = 25;

    this.backSideEntity = new Base_Entity();
    this.frontSideEntity = new Base_Entity();

    this.backSideEntity.setColor("purple");
    this.frontSideEntity.setColor("red");

    this.frontSideEntity.setWidth(sideEntitySize);
    this.frontSideEntity.setHeight(sideEntitySize);

    this.backSideEntity.setWidth(sideEntitySize);
    this.backSideEntity.setHeight(sideEntitySize);

    World.addEntity(this.backSideEntity);
    World.addEntity(this.frontSideEntity);
  }
  getCenterXAndY() {
    const centerX = this.x + (this.width / 2);
    const centerY = this.y + (this.height / 2);

    return { x: centerX, y: centerY };
  }
  getCenterX() {
    return this.getCenterXAndY().x;
  }
  getCenterY() {
    return this.getCenterXAndY().y;
  }
  setCurrentRail(rail) {
    this.previousRail = this.currentRail;
    this.currentRail = rail;
    if (this.orientation !== this.currentRail.orientation) {
      this.orientation = this.currentRail.orientation;
      const oldWidth = this.getWidth();
      const oldHeight = this.getHeight();
      this.setHeight(oldWidth);
      this.setWidth(oldHeight);
    }

  }
  is_center_of_car_touching_current_rail() {
    const car = this;
    const rail = this.currentRail;
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

    // Check for intersection with rail
    return (
      boxX <= rail.x + rail.width &&
      boxX + boxWidth > rail.x &&
      boxY <= rail.y + rail.height &&
      boxY + boxHeight > rail.y
    );
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
    return (this.currentRail && !this.is_center_of_car_touching_current_rail());
  }

  maybeSwitchRailsOrStopAndRemainOnCurrent() {
    if (!this.is_it_time_to_potentially_switch_rails()) {
      return;
    }
    const currentRail = this.currentRail;
    const thisCar = this;
    const currentRailEndClosestToCar = currentRail.getEndClosestTo(thisCar);

    const nextRailIfAny = currentRailEndClosestToCar.rail;
    if (!nextRailIfAny) {
      const prevSides = this.getSidesAndWH();
      Train_Car_Static.placeCarBackOnCurrentRail(this, currentRail);
      const currentSides = this.getSidesAndWH();
      this.reposition_car_riders(prevSides, currentSides, this.currentRail.orientation, this.currentRail.orientation);
      this.stopMovement();
      return;
    }

    const previousOrientation = this.currentRail.orientation;

    const the_end_of_next_rail_connected_to_current_rail = nextRailIfAny.findEndConnectedTo(currentRail);



    Train_Car_Static.placeCarOnEnd(this, the_end_of_next_rail_connected_to_current_rail);
    this.setCurrentRail(nextRailIfAny);

    const newOrientation = this.currentRail.orientation;

    const prevSides = this.getSidesAndWH();

    this.correctlySetSidesAfterRailSwitch();

    const newSides = this.getSidesAndWH();

    this.reposition_car_riders(prevSides, newSides, previousOrientation, newOrientation);

  }
  reposition_car_riders(prevSides, newSides, oldOrientation, newOrientation) {
    World.getCurrentEntities().forEach(entity => {
      if (entity === this) {
        return;
      }
      if (!entity.hasTag("Can_Ride_Train")) {
        return;
      }
      if (!Collision_Stuff.areEntitiesTouching(this, entity)) {
        return;
      }

      entity.setX(this.getCenterX());
      entity.setY(this.getCenterY());
    });
  }
  getSidesAndWH() {
    return {
      width: this.getWidth(),
      height: this.getHeight(),
      frontSide: this.getFrontSide(),
      backSide: this.getBackSide(),
      rightSide: this.getRightSide(),
      leftSide: this.getLeftSide(),
    };
  }

  correctlySetSidesAfterRailSwitch() {
    const farthestRailEnd = this.currentRail.getEnd(this.oppositeOf(this.currentRail.getEndClosestTo(this).name, this.currentRail.twoPossibleEnds));

    const car_end_closest_to_farthest_rail_end = this.get_car_end_closest_to(farthestRailEnd);

    if (this.currentMovementDirection === 'forwards') {
      this.setFrontSide(car_end_closest_to_farthest_rail_end.name);
    }

    if (this.currentMovementDirection === 'backwards') {
      this.setBackSide(car_end_closest_to_farthest_rail_end.name);
    }
  }
  oppositeOf(val, vals) {
    // Check if val exists in vals
    if (vals.includes(val)) {
      // Find and return the opposite value
      return vals.find(v => v !== val);
    }
    // If val is not found, return undefined or any other indication
    return undefined;
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

    const tempForces = {};
    for (var force in this.forces) {
      if (!Object.prototype.hasOwnProperty.call(this.forces, force)) {
        continue;
      }
      tempForces[force] = this.forces[force];
      this.forces[force] = 0;
    }
    this.subtract_from_riders_forces(tempForces);

  }
  subtract_from_riders_forces(forces) {
    World.getCurrentEntities().forEach(entity => {
      if (!this.carHasTheEntityForAPassenger(entity)) {
        return;
      }
      entity.subtractFromForces(forces);
    });
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
    if (!this.currentRail) {
      return false;
    }
    if (this.currentMovementDirection === null) {
      return false;
    }
    if (this.isTryingToMoveBeyondTheRail()) {
      this.maybeSwitchRailsOrStopAndRemainOnCurrent();
      if (this.currentMovementDirection === null) {
        return false;
      }
    }
    const newForces = this.determine_new_forces_for_movement_along_the_rail();

    this.forces = { ...newForces };
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
    return (this.currentRail && !this.is_center_of_car_touching_current_rail());
  }

  updateState() {
    this.move_handler();
    this.behaviour();
    super.updateState();
    this.handle_car_riders();
    this.reposition_car_and_it_s_non_rider_contents_according_to_current_car_position();
  }
  handle_car_riders() {
    World.getCurrentEntities().forEach(entity => {
      if (!this.carHasTheEntityForAPassenger(entity)) {
        return;
      }

      this.propagateForcesTo(entity);
    });
  }
  carHasTheEntityForAPassenger(entity) {
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
  behaviour() {
  }
  /* 
  
  */
  Create_Car_Walls_And_Doors() {
    this.Walls_And_Doors = {
      Top_Left_Wall: new Wall(),
      Top_Left_Door: new Sliding_Door(),
      Top_Right_Door: new Sliding_Door(),
      Top_Right_Wall: new Wall(),

      Left_Top_Wall: new Wall(),
      Left_Top_Door: new Sliding_Door(),
      Left_Bottom_Door: new Sliding_Door(),
      Left_Bottom_Wall: new Wall(),

      Right_Top_Wall: new Wall(),
      Right_Top_Door: new Sliding_Door(),
      Right_Bottom_Door: new Sliding_Door(),
      Right_Bottom_Wall: new Wall(),

      Bottom_Left_Wall: new Wall(),
      Bottom_Left_Door: new Sliding_Door(),
      Bottom_Right_Door: new Sliding_Door(),
      Bottom_Right_Wall: new Wall(),
    };
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
    const Top_And_Bottom_Entity_Height = this.Wall_And_Door_Thickness;

  const TLW = {x: carX, y: carY, width: Top_And_Bottom_Entity_Width, Top_And_Bottom_Entity_Height};
    this.Walls_And_Doors.Top_Left_Wall.setXYWH(TLW.x, TLW.y, TLW.width, TLW.height);

    this.Walls_And_Doors.Top_Left_Door.setXYWH(
      carX + Top_And_Bottom_Entity_Width,
      carY,
      Top_And_Bottom_Entity_Width,
      Top_And_Bottom_Entity_Height
    );

    this.Walls_And_Doors.Top_Right_Door.setXYWH(
      carX + Top_And_Bottom_Entity_Width + Top_And_Bottom_Entity_Width,
      carY,
      Top_And_Bottom_Entity_Width,
      Top_And_Bottom_Entity_Height);


    this.Walls_And_Doors.Top_Right_Wall.setXYWH(
      carX + Top_And_Bottom_Entity_Width + Top_And_Bottom_Entity_Width + Top_And_Bottom_Entity_Width,
      carY,
      Top_And_Bottom_Entity_Width,
      Top_And_Bottom_Entity_Height);

    // now bot side

    this.Walls_And_Doors.Bottom_Left_Wall.setXYWH(
      carX,
      carY + carHeight - Top_And_Bottom_Entity_Height,
      Top_And_Bottom_Entity_Width,
      Top_And_Bottom_Entity_Height);

  }

  reposition_car_and_it_s_non_rider_contents_according_to_current_car_position() {
    this.reposition_visual_sides();
    this.reposition_car_walls_according_to_car_position();
  }
  reposition_visual_sides() {
    this.frontSideEntity.x = this.getFrontSide().x;
    this.frontSideEntity.y = this.getFrontSide().y;
    this.backSideEntity.x = this.getBackSide().x;
    this.backSideEntity.y = this.getBackSide().y;
  }



  // This switches positions of the car walls based on the car's current x, y, w, h and orientation.
  // Probably I can structure this better to abstract away the code for calculating the actual numbers? 
  // Maybe the four lines per wall into a separate function and call it once per wall instead?
  reposition_car_walls_according_to_car_position() {
    // Adjust walls according to the current dimensions (horizontal or vertical)
    if (this.orientation === "horizontal") {
      this.setHorizontalWalls();
    } else if (this.orientation === "vertical") {
      this.setVerticalWalls();
    }
  }
  setVerticalWalls() {
    const carConnectorWallsHeight = this.Wall_And_Door_Thickness;
    const carConnectorWallsWidth = this.width / 3;


    Train_Car.setWall(this.Walls_And_Doors.carConnectorAWallA, this.getX(), this.getY(), carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.Walls_And_Doors.carConnectorAWallB, this.getX() + (2 * carConnectorWallsWidth), this.getY(), carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.Walls_And_Doors.carConnectorBWallA, this.getX(), this.getY() + this.getHeight() - carConnectorWallsHeight, carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.Walls_And_Doors.carConnectorBWallB, this.getX() + (2 * carConnectorWallsWidth), this.getY() + this.getHeight() - carConnectorWallsHeight, carConnectorWallsWidth, carConnectorWallsHeight);

    const entranceWallsAndDoorsWidth = this.Wall_And_Door_Thickness;
    const entranceWallsAndDoorsHeight = (this.getHeight() - (2 * carConnectorWallsHeight)) / 4;


    Train_Car.setWall(this.Walls_And_Doors.entranceSideAWallA, this.getX(), this.getY() + carConnectorWallsHeight, entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);
    if (!this.Doors_Must_Be_Skipped) {
      Train_Car.setWall(this.Walls_And_Doors.entranceSideADoorA, this.getX(), this.getY() + carConnectorWallsHeight + entranceWallsAndDoorsHeight, entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

      Train_Car.setWall(this.Walls_And_Doors.entranceSideADoorB, this.getX(), this.getY() + carConnectorWallsHeight + (2 * entranceWallsAndDoorsHeight), entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    }

    Train_Car.setWall(this.Walls_And_Doors.entranceSideAWallB, this.getX(), this.getY() + carConnectorWallsHeight + (3 * entranceWallsAndDoorsHeight), entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);


    Train_Car.setWall(this.Walls_And_Doors.entranceSideBWallA, this.getX() + this.getWidth() - entranceWallsAndDoorsWidth, this.getY() + carConnectorWallsHeight, entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    if (!this.Doors_Must_Be_Skipped) {
      Train_Car.setWall(this.Walls_And_Doors.entranceSideBDoorA, this.getX() + this.getWidth() - entranceWallsAndDoorsWidth, this.getY() + carConnectorWallsHeight + entranceWallsAndDoorsHeight, entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

      Train_Car.setWall(this.Walls_And_Doors.entranceSideBDoorB, this.getX() + this.getWidth() - entranceWallsAndDoorsWidth, this.getY() + carConnectorWallsHeight + (2 * entranceWallsAndDoorsHeight), entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    }
    Train_Car.setWall(this.Walls_And_Doors.entranceSideBWallB, this.getX() + this.getWidth() - entranceWallsAndDoorsWidth, this.getY() + carConnectorWallsHeight + (3 * entranceWallsAndDoorsHeight), entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);
  }
  setHorizontalWalls() {
    const carConnectorWallsHeight = this.height / 3;
    const carConnectorWallsWidth = this.Wall_And_Door_Thickness;


    Train_Car.setWall(this.Walls_And_Doors.carConnectorAWallA, this.getX(), this.getY(), carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.Walls_And_Doors.carConnectorAWallB, this.getX(), this.getY() + (carConnectorWallsHeight * 2), carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.Walls_And_Doors.carConnectorBWallA, (this.getX() + this.getWidth()) - carConnectorWallsWidth, this.getY(), carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.Walls_And_Doors.carConnectorBWallB, (this.getX() + this.getWidth()) - carConnectorWallsWidth, this.getY() + (carConnectorWallsHeight * 2), carConnectorWallsWidth, carConnectorWallsHeight);

    const entranceWallsAndDoorsWidth = (this.getWidth() - (2 * carConnectorWallsWidth)) / 4;
    const entranceWallsAndDoorsHeight = this.Wall_And_Door_Thickness;

    Train_Car.setWall(this.Walls_And_Doors.entranceSideAWallA, this.getX() + carConnectorWallsWidth, this.getY(), entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);
    if (!this.Doors_Must_Be_Skipped) {
      Train_Car.setWall(this.Walls_And_Doors.entranceSideADoorA, this.getX() + carConnectorWallsWidth + entranceWallsAndDoorsWidth, this.getY(), entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

      Train_Car.setWall(this.Walls_And_Doors.entranceSideADoorB, this.getX() + carConnectorWallsWidth + (2 * entranceWallsAndDoorsWidth), this.getY(), entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);
    }

    Train_Car.setWall(this.Walls_And_Doors.entranceSideAWallB, this.getX() + carConnectorWallsWidth + (3 * entranceWallsAndDoorsWidth), this.getY(), entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    Train_Car.setWall(this.Walls_And_Doors.entranceSideBWallA, this.getX() + carConnectorWallsWidth, this.getY() + this.height - entranceWallsAndDoorsHeight, entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    if (!this.Doors_Must_Be_Skipped) {
      Train_Car.setWall(this.Walls_And_Doors.entranceSideBDoorA, this.getX() + carConnectorWallsWidth + entranceWallsAndDoorsWidth, this.getY() + this.height - entranceWallsAndDoorsHeight, entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

      Train_Car.setWall(this.Walls_And_Doors.entranceSideBDoorB, this.getX() + carConnectorWallsWidth + (2 * entranceWallsAndDoorsWidth), this.getY() + this.height - entranceWallsAndDoorsHeight, entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);
    }
    Train_Car.setWall(this.Walls_And_Doors.entranceSideBWallB, this.getX() + carConnectorWallsWidth + (3 * entranceWallsAndDoorsWidth), this.getY() + this.height - entranceWallsAndDoorsHeight, entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);
  }

}
