import { Base_Entity } from "#root/Entities/Base_Entity.js"
export { Ground }
interface Ground_Constructor {
  color?: string
}
class Ground extends Base_Entity {
  constructor({color="green"}: Ground_Constructor = {}) {
    super();
    this.setColor(color)
    this.addTag("Ground");
  }

}