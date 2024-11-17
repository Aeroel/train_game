import { Movable_Entity } from "./Movable_Entity.js";
export { Player}
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
}