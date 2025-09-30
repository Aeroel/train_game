import { Base_Entity } from "#root/Entities/Base_Entity.js"
import { Sliding_Door } from "#root/Entities/Sliding_Door.js"
import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js"
export {Sliding_Door_Sensor}

type Contact_Filter = (contactEntity: Base_Entity) =>boolean
class Sliding_Door_Sensor extends Base_Entity {
  slidingDoor: Sliding_Door;
  contactFilter: Contact_Filter; 
  color="purple"
  constructor(slidingDoor: Sliding_Door, contactFilter: Contact_Filter) {
    super();
    this.addTag("Sliding_Door_Sensor")
    this.slidingDoor = slidingDoor;
    const thisSensor= this;
    this.contactFilter = contactFilter;
    
    this.x=slidingDoor.x
    this.y=slidingDoor.y
    this.width=slidingDoor.width
    this.height=slidingDoor.height
    
    this.x -= this.width;
    this.y -= this.height;
    
    this.width += this.width *2
    this.height += this.height *2
  }
  updateState() {

    const contacts = Collision_Stuff.findCollisions(this, this.contactFilter);
    const doorState = this.slidingDoor.getState();

    if(contacts.length > 0) {
      if(doorState !== "opened" && doorState !== "opening" ) {
        this.slidingDoor.open();
      }
    } else  {
       if(doorState === "opened" ) {
        this.slidingDoor.close();
      }
    }
    super.updateState();
  }
  
}