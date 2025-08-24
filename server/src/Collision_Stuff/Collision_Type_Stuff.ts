export type {
  Collision_Info,
} 


import type { Position, Box, Direction} from "#root/Type_Stuff.js"
import type { Base_Entity } from "#root/Entities/Base_Entity.js"



declare type Collision_Info = {
  Theoretical_Ending_Position_A: Position;
  Theoretical_Ending_Position_B: Position;
  entityA: Base_Entity;
  entityB: Base_Entity;
  Position_Just_Before_Collision_A: Position;
  Position_Just_Before_Collision_B: Position;
  collideAtStart: boolean;
  collideAtLast: boolean;
  time: number,
  normal: Position,
}
