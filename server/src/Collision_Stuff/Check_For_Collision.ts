import type { Collision_Info } from "#root/Type_Stuff.js";
import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Swept } from "#root/Collision_Stuff/Collision_Checking_Methods/Swept/Swept.js"
import { Swept2 } from "#root/Collision_Stuff/Collision_Checking_Methods/Swept2/Swept2.js"
import { Sub_Positions} from "#root/Collision_Stuff/Collision_Checking_Methods/Sub_Positions/Sub_Positions.js"
const currentMethod: "swept" |"swept2" | "subPositions" = "subPositions";

export function Check_For_Collision(a: Base_Entity, b: Base_Entity): Collision_Info | null {
   switch(currentMethod) {
       case "swept":
         return Swept.Check_For_Collision(a, b)
        break;
        case "swept2":
          return Swept2.Check_For_Collision(a, b);
        break;
        case "subPositions":
           return Sub_Positions.Check_For_Collision(a, b);
        break;
   }
}
