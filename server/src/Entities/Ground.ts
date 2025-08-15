import { Base_Entity } from "#root/Entities/Base_Entity.js"
export { Ground }
interface Ground_Constructor {
  color?: string
}
class Ground extends Base_Entity {
  groundDriftKey = `Ground_Id_${this.id}_Drift_Key`
  groundDriftVX=0;
  groundDriftVY=-0.5;
  constructor({color="green"}: Ground_Constructor = {}) {
    super();
    this.setColor(color)
    this.addTag("Ground");
  }
  updateState() {
    this.vx.Add_Component({key:this.groundDriftKey, value:this .groundDriftVX})
    this.vy.Add_Component({key:this.groundDriftKey, value:this .groundDriftVY})
  }

}