import { Entity } from "./Entity.js"
export { Ground }
class Ground extends Entity {
  constructor() {
    super();
    this.setColor("green")
    this.addTag("Ground");
  }
  
}