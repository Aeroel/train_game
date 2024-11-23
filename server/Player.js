import { Entity } from "./Entity.js";
export { Player }
class Player extends Entity {
  controls = {
    right: false,
    left: false,
    up: false,
    down: false,
  }
  standardMovementSpeed = 30;
  socketId = null;
  defaultVisionRange = 200
  visionRange = this.defaultVisionRange;
  constructor() {
    super();
    this.addTag("Player");
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