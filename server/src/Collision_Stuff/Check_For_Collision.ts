import type { Collision_Info } from "#root/Type_Stuff.js";
import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Swept } from "#root/Collision_Stuff/Collision_Checking_Methods/Swept/Swept.js"
import { Swept2_Test } from "#root/Collision_Stuff/Collision_Checking_Methods/Swept2_Test/Swept2_Test.js"
import { Raycast } from "#root/Collision_Stuff/Collision_Checking_Methods/Raycast/Raycast.js"



import { Sub_Positions} from "#root/Collision_Stuff/Collision_Checking_Methods/Sub_Positions/Sub_Positions.js"
const currentMethod: "Swept" | "Swept2_Test" | "Sub_Positions" | "Raycast" = "Swept2_Test";

export function Check_For_Collision(a: Base_Entity, b: Base_Entity): Collision_Info | null {
   switch(currentMethod) {
       case "Raycast":
         return Raycast.Check_For_Collision(a, b)
        break;
       case "Swept":
         return Swept.Check_For_Collision(a, b)
        break;

        case "Sub_Positions":
           return Sub_Positions.Check_For_Collision(a, b);
        break;
        case "Swept2_Test":
          return Swept2_Test.Check_For_Collision(a,b);
        break;
   }
}
