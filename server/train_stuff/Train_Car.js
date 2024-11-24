import { Entity } from "../Entity.js"
import { Sliding_Door } from "../Sliding_Door.js";
import { Wall } from "../Wall.js";
import { World } from "../World.js";

export { Train_Car }

class Train_Car extends Entity {
  // the train may temporarily move in the other direction to adjust alignment with station doors, but other than such exceptional cases, it will move in the specified direction, whether forward or backwards.
  whatRailAmICurrentlyStandingOn = undefined;
  lastObservedRailOrientation = undefined;
  // on  horizontal car placement, connectorA is left side and B is right side and entranceA is top and B is bottom
  // WallA is top and B is bottom,
  // on vertical car placement, carConnectors: A is top and B is bottom and entranceA is left and B is right
  // and wallA is left and wallB is right

  walls = {
    carConnectorAWallB: new Wall(),
    carConnectorAWallA: new Wall(),
    carConnectorBWallB: new Wall(),
    carConnectorBWallA: new Wall(),
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
  constructor() {
    super();
    this.setColor("brown");
    this.addTag("Train_Car");
    this.updateState();
    this.addCarWallsToWorld();
    this.repositionWalls();
  }

  question_whatRailAmICurrentlyStandingOn() {
    // Iterate through all world entities to find the rail under the car based on positions
    const result = World.getCurrentEntities().find(entity => {
      // Ensure the entity is a rail
      if (!entity.hasTag("Rail")) {
        return false;
      }

      // Check if the car's position intersects or touches the rail's position (based on coordinates)
      return (
        this.x + this.width > entity.x && // Right side of the car is past the left side of the rail
        this.x < entity.x + entity.width && // Left side of the car is before the right side of the rail
        this.y + this.height > entity.y && // Bottom side of the car is past the top side of the rail
        this.y < entity.y + entity.height // Top side of the car is before the bottom side of the rail
      );
    });

    // Set the rail if found
    if (result) {
      this.whatRailAmICurrentlyStandingOn = result;

    }
  }
  updateState() {
    this.question_whatRailAmICurrentlyStandingOn();
    this.adjustPositioningBasedOnRailOrientation();

  }
  adjustPositioningBasedOnRailOrientation() {
    if (this.whatRailAmICurrentlyStandingOn === undefined) {
      return;
    }

    // based on this.rail.orientation
    // if the orientation last observed  by the car is same as current, no need to do anything
    // if it switched, reposition the car and it's constituent walls and doors.
    if (this.lastObservedRailOrientation === this.whatRailAmICurrentlyStandingOn.orientation) {
      return;
    }
    this.repositionWalls();
    this.lastObservedRailOrientation = this.whatRailAmICurrentlyStandingOn.orientation;
  }
  addCarWallsToWorld() {
    Object.values(this.walls).forEach(wall => {
      World.addEntity(wall);
    })
  }
  repositionWalls() {
    if (this.whatRailAmICurrentlyStandingOn === undefined) {
      return;
    }

    // Adjust walls according to the current dimensions (horizontal or vertical)
    if (this.whatRailAmICurrentlyStandingOn.orientation === "horizontal") {
      const carConnectorWallsHeight = this.height / 3;
      const carConnectorWallsWidth = 5;
      this.walls.carConnectorAWallB.setX(this.getX())
      this.walls.carConnectorAWallB.setY(this.getY() + (carConnectorWallsHeight * 2));
      this.walls.carConnectorAWallB.setHeight(carConnectorWallsHeight);
      this.walls.carConnectorAWallB.setWidth(carConnectorWallsWidth);

      this.walls.carConnectorBWallB.setX((this.getX() + this.getWidth()) - carConnectorWallsWidth)
      this.walls.carConnectorBWallB.setY(this.getY() + (carConnectorWallsHeight * 2));
      this.walls.carConnectorBWallB.setHeight(carConnectorWallsHeight);
      this.walls.carConnectorBWallB.setWidth(carConnectorWallsWidth);

      this.walls.carConnectorBWallA.setX((this.getX() + this.getWidth()) - carConnectorWallsWidth)
      this.walls.carConnectorBWallA.setY(this.getY());
      this.walls.carConnectorBWallA.setHeight(carConnectorWallsHeight);
      this.walls.carConnectorBWallA.setWidth(carConnectorWallsWidth);

      this.walls.carConnectorAWallA.setX(this.getX())
      this.walls.carConnectorAWallA.setY(this.getY());
      this.walls.carConnectorAWallA.setHeight(carConnectorWallsHeight);
      this.walls.carConnectorAWallA.setWidth(carConnectorWallsWidth);

      // top and bot walls and doors

      const entranceWallsAndDoorsWidth = (this.getWidth() - (2 * carConnectorWallsWidth)) / 4;
      const entranceWallsAndDoorsHeight = 5;

      this.walls.entranceSideAWallA.setX(this.getX() + carConnectorWallsWidth)
      this.walls.entranceSideAWallA.setY(this.getY());
      this.walls.entranceSideAWallA.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideAWallA.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideADoorA.setX(this.getX()
        + carConnectorWallsWidth
        + this.walls.entranceSideAWallA.getWidth()
      );
      this.walls.entranceSideADoorA.setY(this.getY());
      this.walls.entranceSideADoorA.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideADoorA.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideADoorB.setX(
        this.getX()
        + carConnectorWallsWidth
        + this.walls.entranceSideAWallA.getWidth()
        + this.walls.entranceSideADoorA.getWidth()
      );
      this.walls.entranceSideADoorB.setY(this.getY());
      this.walls.entranceSideADoorB.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideADoorB.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideAWallB.setX(
        this.getX()
        + carConnectorWallsWidth
        + this.walls.entranceSideAWallA.getWidth()
        + this.walls.entranceSideADoorA.getWidth()
        + this.walls.entranceSideADoorB.getWidth()
      );
      this.walls.entranceSideAWallB.setY(this.getY());
      this.walls.entranceSideAWallB.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideAWallB.setWidth(entranceWallsAndDoorsWidth);

      // bottomSide

      this.walls.entranceSideBWallA.setX(this.getX() + carConnectorWallsWidth)
      this.walls.entranceSideBWallA.setY(this.getY() + this.height - entranceWallsAndDoorsHeight);
      this.walls.entranceSideBWallA.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideBWallA.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideBDoorA.setX(this.getX()
        + carConnectorWallsWidth
        + this.walls.entranceSideBWallA.getWidth()
      );
      this.walls.entranceSideBDoorA.setY(this.getY() + this.height - entranceWallsAndDoorsHeight);
      this.walls.entranceSideBDoorA.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideBDoorA.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideBDoorB.setX(
        this.getX()
        + carConnectorWallsWidth
        + this.walls.entranceSideBWallA.getWidth()
        + this.walls.entranceSideBDoorA.getWidth()
      );
      this.walls.entranceSideBDoorB.setY(this.getY() + this.height - entranceWallsAndDoorsHeight);
      this.walls.entranceSideBDoorB.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideBDoorB.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideBWallB.setX(
        this.getX()
        + carConnectorWallsWidth
        + this.walls.entranceSideAWallA.getWidth()
        + this.walls.entranceSideADoorA.getWidth()
        + this.walls.entranceSideADoorB.getWidth()
      );
      this.walls.entranceSideBWallB.setY(this.getY() + this.height - entranceWallsAndDoorsHeight);
      this.walls.entranceSideBWallB.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideBWallB.setWidth(entranceWallsAndDoorsWidth);
      //bottomSide End

    } else if (this.whatRailAmICurrentlyStandingOn.orientation === "vertical") {
      const carConnectorWallsHeight = 5;
      const carConnectorWallsWidth = this.width / 3;


      this.walls.carConnectorAWallA.setX(this.getX())
      this.walls.carConnectorAWallA.setY(this.getY());
      this.walls.carConnectorAWallA.setHeight(carConnectorWallsHeight);
      this.walls.carConnectorAWallA.setWidth(carConnectorWallsWidth);

      this.walls.carConnectorAWallB.setX(this.getX() + (carConnectorWallsWidth * 2))
      this.walls.carConnectorAWallB.setY(this.getY());
      this.walls.carConnectorAWallB.setHeight(carConnectorWallsHeight);
      this.walls.carConnectorAWallB.setWidth(carConnectorWallsWidth);

      this.walls.carConnectorBWallA.setX(this.getX())
      this.walls.carConnectorBWallA.setY(this.getY() + this.getHeight() - carConnectorWallsHeight);
      this.walls.carConnectorBWallA.setHeight(carConnectorWallsHeight);
      this.walls.carConnectorBWallA.setWidth(carConnectorWallsWidth);


      this.walls.carConnectorBWallB.setX(this.getX() + (carConnectorWallsWidth * 2))
      this.walls.carConnectorBWallB.setY(this.getY() + this.getHeight() - carConnectorWallsHeight);
      this.walls.carConnectorBWallB.setHeight(carConnectorWallsHeight);
      this.walls.carConnectorBWallB.setWidth(carConnectorWallsWidth);

      // top and bot walls and doors

      const entranceWallsAndDoorsWidth = 5;
      const entranceWallsAndDoorsHeight = (-(carConnectorWallsWidth * 2) + this.getHeight()) / 4;

      this.walls.entranceSideAWallA.setX(this.getX())
      this.walls.entranceSideAWallA.setY(this.getY() + carConnectorWallsHeight);
      this.walls.entranceSideAWallA.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideAWallA.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideADoorA.setX(this.getX());
      this.walls.entranceSideADoorA.setY(this.getY()
        + carConnectorWallsHeight
        + this.walls.entranceSideAWallA.getHeight()
      );
      this.walls.entranceSideADoorA.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideADoorA.setWidth(entranceWallsAndDoorsWidth);


      this.walls.entranceSideADoorB.setX(this.getX()
      );
      this.walls.entranceSideADoorB.setY(this.getY()
        + carConnectorWallsHeight
        + this.walls.entranceSideAWallA.getHeight()
        + this.walls.entranceSideADoorA.getHeight()
      );
      this.walls.entranceSideADoorB.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideADoorB.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideAWallB.setX(this.getX());
      this.walls.entranceSideAWallB.setY(
        this.getY()
        + carConnectorWallsHeight
        + this.walls.entranceSideAWallA.getHeight()
        + this.walls.entranceSideADoorA.getHeight()
        + this.walls.entranceSideADoorB.getHeight()
      );
      this.walls.entranceSideAWallB.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideAWallB.setWidth(entranceWallsAndDoorsWidth);

      // bottomSide

      this.walls.entranceSideBWallA.setX(this.getX() + this.getWidth() - entranceWallsAndDoorsWidth)
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
      + this.walls.entranceSideAWallA.getHeight()
    );
      this.walls.entranceSideBDoorA.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideBDoorA.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideBDoorB.setX(this.getX() + this.getWidth() - entranceWallsAndDoorsWidth);
      this.walls.entranceSideBDoorB.setY(
        this.getY()
        + carConnectorWallsHeight
        + this.walls.entranceSideAWallA.getHeight()
        + this.walls.entranceSideADoorA.getHeight()
      );
      this.walls.entranceSideBDoorB.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideBDoorB.setWidth(entranceWallsAndDoorsWidth);

      this.walls.entranceSideBWallB.setX(this.getX() + this.getWidth() - entranceWallsAndDoorsWidth);
      this.walls.entranceSideBWallB.setY(
        this.getY()
        + carConnectorWallsHeight
        + this.walls.entranceSideAWallA.getHeight()
        + this.walls.entranceSideADoorA.getHeight()
        + this.walls.entranceSideADoorB.getHeight()
      );
      this.walls.entranceSideBWallB.setHeight(entranceWallsAndDoorsHeight);
      this.walls.entranceSideBWallB.setWidth(entranceWallsAndDoorsWidth);
      //bottomSide End
    }
  }
}