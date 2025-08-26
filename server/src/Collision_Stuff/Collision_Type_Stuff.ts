export type {
  Collision_Info, Normal, Face
} 


import type { Position, Box, Direction} from "#root/Type_Stuff.js"
import type { Base_Entity } from "#root/Entities/Base_Entity.js"

type Face = "right"|"left"|"bottom"|"top"
type Normal =  {
  x:1|0|-1,
  y: 1|0|-1
  
}
type Collision_Info =  {
  entityA: Base_Entity,
  entityB: Base_Entity,
  time: number,
  normal: Normal,
  
}