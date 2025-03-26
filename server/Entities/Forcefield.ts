import { Base_Entity } from "#root/Entities/Base_Entity.js";

export { Forcefield }

class Forcefield extends Base_Entity {
    color = "lightblue"
    constructor() {
        super()
        this.addTag("Forcefield")
        this.setHeight(50)
        this.setWidth(50)
        this.setX(25)
        this.setY(25)
    }
}