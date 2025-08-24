import type {Direction, Position, Collision_Info, Box} from "#root/Type_Stuff.js";
import type {Base_Entity} from "#root/Entities/Base_Entity.js";
import { Helper_Functions } from "#root/Helper_Functions.js";
import { Game_Loop } from "#root/Game_Loop.js";

export {Sweep};

class Sweep {
  static Check_For_Collision(a: Base_Entity, b: Base_Entity): Collision_Info | null {
    return this.getInfo(a, b);
  }
  static getInfo(a: Base_Entity, b: Base_Entity) {
    return {
        Theoretical_Ending_Position_A: {x:0,y:0},
  Theoretical_Ending_Position_B:  {x:0,y:0},
  entityA: a,
  entityB: b,
  Position_Just_Before_Collision_A: {x:0,y:0},
  Position_Just_Before_Collision_B: {x:0,y:0},
  bFacingA: "down" as Direction,
  aFacingB: "up" as Direction,
  collideAtStart: false,
  collideAtLast: false,
    }
  }
}
