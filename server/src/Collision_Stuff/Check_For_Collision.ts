import type { Collision_Info } from "#root/Type_Stuff.js";
import type { Base_Entity } from "#root/Entities/Base_Entity.js";
import { Sweep } from "#root/Collision_Stuff/Collision_Checking_Methods/Sweep/Sweep.js"
import { Sub_Positions } from "#root/Collision_Stuff/Collision_Checking_Methods/Sub_Positions/Sub_Positions.js"
const currentMethod: "Sweep" | "Sub_Positions" = "Sub_Positions";

export function Check_For_Collision(a: Base_Entity, b: Base_Entity): Collision_Info | null {
   let collInfo: Collision_Info | null = null;
   switch(currentMethod) {
       case "Sweep":
         collInfo =  Sweep.Check_For_Collision(a, b)
        break;
       case "Sub_Positions":
         collInfo =  Sub_Positions.Check_For_Collision(a, b)
        break;

   }
   if(collInfo) {

    if(!(a.hasTag("Player")))  {
      return collInfo;
    }
    b.markCollisionWithColor();
   }
   return collInfo;
}
