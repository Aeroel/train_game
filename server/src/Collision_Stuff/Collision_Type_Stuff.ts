export type {
  Collision_Info, Collision_Time_And_Normal, Normal, Face
} 


import type { Position, Box, Direction,} from "#root/Type_Stuff.js"
import type { Base_Entity } from "#root/Entities/Base_Entity.js"

type Face = "right"|"left"|"bottom"|"top"
type Normal =  {
  x:1|0|-1,
  y: 1|0|-1
  
} 

type Collision_Time_And_Normal =  {
  time: number,
  normal: Normal,
}

type Collision_Info = ( Collision_Time_And_Normal & {
  entityA: Base_Entity,
  entityB: Base_Entity,
}
)