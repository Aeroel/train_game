import { Movable_Entity } from "./Movable_Entity.js";
export { Player}
class Player extends Movable_Entity {
  socketConnectionId = null;
  defaultVisionRange = 100
  visionRange = this.defaultVisionRange;
    constructor() {
        super()
    }
    setVisionRange(visionRange) {
      this.visionRange = visionRange;
    }
    setAssociatedSocketConnectionId(id) {
      this.socketConnectionId = id;
    }
}