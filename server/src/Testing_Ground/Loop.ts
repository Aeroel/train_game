import { Sub_Positions} from "#root/Collision_Stuff/Collision_Checking_Methods/Sub_Positions/Sub_Positions.js"
import { Base_Entity} from "#root/Entities/Base_Entity.js"
export function test() {
const a = new Base_Entity();
a.velocity.x.Add_Component({
  key: "hhh", value:10
})
a.velocity.y.Add_Component({
  key: "hhh", value:100
})
a.setXY(-100,-100);
const b = new Base_Entity();
b.velocity.x.Add_Component({
  key: "hhh", value:10
})
b.velocity.y.Add_Component({
  key: "hhh", value:100
})
console.log(Sub_Positions.Check_For_Collision(a,b));

}