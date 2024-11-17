import { Movable_Entity } from "./Movable_Entity.js"

export { Train }

class Train extends Movable_Entity {
  constructor() {
    super();
    this.setColor("brown");
    this.addTag("Train");
  }
}