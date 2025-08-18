import { Base_Entity } from "#root/Entities/Base_Entity.js"
import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js"
export { Ground }
interface Ground_Constructor {
  color?: string
}


class Ground extends Base_Entity {
  groundDriftKey = `Ground_Id_${this.id}_Drift_Key`
  groundDriftVX= 1;
  groundDriftVY= -0.5;
  constructor({color="green"}: Ground_Constructor = {}) {
    super();
    this.setColor(color)
    this.addTag("Ground");
  }
  
  
  updateState() {
    this.velocity.x.Add_Component({key:this.groundDriftKey, value:this .groundDriftVX})
    this.velocity.y.Add_Component({key:this.groundDriftKey, value:this .groundDriftVY})
    this.Entities_On_Ground_Drift_Too();
  }


 Entities_On_Ground_Drift_Too() {
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