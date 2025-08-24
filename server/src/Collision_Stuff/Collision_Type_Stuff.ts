export type {
  Collision_Info,
} 


import type { Position, Box, Direction} from "#root/Type_Stuff.js"
import type { Base_Entity } from "#root/Entities/Base_Entity.js"



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
  // Whether the entities actually collide at the "just before collision" positions. this can happen if a player is walking on top of the ground entity, for example. While in some resolution methods like between wall and player I will make sure the player does not collide with anything at end of every tick and assert that collideAtJustBefore is false (if not false, this means reoslution on previous ticks was invalidly handled)
  collideAtJustBefore: boolean;
}