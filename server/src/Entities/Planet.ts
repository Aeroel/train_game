import { Base_Entity } from "#root/Entities/Base_Entity.js"
import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js"
export { Planet}
interface Planet_Constructor {
  color?: string
}


class Planet extends Base_Entity {
  planetDriftKey = `Planet_Id_${this.id}_Drift_Key`
  planetDriftVX=0;
  planetDriftVY= 0;
  constructor({color="green"}: Planet_Constructor = {}) {
    super();
    this.setColor(color)
    this.addTag("Planet");
  }
  
  
  updateState() {
      this.planetMoves();
  }
planetMoves() {
      this.velocity.x.Add_Component({key:this.planetDriftKey, value:this .planetDriftVX})
    this.velocity.y.Add_Component({key:this.planetDriftKey, value:this .planetDriftVY})
    this.Entities_On_Planet_Drift_Too();
}

 Entities_On_Planet_Drift_Too() {
   const touchingThisGroundCollisions = Collision_Stuff.findCollisions(this);
   if(touchingThisGroundCollisions.length === 0) {
     return;
   }
   touchingThisGroundCollisions.forEach(collision=> {
     const other = collision.entityB;
     this.velocity.Add_To_Propagation_List(other.velocity);
   })
 }
 
 
 Clean_Up() {
   this.velocity.Clear_Propagation_List();
   super.Clean_Up();
 }
 
 
}