import { log } from "console";
import { Entity } from "../Entity.js";
import { Game_Loop } from "../Game_Loop.js";
import { Sliding_Door } from "../Sliding_Door.js";
import { Wall } from "../Wall.js";
import { World } from "../World.js";
import Inject_Event_Handler_Functionality from "../Inject_Event_Handler_Functionality.js";

export { Train_Car };

class Train_Car extends Entity {
  wallThickness = 5;
  currentRail = undefined;
  previousRail = undefined;
  defaultOrientation = "horizontal";
  orientation = this.defaultOrientation;
  previousOrientation = this.orientation;
  twoPossibleEnds = ['firstEnd', 'secondEnd'];
  frontSide = "firstEnd"; // firstEnd or secondEnd
  walls = {};
  force = 120;
  twoPossibleMovementDirections = ["backwards", "forwards"];
  currentMovementDirection = "backwards";
  lastMovementDirectionBeforeNull = null;
  events = [];
  constructor() {
    super();
    Inject_Event_Handler_Functionality.injectEventHandlerFunctionality(this);
    this.setColor("brown");
    this.addTag("Train_Car");
    this.createCarWalls();
    this.addCarWallsToWorld();
    this.visualSideEntities();
  }

  visualSideEntities() {
    const sideEntitySize = 25;
    this.backSideEntity = new Entity();
    this.frontSideEntity = new Entity();
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

    // Calculate size of the virtual box (5% of car's area)
    const boxArea = carArea * 0.05;

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

  switchRailsIfNeeded() {
    if (!this.is_it_time_to_potentially_switch_rails()) {
      return;
    }
    const currentRail = this.currentRail;
    const closestEnd = currentRail.getEndClosestToCenterOf(this);

    const connectedRail = closestEnd.rail;
    if (!connectedRail) {
      console.log("44");
      placeEntitySoIt_sCenterBoxTouchesRail(this, currentRail);
      function placeEntitySoIt_sCenterBoxTouchesRail(entity, rail) {
        // Calculate center of the entity
        const centerX = entity.x + (entity.width / 2);
        const centerY = entity.y + (entity.height / 2);
    
        // Calculate area of the entity
        const entityArea = entity.width * entity.height;
    
        // Calculate size of the virtual box (5% of entity's area)
        const boxArea = entityArea * 0.05;
    
        // Assuming the virtual box is square for simplicity
        const boxSize = Math.sqrt(boxArea);
    
        // Define virtual box dimensions
        const boxWidth = boxSize;
        const boxHeight = boxSize;
    
        // Calculate virtual box coordinates
        const boxX = centerX - (boxWidth / 2);
        const boxY = centerY - (boxHeight / 2);
    
        // Calculate new position for the entity so that its center box touches the rail
        let newX = entity.x;
        let newY = entity.y;
    
        // Check if the virtual box is already touching or overlapping with the rail
        if (
            !(boxX <= rail.x + rail.width &&
              boxX + boxWidth > rail.x &&
              boxY <= rail.y + rail.height &&
              boxY + boxHeight > rail.y)
        ) {
            // If not touching, adjust position to make it touch
            // Move to align with left edge of rail if it's to the right
            if (boxX + boxWidth <= rail.x) {
                newX = rail.x - (boxWidth / 2); // Center the box at the left edge of the rail
            } 
            // Move to align with right edge of rail if it's to the left
            else if (boxX >= rail.x + rail.width) {
                newX = rail.x + rail.width - (boxWidth / 2); // Center the box at the right edge of the rail
            } 
            // Move vertically to align with top or bottom edge of rail
            else if (boxY + boxHeight <= rail.y) {
                newY = rail.y - (entity.height / 2); // Position above the rail
            } 
            else if (boxY >= rail.y + rail.height) {
                newY = rail.y + rail.height - (entity.height / 2); // Position below the rail
            }
        }
    
        // Update entity's position
        entity.x = newX;
        entity.y = newY;
    }
      this.stopMovement();
      return;
    }

    const theNeededEnd = connectedRail.findEndConnectedTo(currentRail);
    function makeEntityCenterXYTouchPointXY(entity, point) {
      // Calculate current center of the entity
      const currentCenterX = entity.x + (entity.width / 2);
      const currentCenterY = entity.y + (entity.height / 2);

      // Calculate the difference to move the center to the target point
      const deltaX = point.x - currentCenterX;
      const deltaY = point.y - currentCenterY;

      // Update entity's position to make its center touch the point
      const newX = entity.x + deltaX;
      const newY = entity.y + deltaY;
      entity.x = newX;
      entity.y = newY;
      // Return updated position of the entity
      return { x: newX, y: newY };
    }


    const newCarPos = makeEntityCenterXYTouchPointXY(this, theNeededEnd);
    this.setCurrentRail(connectedRail);


    // recalc which side is which
    const farthestRailEnd = this.currentRail.getEnd(this.oppositeOf(theNeededEnd.name, this.currentRail.twoPossibleEnds));

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
  eventHappened(name) {
    if (this.events.includes(name)) {
      this.events = this.events.filter(event => event !== name);
      return true;
    }
    return false;
  }
  stopMovement() {
    this.lastMovementDirectionBeforeNull =this.currentMovementDirection;
    this.currentMovementDirection = null;

    for (var force in this.forces) {
      if (!Object.prototype.hasOwnProperty.call(this.forces, force)) {
        continue;
      }
      this.forces[force] = 0;
    }
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


  move() {
    if (!this.currentRail) {
      return false;
    }
    if (this.isTryingToMoveBeyondTheRail()) {
      this.switchRailsIfNeeded();
    }
    const newForces = this.determine_new_forces_for_movement_along_the_rail();

    this.forces = { ...newForces };
  }
  determine_new_forces_for_movement_along_the_rail() {
    const force = this.force;
    const newForces = { ...this.forces };
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
        newForces.up = force;
      }
      if (upOrDown > 0) {
        newForces.down = force;
      }
    } else if (this.currentRail.orientation === 'horizontal') {
      let leftOrRight;
      if (this.currentMovementDirection === 'backwards') {
        leftOrRight = backSide.x - this.getCenterX();
      } else if (this.currentMovementDirection === 'forwards') {
        leftOrRight = frontSide.x - this.getCenterX();
      }
      if (leftOrRight < 0) {
        newForces.left = force;
      }
      if (leftOrRight > 0) {
        newForces.right = force;
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
    //const wantToMove = "backwards";
    this.move();
    this.behaviour();
    super.updateState();
    this.reposition_car_and_it_s_contents_according_to_current_car_orientation();
  }
  behaviour() {
    if(this.currentMovementDirection === null) {
      this.setMovementDirection(this.oppositeOf(this.lastMovementDirectionBeforeNull, this.twoPossibleMovementDirections));
    }
  }
  // on  horizontal car placement, connectorA is left side and B is right side and entranceA is top and B is bottom
  // WallA is top and B is bottom,
  // on vertical car placement, carConnectors: A is top and B is bottom and entranceA is left and B is right
  // and wallA is left and wallB is right
  createCarWalls() {
    this.walls = {
      carConnectorAWallA: new Wall(),
      carConnectorAWallB: new Wall(),
      carConnectorBWallA: new Wall(),
      carConnectorBWallB: new Wall(),

      entranceSideAWallA: new Wall(),
      entranceSideADoorA: new Sliding_Door(),
      entranceSideADoorB: new Sliding_Door(),
      entranceSideAWallB: new Wall(),

      entranceSideBWallA: new Wall(),
      entranceSideBDoorA: new Sliding_Door(),
      entranceSideBDoorB: new Sliding_Door(),
      entranceSideBWallB: new Wall(),
    };
  }
  addCarWallsToWorld() {
    Object.values(this.walls).forEach(wall => {
      World.addEntity(wall);
    });
  }
  setX(x) {
    super.setX(x);
    this.reposition_car_and_it_s_contents_according_to_current_car_orientation();
  }
  setY(y) {
    super.setY(y);
    this.reposition_car_and_it_s_contents_according_to_current_car_orientation();
  }
  setWidth(width) {
    super.setWidth(width);
    this.reposition_car_and_it_s_contents_according_to_current_car_orientation();
  }
  setHeight(height) {
    super.setHeight(height);
    this.reposition_car_and_it_s_contents_according_to_current_car_orientation();
  }
  reposition_car_and_it_s_contents_according_to_current_car_orientation() {
    this.frontSideEntity.x = this.getFrontSide().x;
    this.frontSideEntity.y = this.getFrontSide().y;
    this.backSideEntity.x = this.getBackSide().x;
    this.backSideEntity.y = this.getBackSide().y;
    this.reposition_car_walls_according_to_orientation();
  }



  // This switches positions of the car walls based on the car's current x, y, w, h and orientation.
  // Probably I can structure this better to abstract away the code for calculating the actual numbers? 
  // Maybe the four lines per wall into a separate function and call it once per wall instead?
  reposition_car_walls_according_to_orientation() {
    // Adjust walls according to the current dimensions (horizontal or vertical)
    if (this.orientation === "horizontal") {
      this.setHorizontalWalls();
    } else if (this.orientation === "vertical") {
      this.setVerticalWalls();
    }
  }
  setVerticalWalls() {
    const carConnectorWallsHeight = this.wallThickness;
    const carConnectorWallsWidth = this.width / 3;


    Train_Car.setWall(this.walls.carConnectorAWallA, this.getX(), this.getY(), carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.walls.carConnectorAWallB, this.getX() + (2 * carConnectorWallsWidth), this.getY(), carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.walls.carConnectorBWallA, this.getX(), this.getY() + this.getHeight() - carConnectorWallsHeight, carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.walls.carConnectorBWallB, this.getX() + (2 * carConnectorWallsWidth), this.getY() + this.getHeight() - carConnectorWallsHeight, carConnectorWallsWidth, carConnectorWallsHeight);

    const entranceWallsAndDoorsWidth = this.wallThickness;
    const entranceWallsAndDoorsHeight = (this.getHeight() - (2 * carConnectorWallsHeight)) / 4;


    Train_Car.setWall(this.walls.entranceSideAWallA, this.getX(), this.getY() + carConnectorWallsHeight, entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    Train_Car.setWall(this.walls.entranceSideADoorA, this.getX(), this.getY() + carConnectorWallsHeight + entranceWallsAndDoorsHeight, entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    Train_Car.setWall(this.walls.entranceSideADoorB, this.getX(), this.getY() + carConnectorWallsHeight + (2 * entranceWallsAndDoorsHeight), entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    Train_Car.setWall(this.walls.entranceSideAWallB, this.getX(), this.getY() + carConnectorWallsHeight + (3 * entranceWallsAndDoorsHeight), entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);


    Train_Car.setWall(this.walls.entranceSideBWallA, this.getX() + this.getWidth() - entranceWallsAndDoorsWidth, this.getY() + carConnectorWallsHeight, entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    Train_Car.setWall(this.walls.entranceSideBDoorA, this.getX() + this.getWidth() - entranceWallsAndDoorsWidth, this.getY() + carConnectorWallsHeight + entranceWallsAndDoorsHeight, entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    Train_Car.setWall(this.walls.entranceSideBDoorB, this.getX() + this.getWidth() - entranceWallsAndDoorsWidth, this.getY() + carConnectorWallsHeight + (2 * entranceWallsAndDoorsHeight), entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    Train_Car.setWall(this.walls.entranceSideBWallB, this.getX() + this.getWidth() - entranceWallsAndDoorsWidth, this.getY() + carConnectorWallsHeight + (3 * entranceWallsAndDoorsHeight), entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);
  }
  setHorizontalWalls() {
    const carConnectorWallsHeight = this.height / 3;
    const carConnectorWallsWidth = this.wallThickness;


    Train_Car.setWall(this.walls.carConnectorAWallA, this.getX(), this.getY(), carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.walls.carConnectorAWallB, this.getX(), this.getY() + (carConnectorWallsHeight * 2), carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.walls.carConnectorBWallA, (this.getX() + this.getWidth()) - carConnectorWallsWidth, this.getY(), carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.walls.carConnectorBWallB, (this.getX() + this.getWidth()) - carConnectorWallsWidth, this.getY() + (carConnectorWallsHeight * 2), carConnectorWallsWidth, carConnectorWallsHeight);

    const entranceWallsAndDoorsWidth = (this.getWidth() - (2 * carConnectorWallsWidth)) / 4;
    const entranceWallsAndDoorsHeight = this.wallThickness;

    Train_Car.setWall(this.walls.entranceSideAWallA, this.getX() + carConnectorWallsWidth, this.getY(), entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    Train_Car.setWall(this.walls.entranceSideADoorA, this.getX() + carConnectorWallsWidth + entranceWallsAndDoorsWidth, this.getY(), entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    Train_Car.setWall(this.walls.entranceSideADoorB, this.getX() + carConnectorWallsWidth + (2 * entranceWallsAndDoorsWidth), this.getY(), entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    Train_Car.setWall(this.walls.entranceSideAWallB, this.getX() + carConnectorWallsWidth + (3 * entranceWallsAndDoorsWidth), this.getY(), entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    Train_Car.setWall(this.walls.entranceSideBWallA, this.getX() + carConnectorWallsWidth, this.getY() + this.height - entranceWallsAndDoorsHeight, entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    Train_Car.setWall(this.walls.entranceSideBDoorA, this.getX() + carConnectorWallsWidth + entranceWallsAndDoorsWidth, this.getY() + this.height - entranceWallsAndDoorsHeight, entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    Train_Car.setWall(this.walls.entranceSideBDoorB, this.getX() + carConnectorWallsWidth + (2 * entranceWallsAndDoorsWidth), this.getY() + this.height - entranceWallsAndDoorsHeight, entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);

    Train_Car.setWall(this.walls.entranceSideBWallB, this.getX() + carConnectorWallsWidth + (3 * entranceWallsAndDoorsWidth), this.getY() + this.height - entranceWallsAndDoorsHeight, entranceWallsAndDoorsWidth, entranceWallsAndDoorsHeight);
  }
  static setWall(wall, x, y, w, h) {
    wall.setX(x);
    wall.setY(y);
    wall.setWidth(w);
    wall.setHeight(h);
  }
}