/*

*/

import type {Base_Entity} from "#root/Entities/Base_Entity.js"
import type {Position, Box, Direction, Collision_Info} from "#root/Type_Stuff.js"
import {Game_Loop}  from "#root/Game_Loop.js"
const dt = Game_Loop.deltaTime;


export class Swept2_Test {
  static Check_For_Collision(a: Base_Entity, b: Base_Entity): null | Collision_Info{
    return null// detectCollision(a,b);
  }
}
