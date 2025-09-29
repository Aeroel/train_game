import { Base_Entity } from "#root/Entities/Base_Entity.js"
import { Collision_Stuff } from "#root/Collision_Stuff/Collision_Stuff.js"
import { Stopwatch } from "#root/Utilities/Stopwatch.js"
import { newLog } from "#root/My_Log.js"
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
  const sw = new Stopwatch();
  sw.beginMeasure({tags:["Planet", "Vel_Assign_To_Self"]});
      this.velocity.x.Add_Component({key:this.planetDriftKey, value:this .planetDriftVX})
    this.velocity.y.Add_Component({key:this.planetDriftKey, value:this .planetDriftVY})
   const selfAssign= sw.lap();
   sw.beginMeasure({tags:["Planet", "Other_Drift"]})
    this.Entities_On_Planet_Drift_Too();
    const drift = sw.lap();
    newLog({logCategory:"Planet", message:`[updateState] [planetMoves] Took ${(sw.total())}ms`})
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