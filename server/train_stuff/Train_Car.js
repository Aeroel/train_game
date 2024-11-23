import { Entity } from "../Entity.js"
import { Sliding_Door } from "../Sliding_Door.js";
import { Wall } from "../Wall.js";
import { World } from "../World.js";

export { Train_Car }

class Train_Car extends Entity {
  // the train may temporarily move in the other direction to adjust alignment with station doors, but other than such exceptional cases, it will move in the specified direction, whether forward or backwards.
  whatRailAmICurrentlyStandingOn = undefined;
  lastObservedRailOrientation = undefined;
  walls = {
    leftSideBottomWall: new Wall(),
    leftSideTopWall: new Wall(),
    rightSideBottomWall: new Wall(),
    rightSideTopWall: new Wall(),
    topSideLeftWall: new Wall(),
    topSideLeftDoor: new Sliding_Door(),
    topSideRightDoor: new Sliding_Door(),
    topSideRightWall: new Wall(),
    bottomSideLeftWall: new Wall(),
    bottomSideLeftDoor: new Sliding_Door(),
    bottomSideRightDoor: new Sliding_Door(),
    bottomSideRightWall: new Wall(),
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

    const carCenterX = this.x + this.width / 2;
    const carCenterY = this.y + this.height / 2;
    // Helper function to position walls based on their individual position logic
    const placeWall = (wall, offsetX, offsetY, width, height) => {
      wall.x = carCenterX + offsetX - width / 2;
      wall.y = carCenterY + offsetY - height / 2;
      wall.width = width;
      wall.height = height;
    };

    // Adjust walls according to the current dimensions (horizontal or vertical)
    if (this.whatRailAmICurrentlyStandingOn.orientation === "horizontal") {
      const sideWallsHeight = this.height / 3;
      const sideWallsWidth = 5;
      this.walls.leftSideBottomWall.setX(this.getX())
      this.walls.leftSideBottomWall.setY(this.getY() + (sideWallsHeight * 2));
      this.walls.leftSideBottomWall.setHeight(sideWallsHeight);
      this.walls.leftSideBottomWall.setWidth(sideWallsWidth);

      this.walls.rightSideBottomWall.setX((this.getX() + this.getWidth()) - sideWallsWidth)
      this.walls.rightSideBottomWall.setY(this.getY() + (sideWallsHeight * 2));
      this.walls.rightSideBottomWall.setHeight(sideWallsHeight);
      this.walls.rightSideBottomWall.setWidth(sideWallsWidth);

      this.walls.rightSideTopWall.setX((this.getX() + this.getWidth()) - sideWallsWidth)
      this.walls.rightSideTopWall.setY(this.getY());
      this.walls.rightSideTopWall.setHeight(sideWallsHeight);
      this.walls.rightSideTopWall.setWidth(sideWallsWidth);

      this.walls.leftSideTopWall.setX(this.getX())
      this.walls.leftSideTopWall.setY(this.getY());
      this.walls.leftSideTopWall.setHeight(sideWallsHeight);
      this.walls.leftSideTopWall.setWidth(sideWallsWidth);

      const topAndBottomWallsWidth = this.getWidth() / 4;
      const topAndBottomWallsHeight = 5;

      this.walls.topSideLeftWall.setX(this.getX() + sideWallsWidth)
      this.walls.topSideLeftWall.setY(this.getY());
      this.walls.topSideLeftWall.setHeight(topAndBottomWallsHeight);
      this.walls.topSideLeftWall.setWidth(topAndBottomWallsWidth - sideWallsWidth);

      this.walls.topSideLeftDoor.setX(this.getX() + (this.walls.topSideLeftWall.getWidth()))
      this.walls.topSideLeftDoor.setY(this.getY());
      this.walls.topSideLeftDoor.setHeight(topAndBottomWallsHeight);
      this.walls.topSideLeftDoor.setWidth(topAndBottomWallsWidth);

      this.walls.topSideRightDoor.setX(
        this.getX() + (this.walls.topSideLeftWall.getWidth()) + (this.walls.topSideLeftDoor.getWidth())
      );
      this.walls.topSideRightDoor.setY(this.getY());
      this.walls.topSideRightDoor.setHeight(topAndBottomWallsHeight);
      this.walls.topSideRightDoor.setWidth(topAndBottomWallsWidth);

      this.walls.topSideRightWall.setX(
        this.getX()
        + this.walls.topSideLeftWall.getWidth()
        + this.walls.topSideLeftDoor.getWidth()
        + this.walls.topSideRightDoor.getWidth()
      );
      this.walls.topSideRightWall.setY(this.getY());
      this.walls.topSideRightWall.setHeight(topAndBottomWallsHeight);
      this.walls.topSideRightWall.setWidth(topAndBottomWallsWidth);

      // bottomSide

      this.walls.bottomSideLeftWall.setX(this.getX() + sideWallsWidth)
      this.walls.bottomSideLeftWall.setY(this.getY() + this.getHeight() - topAndBottomWallsHeight);
      this.walls.bottomSideLeftWall.setHeight(topAndBottomWallsHeight);
      this.walls.bottomSideLeftWall.setWidth(topAndBottomWallsWidth - sideWallsWidth);

      this.walls.bottomSideLeftDoor.setX(this.getX() + (this.walls.bottomSideLeftWall.getWidth()))
      this.walls.bottomSideLeftDoor.setY(this.getY() + this.getHeight() - topAndBottomWallsHeight);
      this.walls.bottomSideLeftDoor.setHeight(topAndBottomWallsHeight);
      this.walls.bottomSideLeftDoor.setWidth(topAndBottomWallsWidth);

      this.walls.bottomSideRightDoor.setX(
        this.getX() + (this.walls.bottomSideLeftWall.getWidth()) + (this.walls.bottomSideLeftDoor.getWidth())
      );
      this.walls.bottomSideRightDoor.setY(this.getY() + this.getHeight() - topAndBottomWallsHeight);
      this.walls.bottomSideRightDoor.setHeight(topAndBottomWallsHeight);
      this.walls.bottomSideRightDoor.setWidth(topAndBottomWallsWidth);

      this.walls.bottomSideRightWall.setX(
        this.getX() + (this.walls.bottomSideLeftWall.getWidth()) + (this.walls.bottomSideLeftDoor.getWidth()) + (this.walls.bottomSideRightDoor.getWidth())
      );
      this.walls.bottomSideRightWall.setY(this.getY() + this.getHeight() - topAndBottomWallsHeight);
      this.walls.bottomSideRightWall.setHeight(topAndBottomWallsHeight);
      this.walls.bottomSideRightWall.setWidth(topAndBottomWallsWidth);

      //bottomSide End


      // Horizontal orientation (example)
      // placeWall(this.walls.leftSideBottomWall, -this.width / 3, -this.height / 2, this.width / 3, this.height / 6);
      // placeWall(this.walls.leftSideTopWall, -this.width / 3, this.height / 2, this.width / 3, this.height / 6);

      // placeWall(this.walls.rightSideBottomWall, this.width / 3, -this.height / 2, this.width / 3, this.height / 6);
      // placeWall(this.walls.rightSideTopWall, this.width / 3, this.height / 2, this.width / 3, this.height / 6);

      // placeWall(this.walls.topSideLeftWall, -this.width / 2, -this.height / 3, this.width / 6, this.height / 3);
      // placeWall(this.walls.topSideLeftDoor, 0, -this.height / 3, this.width / 3, this.height / 3);
      // placeWall(this.walls.topSideRightDoor, 0, this.height / 3, this.width / 3, this.height / 3);
      // placeWall(this.walls.topSideRightWall, this.width / 2, -this.height / 3, this.width / 6, this.height / 3);

      // placeWall(this.walls.bottomSideLeftWall, -this.width / 2, this.height / 3, this.width / 6, this.height / 3);
      // placeWall(this.walls.bottomSideLeftDoor, 0, this.height / 3, this.width / 3, this.height / 3);
      // placeWall(this.walls.bottomSideRightDoor, 0, -this.height / 3, this.width / 3, this.height / 3);
      // placeWall(this.walls.bottomSideRightWall, this.width / 2, this.height / 3, this.width / 6, this.height / 3);

    } else if (this.whatRailAmICurrentlyStandingOn.orientation === "vertical") {
      // Vertical orientation (example)
      placeWall(this.walls.leftSideBottomWall, -this.width / 2, -this.height / 3, this.width / 3, this.height / 6);
      placeWall(this.walls.leftSideTopWall, -this.width / 2, this.height / 3, this.width / 3, this.height / 6);

      placeWall(this.walls.rightSideBottomWall, this.width / 2, -this.height / 3, this.width / 3, this.height / 6);
      placeWall(this.walls.rightSideTopWall, this.width / 2, this.height / 3, this.width / 3, this.height / 6);

      placeWall(this.walls.topSideLeftWall, -this.width / 3, -this.height / 2, this.width / 3, this.height / 6);
      placeWall(this.walls.topSideLeftDoor, -this.width / 3, 0, this.width / 3, this.height / 3);
      placeWall(this.walls.topSideRightDoor, this.width / 3, 0, this.width / 3, this.height / 3);
      placeWall(this.walls.topSideRightWall, this.width / 3, -this.height / 2, this.width / 3, this.height / 6);

      placeWall(this.walls.bottomSideLeftWall, -this.width / 3, -this.height / 2, this.width / 3, this.height / 6);
      placeWall(this.walls.bottomSideLeftDoor, -this.width / 3, 0, this.width / 3, this.height / 3);
      placeWall(this.walls.bottomSideRightDoor, this.width / 3, 0, this.width / 3, this.height / 3);
      placeWall(this.walls.bottomSideRightWall, this.width / 3, -this.height / 2, this.width / 3, this.height / 6);
    }
  }
}