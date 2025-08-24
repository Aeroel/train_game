import type {Direction, Position, 
//Collision_Info,
Box} from "#root/Type_Stuff.js";
import{Collision_Stuff} from "#root/Collision_Stuff/Collision_Stuff.js"
import type {Base_Entity} from "#root/Entities/Base_Entity.js";
import { Helper_Functions } from "#root/Helper_Functions.js";
import { Game_Loop } from "#root/Game_Loop.js";
import{My_Assert} from "#root/My_Assert.js"


export { Sweep };

// {
type Collision_Info =  {
  entityA: Base_Entity;
  entityB: Base_Entity;
  time: number;
  // theoretical ending positions if there was no collision
  Theoretical_Ending_Position_A: Position;
  Theoretical_Ending_Position_B: Position;
  // positions just before the collision (a small epsilon back)
  Position_Just_Before_Collision_A: Position;
  Position_Just_Before_Collision_B: Position;

  collideAtStart: boolean;
  // Whether the entities actually collide at the positions that are supposedly "just before collision" positions. this can happen if a player is walking on top of a car (collideAtStart true collideAtJustBefore true) entity or just entered car (collideAtStart false, collideAtJustBefore true) , for example. (Remember, this is a topdown rts style game, not a platformer game) While in some resolution methods like between wall and player (where player can never push wall, while the wall might be moving if it is a car wall, so it must push player, not just stop player) I will make sure the player does not collide with anything at end of every tick and assert that collideAtJustBefore is false (if not false, this means reoslution on previous ticks was invalidly handled or even that the collision detection algorithm's logic is faulty and returned invalid results while resolution's logic is fine, or even  both might be broken.)
  collideAtJustBefore: boolean;
}

class Sweep {
  static Check_For_Collision(a: Base_Entity, b: Base_Entity, dt: number = 1): Collision_Info | null {
    return this.implementation(a, b, dt);
  }

 
  private static implementation(a: Base_Entity, b: Base_Entity, dt: number, ): Collision_Info | null {
    // Todo: implement
    return null;
  }

// }
}