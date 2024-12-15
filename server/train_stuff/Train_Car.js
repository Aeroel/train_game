import { Entity } from "../Entity.js";
import { Game_Loop } from "../Game_Loop.js";
import { Sliding_Door } from "../Sliding_Door.js";
import { Wall } from "../Wall.js";
import { World } from "../World.js";

export { Train_Car };

class Train_Car extends Entity {
  wallThickness = 5;
  currentRail = undefined;
  previousRail = undefined;
  defaultOrientation = "horizontal";
  orientation = this.defaultOrientation;
  previousOrientation = this.orientation;
  possibleEnds = ['firstEnd', 'secondEnd'];
  frontSide = "firstEnd"; // firstEnd or secondEnd
  walls = {};
  possibleMovementDirections = ["backwards", "forwards"];
  currentMovementDirection = null;
  switchOrientationEverySeconds = 2;
  howMuchTimePassedSeconds = 0;
  constructor() {
    super();
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

  }
  is_center_of_car_touching_current_rail() {
    const center = this.getCenterXAndY();
    const answer = (
      (center.x >= this.currentRail.x && center.x <= this.currentRail.x + this.currentRail.width)
      &&
      (center.y >= this.currentRail.y && center.y <= this.currentRail.y + this.currentRail.height)
    );
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
      return;
    }
    const theNeededEnd = connectedRail.findEndConnectedTo(currentRail);

    this.setX(theNeededEnd.x);
    this.setY(theNeededEnd.y);
    this.setCurrentRail(connectedRail);

  }

  stopMovement() {
    this.currentMovementDirection = null;
  }

  setFrontSide(end) {
    if (!this.possibleEnds.includes(end)) {
      throw new Error(`Invalid end ${end}`);

    }
    this.frontSide = end;
  }


  move() {
    if (!this.currentRail) {
      return false;
    }
    if (this.isTryingToMoveBeyondTheRail()) {
      return false;
    }
    const newForces = this.determine_new_forces_for_movement_along_the_rail();
    console.log(this.getBackSide(), this.getFrontSide());
    
    this.forces = newForces;
  }
  determine_new_forces_for_movement_along_the_rail() {
    const force = 30;
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
    if (!this.possibleMovementDirections.includes(dir)) {
      throw new Error(`Invalid mov dir ${dir} `);
    }
    this.currentMovementDirection = dir;
  }

  isTryingToMoveBeyondTheRail() {
    return (!this.is_center_of_car_touching_current_rail());
  }

  updateState() {
    const wantToMove = "backwards";
    this.setMovementDirection(wantToMove);
    this.move();
    this.temporaryBehaviour();
    super.updateState();
    this.reposition_car_and_it_s_contents_according_to_current_car_orientation();
  }
  temporaryBehaviour() {
    this.howMuchTimePassedSeconds += Game_Loop.deltaTime;

    if (this.howMuchTimePassedSeconds >= this.switchOrientationEverySeconds) {
      this.howMuchTimePassedSeconds = 0;
      this.orientation = this.orientation === "horizontal" ? "vertical" : "horizontal";

      const oldWidth = this.getWidth();
      const oldHeight = this.getHeight();
      this.setHeight(oldWidth);
      this.setWidth(oldHeight);
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