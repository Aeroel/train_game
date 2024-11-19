import { Movable_Entity } from "../Movable_Entity.js"

export { Train_Engine_Car }

class Train_Car extends Movable_Entity {
  // the train may temporarily move in the other direction to adjust alignment with station doors, but other than such exceptional cases, it will move in the specified direction, whether forward or backwards.
  possibleMovements = ["a_direction", "the_opposite_direction"];
  constructor() {
    super();
    this.setColor("brown");
    this.addTag("Train_Car");
  }
  setMovementDirective(direction) {
    this.movementDirectionDirectiveOnRailway = direction;
  }
  behaviour() {

  }
}