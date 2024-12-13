import { Entity } from "../Entity.js";
import { Game_Loop } from "../Game_Loop.js";
import { Sliding_Door } from "../Sliding_Door.js";
import { Wall } from "../Wall.js";
import { World } from "../World.js";

export { Train_Car };

class Train_Car extends Entity {
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
    this.reposition_car_and_it_s_contents_according_to_current_car_orientation()
  }
  reposition_car_and_it_s_contents_according_to_current_car_orientation() {
    this.reposition_car_walls_according_to_orientation();
  }
  // This switches positions of the car walls based on the car's current x, y, w, h and orientation.
  // Probably I can structure this better to abstract away the code for calculating the actual numbers? 
  // Maybe the four lines per wall into a separate function and call it once per wall instead?
  reposition_car_walls_according_to_orientation() {
    const carWallThickness = 5;
    // Adjust walls according to the current dimensions (horizontal or vertical)
    if (this.orientation === "horizontal") {
      const carConnectorWallsHeight = this.height / 3;
      const carConnectorWallsWidth = carWallThickness;

      this.walls.carConnectorAWallA.setX(this.getX());
      this.walls.carConnectorAWallA.setY(this.getY());
      this.walls.carConnectorAWallA.setHeight(carConnectorWallsHeight);
      this.walls.carConnectorAWallA.setWidth(carConnectorWallsWidth);

      this.walls.carConnectorAWallB.setX(this.getX());
      this.walls.carConnectorAWallB.setY(this.getY() + (carConnectorWallsHeight * 2));
      this.walls.carConnectorAWallB.setHeight(carConnectorWallsHeight);
      this.walls.carConnectorAWallB.setWidth(carConnectorWallsWidth);

      this.walls.carConnectorBWallA.setX(
        (this.getX() + this.getWidth()) - carConnectorWallsWidth
      );
      this.walls.carConnectorBWallA.setY(this.getY());
      this.walls.carConnectorBWallA.setHeight(carConnectorWallsHeight);
      this.walls.carConnectorBWallA.setWidth(carConnectorWallsWidth);

      this.walls.carConnectorBWallB.setX((this.getX() + this.getWidth()) - carConnectorWallsWidth);
      this.walls.carConnectorBWallB.setY(this.getY() + (carConnectorWallsHeight * 2));
      this.walls.carConnectorBWallB.setHeight(carConnectorWallsHeight);
      this.walls.carConnectorBWallB.setWidth(carConnectorWallsWidth);

      // top and bot walls and doors

      const entranceWallsAndDoorsWidth = (this.getWidth() - (2 * carConnectorWallsWidth)) / 4;
      const entranceWallsAndDoorsHeight = carWallThickness;

      this.walls.entranceSideAWallA.setX(this.getX() + carConnectorWallsWidth);
      this.walls.entranceSideAWallA.setY(this.getY());
      this.walls.entranceSideAWallA.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideAWallA.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideADoorA.setX(this.getX()
        + carConnectorWallsWidth
        + entranceWallsAndDoorsWidth
      );
      this.walls.entranceSideADoorA.setY(this.getY());
      this.walls.entranceSideADoorA.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideADoorA.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideADoorB.setX(
        this.getX()
        + carConnectorWallsWidth
        + entranceWallsAndDoorsWidth
        + entranceWallsAndDoorsWidth
      );
      this.walls.entranceSideADoorB.setY(this.getY());
      this.walls.entranceSideADoorB.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideADoorB.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideAWallB.setX(
        this.getX()
        + carConnectorWallsWidth
        + entranceWallsAndDoorsWidth
        + entranceWallsAndDoorsWidth
        + entranceWallsAndDoorsWidth
      );
      this.walls.entranceSideAWallB.setY(this.getY());
      this.walls.entranceSideAWallB.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideAWallB.setWidth(entranceWallsAndDoorsWidth);

      // bottomSide

      this.walls.entranceSideBWallA.setX(this.getX() + carConnectorWallsWidth);
      this.walls.entranceSideBWallA.setY(this.getY() + this.height - entranceWallsAndDoorsHeight);
      this.walls.entranceSideBWallA.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideBWallA.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideBDoorA.setX(this.getX()
        + carConnectorWallsWidth
        + entranceWallsAndDoorsWidth
      );
      this.walls.entranceSideBDoorA.setY(this.getY() + this.height - entranceWallsAndDoorsHeight);
      this.walls.entranceSideBDoorA.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideBDoorA.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideBDoorB.setX(
        this.getX()
        + carConnectorWallsWidth
        + entranceWallsAndDoorsWidth
        + entranceWallsAndDoorsWidth
      );
      this.walls.entranceSideBDoorB.setY(this.getY() + this.height - entranceWallsAndDoorsHeight);
      this.walls.entranceSideBDoorB.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideBDoorB.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideBWallB.setX(
        this.getX()
        + carConnectorWallsWidth
        + entranceWallsAndDoorsWidth
        + entranceWallsAndDoorsWidth
        + entranceWallsAndDoorsWidth
      );
      this.walls.entranceSideBWallB.setY(this.getY() + this.height - entranceWallsAndDoorsHeight);
      this.walls.entranceSideBWallB.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideBWallB.setWidth(entranceWallsAndDoorsWidth);
      //bottomSide End

    } else if (this.orientation === "vertical") {
      const carConnectorWallsHeight = carWallThickness;
      const carConnectorWallsWidth = this.width / 3;


      this.walls.carConnectorAWallA.setX(this.getX());
      this.walls.carConnectorAWallA.setY(this.getY());
      this.walls.carConnectorAWallA.setHeight(carConnectorWallsHeight);
      this.walls.carConnectorAWallA.setWidth(carConnectorWallsWidth);

      this.walls.carConnectorAWallB.setX(this.getX() + (carConnectorWallsWidth * 2));
      this.walls.carConnectorAWallB.setY(this.getY());
      this.walls.carConnectorAWallB.setHeight(carConnectorWallsHeight);
      this.walls.carConnectorAWallB.setWidth(carConnectorWallsWidth);

      this.walls.carConnectorBWallA.setX(this.getX());
      this.walls.carConnectorBWallA.setY(this.getY() + this.getHeight() - carConnectorWallsHeight);
      this.walls.carConnectorBWallA.setHeight(carConnectorWallsHeight);
      this.walls.carConnectorBWallA.setWidth(carConnectorWallsWidth);


      this.walls.carConnectorBWallB.setX(this.getX() + (carConnectorWallsWidth * 2));
      this.walls.carConnectorBWallB.setY(this.getY() + this.getHeight() - carConnectorWallsHeight);
      this.walls.carConnectorBWallB.setHeight(carConnectorWallsHeight);
      this.walls.carConnectorBWallB.setWidth(carConnectorWallsWidth);

      // top and bot walls and doors

      const entranceWallsAndDoorsWidth = carWallThickness;
      const entranceWallsAndDoorsHeight = (this.getHeight() - carConnectorWallsHeight - carConnectorWallsHeight) / 4;

      this.walls.entranceSideAWallA.setX(this.getX());
      this.walls.entranceSideAWallA.setY(this.getY() + carConnectorWallsHeight);
      this.walls.entranceSideAWallA.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideAWallA.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideADoorA.setX(this.getX());
      this.walls.entranceSideADoorA.setY(this.getY()
        + carConnectorWallsHeight
        + entranceWallsAndDoorsHeight
      );
      this.walls.entranceSideADoorA.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideADoorA.setWidth(entranceWallsAndDoorsWidth);


      this.walls.entranceSideADoorB.setX(this.getX()
      );
      this.walls.entranceSideADoorB.setY(this.getY()
        + carConnectorWallsHeight
        + entranceWallsAndDoorsHeight
        + entranceWallsAndDoorsHeight
      );
      this.walls.entranceSideADoorB.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideADoorB.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideAWallB.setX(this.getX());
      this.walls.entranceSideAWallB.setY(
        this.getY()
        + carConnectorWallsHeight
        + entranceWallsAndDoorsHeight
        + entranceWallsAndDoorsHeight
        + entranceWallsAndDoorsHeight
      );
      this.walls.entranceSideAWallB.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideAWallB.setWidth(entranceWallsAndDoorsWidth);

      // bottomSide

      this.walls.entranceSideBWallA.setX(this.getX() + this.getWidth() - entranceWallsAndDoorsWidth);
      this.walls.entranceSideBWallA.setY(
        this.getY()
        + carConnectorWallsHeight
      );
      this.walls.entranceSideBWallA.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideBWallA.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideBDoorA.setX(this.getX() + this.getWidth() - entranceWallsAndDoorsWidth);
      this.walls.entranceSideBDoorA.setY(
        this.getY()
        + carConnectorWallsHeight
        + entranceWallsAndDoorsHeight
      );
      this.walls.entranceSideBDoorA.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideBDoorA.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideBDoorB.setX(this.getX() + this.getWidth() - entranceWallsAndDoorsWidth);
      this.walls.entranceSideBDoorB.setY(
        this.getY()
        + carConnectorWallsHeight
        + entranceWallsAndDoorsHeight
        + entranceWallsAndDoorsHeight
      );
      this.walls.entranceSideBDoorB.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideBDoorB.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideBWallB.setX(this.getX() + this.getWidth() - entranceWallsAndDoorsWidth);
      this.walls.entranceSideBWallB.setY(
        this.getY()
        + carConnectorWallsHeight
        + entranceWallsAndDoorsHeight
        + entranceWallsAndDoorsHeight
        + entranceWallsAndDoorsHeight
      );
      this.walls.entranceSideBWallB.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideBWallB.setWidth(entranceWallsAndDoorsWidth);
      //bottomSide End
    }
  }
}