import { Movable_Entity } from "./Movable_Entity.js";
export { Player }
class Player extends Movable_Entity {
  controls = {
    right: false,
    left: false,
    up: false,
    down: false,
  }
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
  update() {
    if (this.controls.right) {
      this.forces.right += 1;
    }
    if (this.controls.left) {
      this.forces.left += 1;
    }
    if (this.controls.up) {
      this.forces.up += 1;
    }
    if (this.controls.down) {
      this.forces.down += 1;
    }
    super.update();
  }
}