import { Base_Entity } from "#root/Entities/Base_Entity.js";
export { Player }
class Player extends Base_Entity {
  controls = {
    right: false,
    left: false,
    up: false,
    down: false,
  }
  standardMovementSpeed = 120;
  socketId = null;
  defaultVisionRange = 200
  visionRange = this.defaultVisionRange;
  constructor() {
    super();
    this.addTag("Player");
    this.addTag("Can_Ride_Train");
  }
  setVisionRange(visionRange) {
    this.visionRange = visionRange;
  }
  setSocketId(id) {
    this.socketId = id;
  }
  updateState() {
    if (this.controls.right) {
      this.forces.right += this.standardMovementSpeed;
    }
    if (this.controls.left) {
      this.forces.left += this.standardMovementSpeed;
    }
    if (this.controls.up) {
      this.forces.up += this.standardMovementSpeed;
    }
    if (this.controls.down) {
      this.forces.down += this.standardMovementSpeed;
    }
    super.updateState();
  }
}