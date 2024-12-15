import { Entity } from "../Entity.js";
import { Game_Loop } from "../Game_Loop.js";
import { Sliding_Door } from "../Sliding_Door.js";
import { Wall } from "../Wall.js";
import { World } from "../World.js";

export { Train_Car };

class Train_Car extends Entity {
  carWallThickness = 5;
  defaultOrientation = "horizontal";
  orientation = this.defaultOrientation;
  previousOrientation = this.orientation;
  // on  horizontal car placement, connectorA is left side and B is right side and entranceA is top and B is bottom
  // WallA is top and B is bottom,
  // on vertical car placement, carConnectors: A is top and B is bottom and entranceA is left and B is right
  // and wallA is left and wallB is right

  walls = {
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
  possibleMovementDecisions = ["backwards", "forwards"];
  switchOrientationEverySeconds = 2;
  howMuchTimePassedSeconds = 0;
  constructor() {
    super();
    this.setColor("brown");
    this.addTag("Train_Car");
    this.addCarWallsToWorld();
  }


  updateState() {
    const wantToMove = "forwards";

    this.temporaryBehaviour();
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
    const carConnectorWallsHeight = this.carWallThickness;
    const carConnectorWallsWidth = this.width / 3;


    Train_Car.setWall(this.walls.carConnectorAWallA, this.getX(), this.getY(), carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.walls.carConnectorAWallB, this.getX() + (2 * carConnectorWallsWidth), this.getY(), carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.walls.carConnectorBWallA, this.getX(), this.getY() + this.getHeight() - carConnectorWallsHeight, carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.walls.carConnectorBWallB, this.getX() + (2 * carConnectorWallsWidth), this.getY() + this.getHeight() - carConnectorWallsHeight, carConnectorWallsWidth, carConnectorWallsHeight);

    const entranceWallsAndDoorsWidth = this.carWallThickness;
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
    const carConnectorWallsWidth = this.carWallThickness;


    Train_Car.setWall(this.walls.carConnectorAWallA, this.getX(), this.getY(), carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.walls.carConnectorAWallB, this.getX(), this.getY() + (carConnectorWallsHeight * 2), carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.walls.carConnectorBWallA, (this.getX() + this.getWidth()) - carConnectorWallsWidth, this.getY(), carConnectorWallsWidth, carConnectorWallsHeight);

    Train_Car.setWall(this.walls.carConnectorBWallB, (this.getX() + this.getWidth()) - carConnectorWallsWidth, this.getY() + (carConnectorWallsHeight * 2), carConnectorWallsWidth, carConnectorWallsHeight);

    const entranceWallsAndDoorsWidth = (this.getWidth() - (2 * carConnectorWallsWidth)) / 4;
    const entranceWallsAndDoorsHeight = this.carWallThickness;

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