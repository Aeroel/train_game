import { Movable_Entity } from "./Movable_Entity.js";
export { Player}
class Player extends Movable_Entity {
  socketId = null;
  defaultVisionRange = 100
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