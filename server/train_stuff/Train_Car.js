import { Movable_Entity } from "../Movable_Entity.js"
import { Wall } from "../Wall.js";
import { World } from "../World.js";

export { Train_Car }

class Train_Car extends Movable_Entity {
  // the train may temporarily move in the other direction to adjust alignment with station doors, but other than such exceptional cases, it will move in the specified direction, whether forward or backwards.
  whatRailAmICurrentlyStandingOn = undefined;
  lastObservedRailOrientation = undefined;
  walls = new Array();
  possibleMovementDecisions = ["backwards", "forwards"];
  constructor() {
    super();
    this.setColor("brown");
    this.addTag("Train_Car");
    this.updateState();
    this.spawnCarWalls();
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
    if(this.whatRailAmICurrentlyStandingOn === undefined) {
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
  spawnCarWalls() {
    const leftSideBottomWall = new Wall();
    const leftSideTopWall = new Wall();


    const rightSideBottomWall = new Wall();
    const rightSideTopWall = new Wall();

    const topSideLeftWall = new Wall();
    const topSideLeftDoor = new Wall("left");
    const topSideRightDoor = new Wall("right");
    const topSideRightWall = new Wall();

    const bottomSideLeftWall = new Wall();
    const bottomSideLeftDoor = new Wall("left");
    const bottomSideRightDoor = new Wall("right");
    const bottomSideRightWall = new Wall();

    this.walls = {
      leftSideBottomWall, leftSideTopWall,
      rightSideBottomWall, rightSideTopWall,
      topSideLeftWall, topSideLeftDoor, topSideRightDoor, topSideRightWall,
      bottomSideLeftWall, bottomSideLeftDoor, bottomSideRightDoor, bottomSideRightWall,
    }

    Object.values(this.walls).forEach(wall => {
      World.addEntity(wall);
    })
  }
  repositionWalls() {
    console.log(this)
    if(this.whatRailAmICurrentlyStandingOn === undefined) {
      return;
    }
    console.log("hmm");
    
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
      // Horizontal orientation (example)
      placeWall(this.walls.leftSideBottomWall, -this.width / 3, -this.height / 2, this.width / 3, this.height / 6);
      placeWall(this.walls.leftSideTopWall, -this.width / 3, this.height / 2, this.width / 3, this.height / 6);

      placeWall(this.walls.rightSideBottomWall, this.width / 3, -this.height / 2, this.width / 3, this.height / 6);
      placeWall(this.walls.rightSideTopWall, this.width / 3, this.height / 2, this.width / 3, this.height / 6);

      placeWall(this.walls.topSideLeftWall, -this.width / 2, -this.height / 3, this.width / 6, this.height / 3);
      placeWall(this.walls.topSideLeftDoor, 0, -this.height / 3, this.width / 3, this.height / 3);
      placeWall(this.walls.topSideRightDoor, 0, this.height / 3, this.width / 3, this.height / 3);
      placeWall(this.walls.topSideRightWall, this.width / 2, -this.height / 3, this.width / 6, this.height / 3);

      placeWall(this.walls.bottomSideLeftWall, -this.width / 2, this.height / 3, this.width / 6, this.height / 3);
      placeWall(this.walls.bottomSideLeftDoor, 0, this.height / 3, this.width / 3, this.height / 3);
      placeWall(this.walls.bottomSideRightDoor, 0, -this.height / 3, this.width / 3, this.height / 3);
      placeWall(this.walls.bottomSideRightWall, this.width / 2, this.height / 3, this.width / 6, this.height / 3);

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