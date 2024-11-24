import { Entity } from "../Entity.js"
import { Sliding_Door } from "../Sliding_Door.js";
import { Wall } from "../Wall.js";
import { World } from "../World.js";

export { Train_Car }

class Train_Car extends Entity {
  // the train may temporarily move in the other direction to adjust alignment with station doors, but other than such exceptional cases, it will move in the specified direction, whether forward or backwards.
  whatRailAmICurrentlyStandingOn = undefined;
  lastObservedRailOrientation = undefined;
  // on  horizontal car placement, connectorA is left side and B is right side
  // and entranceSideA is top and B is bottom.
  // on vertical car placement, carConnectors: A is top and B is bottom 
  // and entranceSides: A is right and B becomes left.
  walls = {
    carConnectorAWallB: new Wall(),
    carConnectorAWallA: new Wall(),
    carConnectorBWallB: new Wall(),
    carConnectorBWallA: new Wall(),
    entraceSideAWallA: new Wall(),
    entranceSideADoorA: new Sliding_Door(),
    entraceSideADoorB: new Sliding_Door(),
    entraceSideAWallB: new Wall(),
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
      const sideWallsHeight = this.height / 3;
      const sideWallsWidth = 5;
      this.walls.carConnectorAWallB.setX(this.getX())
      this.walls.carConnectorAWallB.setY(this.getY() + (sideWallsHeight * 2));
      this.walls.carConnectorAWallB.setHeight(sideWallsHeight);
      this.walls.carConnectorAWallB.setWidth(sideWallsWidth);

      this.walls.carConnectorBWallB.setX((this.getX() + this.getWidth()) - sideWallsWidth)
      this.walls.carConnectorBWallB.setY(this.getY() + (sideWallsHeight * 2));
      this.walls.carConnectorBWallB.setHeight(sideWallsHeight);
      this.walls.carConnectorBWallB.setWidth(sideWallsWidth);

      this.walls.carConnectorBWallA.setX((this.getX() + this.getWidth()) - sideWallsWidth)
      this.walls.carConnectorBWallA.setY(this.getY());
      this.walls.carConnectorBWallA.setHeight(sideWallsHeight);
      this.walls.carConnectorBWallA.setWidth(sideWallsWidth);

      this.walls.carConnectorAWallA.setX(this.getX())
      this.walls.carConnectorAWallA.setY(this.getY());
      this.walls.carConnectorAWallA.setHeight(sideWallsHeight);
      this.walls.carConnectorAWallA.setWidth(sideWallsWidth);

      // top and bot walls and doors

      const topAndBottomWallsWidth = (this.getWidth() - (2 * sideWallsWidth)) / 4;
      const topAndBottomWallsHeight = 5;

      this.walls.entraceSideAWallA.setX(this.getX() + sideWallsWidth)
      this.walls.entraceSideAWallA.setY(this.getY());
      this.walls.entraceSideAWallA.setHeight(topAndBottomWallsHeight);
      this.walls.entraceSideAWallA.setWidth(topAndBottomWallsWidth);

      this.walls.entranceSideADoorA.setX(this.getX()
        + sideWallsWidth
        + this.walls.entraceSideAWallA.getWidth()
      );
      this.walls.entranceSideADoorA.setY(this.getY());
      this.walls.entranceSideADoorA.setHeight(topAndBottomWallsHeight);
      this.walls.entranceSideADoorA.setWidth(topAndBottomWallsWidth);

      this.walls.entraceSideADoorB.setX(
        this.getX()
        + sideWallsWidth
        + this.walls.entraceSideAWallA.getWidth()
        + this.walls.entranceSideADoorA.getWidth()
      );
      this.walls.entraceSideADoorB.setY(this.getY());
      this.walls.entraceSideADoorB.setHeight(topAndBottomWallsHeight);
      this.walls.entraceSideADoorB.setWidth(topAndBottomWallsWidth);

      this.walls.entraceSideAWallB.setX(
        this.getX()
        + sideWallsWidth
        + this.walls.entraceSideAWallA.getWidth()
        + this.walls.entranceSideADoorA.getWidth()
        + this.walls.entraceSideADoorB.getWidth()
      );
      this.walls.entraceSideAWallB.setY(this.getY());
      this.walls.entraceSideAWallB.setHeight(topAndBottomWallsHeight);
      this.walls.entraceSideAWallB.setWidth(topAndBottomWallsWidth);

      // bottomSide

      this.walls.entranceSideBWallA.setX(this.getX() + sideWallsWidth)
      this.walls.entranceSideBWallA.setY(this.getY() + this.height - topAndBottomWallsHeight);
      this.walls.entranceSideBWallA.setHeight(topAndBottomWallsHeight);
      this.walls.entranceSideBWallA.setWidth(topAndBottomWallsWidth);

      this.walls.entranceSideBDoorA.setX(this.getX()
        + sideWallsWidth
        + this.walls.entranceSideBWallA.getWidth()
      );
      this.walls.entranceSideBDoorA.setY(this.getY() + this.height - topAndBottomWallsHeight);
      this.walls.entranceSideBDoorA.setHeight(topAndBottomWallsHeight);
      this.walls.entranceSideBDoorA.setWidth(topAndBottomWallsWidth);

      this.walls.entranceSideBDoorB.setX(
        this.getX()
        + sideWallsWidth
        + this.walls.entranceSideBWallA.getWidth()
        + this.walls.entranceSideBDoorA.getWidth()
      );
      this.walls.entranceSideBDoorB.setY(this.getY() + this.height - topAndBottomWallsHeight);
      this.walls.entranceSideBDoorB.setHeight(topAndBottomWallsHeight);
      this.walls.entranceSideBDoorB.setWidth(topAndBottomWallsWidth);

      this.walls.entranceSideBWallB.setX(
        this.getX()
        + sideWallsWidth
        + this.walls.entraceSideAWallA.getWidth()
        + this.walls.entranceSideADoorA.getWidth()
        + this.walls.entraceSideADoorB.getWidth()
      );
      this.walls.entranceSideBWallB.setY(this.getY() + this.height - topAndBottomWallsHeight);
      this.walls.entranceSideBWallB.setHeight(topAndBottomWallsHeight);
      this.walls.entranceSideBWallB.setWidth(topAndBottomWallsWidth);
      //bottomSide End

    } else if (this.whatRailAmICurrentlyStandingOn.orientation === "vertical") {
      const sideWallsHeight = 5;
      const sideWallsWidth = this.width / 3;

      
      this.walls.carConnectorAWallA.setX(this.getX())
      this.walls.carConnectorAWallA.setY(this.getY());
      this.walls.carConnectorAWallA.setHeight(sideWallsHeight);
      this.walls.carConnectorAWallA.setWidth(sideWallsWidth);

      this.walls.carConnectorAWallB.setX(this.getX() + (sideWallsWidth * 2))
      this.walls.carConnectorAWallB.setY(this.getY());
      this.walls.carConnectorAWallB.setHeight(sideWallsHeight);
      this.walls.carConnectorAWallB.setWidth(sideWallsWidth);

      this.walls.carConnectorBWallA.setX((this.getX() + this.getWidth()) - sideWallsWidth)
      this.walls.carConnectorBWallA.setY(this.getY());
      this.walls.carConnectorBWallA.setHeight(sideWallsHeight);
      this.walls.carConnectorBWallA.setWidth(sideWallsWidth);


      this.walls.carConnectorBWallB.setX((this.getX() + this.getWidth()) - sideWallsWidth)
      this.walls.carConnectorBWallB.setY(this.getY() + (sideWallsHeight * 2));
      this.walls.carConnectorBWallB.setHeight(sideWallsHeight);
      this.walls.carConnectorBWallB.setWidth(sideWallsWidth);

      // top and bot walls and doors

      const topAndBottomWallsWidth = (this.getWidth() - (2 * sideWallsWidth)) / 4;
      const topAndBottomWallsHeight = 5;

      this.walls.entraceSideAWallA.setX(this.getX() + sideWallsWidth)
      this.walls.entraceSideAWallA.setY(this.getY());
      this.walls.entraceSideAWallA.setHeight(topAndBottomWallsHeight);
      this.walls.entraceSideAWallA.setWidth(topAndBottomWallsWidth);

      this.walls.entranceSideADoorA.setX(this.getX()
        + sideWallsWidth
        + this.walls.entraceSideAWallA.getWidth()
      );
      this.walls.entranceSideADoorA.setY(this.getY());
      this.walls.entranceSideADoorA.setHeight(topAndBottomWallsHeight);
      this.walls.entranceSideADoorA.setWidth(topAndBottomWallsWidth);

      this.walls.entraceSideADoorB.setX(
        this.getX()
        + sideWallsWidth
        + this.walls.entraceSideAWallA.getWidth()
        + this.walls.entranceSideADoorA.getWidth()
      );
      this.walls.entraceSideADoorB.setY(this.getY());
      this.walls.entraceSideADoorB.setHeight(topAndBottomWallsHeight);
      this.walls.entraceSideADoorB.setWidth(topAndBottomWallsWidth);

      this.walls.entraceSideAWallB.setX(
        this.getX()
        + sideWallsWidth
        + this.walls.entraceSideAWallA.getWidth()
        + this.walls.entranceSideADoorA.getWidth()
        + this.walls.entraceSideADoorB.getWidth()
      );
      this.walls.entraceSideAWallB.setY(this.getY());
      this.walls.entraceSideAWallB.setHeight(topAndBottomWallsHeight);
      this.walls.entraceSideAWallB.setWidth(topAndBottomWallsWidth);

      // bottomSide

      this.walls.entranceSideBWallA.setX(this.getX() + sideWallsWidth)
      this.walls.entranceSideBWallA.setY(this.getY() + this.height - topAndBottomWallsHeight);
      this.walls.entranceSideBWallA.setHeight(topAndBottomWallsHeight);
      this.walls.entranceSideBWallA.setWidth(topAndBottomWallsWidth);

      this.walls.entranceSideBDoorA.setX(this.getX()
        + sideWallsWidth
        + this.walls.entranceSideBWallA.getWidth()
      );
      this.walls.entranceSideBDoorA.setY(this.getY() + this.height - topAndBottomWallsHeight);
      this.walls.entranceSideBDoorA.setHeight(topAndBottomWallsHeight);
      this.walls.entranceSideBDoorA.setWidth(topAndBottomWallsWidth);

      this.walls.entranceSideBDoorB.setX(
        this.getX()
        + sideWallsWidth
        + this.walls.entranceSideBWallA.getWidth()
        + this.walls.entranceSideBDoorA.getWidth()
      );
      this.walls.entranceSideBDoorB.setY(this.getY() + this.height - topAndBottomWallsHeight);
      this.walls.entranceSideBDoorB.setHeight(topAndBottomWallsHeight);
      this.walls.entranceSideBDoorB.setWidth(topAndBottomWallsWidth);

      this.walls.entranceSideBWallB.setX(
        this.getX()
        + sideWallsWidth
        + this.walls.entraceSideAWallA.getWidth()
        + this.walls.entranceSideADoorA.getWidth()
        + this.walls.entraceSideADoorB.getWidth()
      );
      this.walls.entranceSideBWallB.setY(this.getY() + this.height - topAndBottomWallsHeight);
      this.walls.entranceSideBWallB.setHeight(topAndBottomWallsHeight);
      this.walls.entranceSideBWallB.setWidth(topAndBottomWallsWidth);
      //bottomSide End
    }
  }
}