export {
  Typed_Object_Keys,
  type Point,
  type Position,
  type Position_Percentage,
  type Direction,
  type OpposingDirections,
  type Box,
  type Orientation,
  type VisibleEdge,
  type VisibleEntity,
  type VirtualizedEntity,
  type CleanedEntity,
  type End,
  type End_Name,
  type End_Name_Alternative,
  type Connections,
  type Entity_With_Ends_And_Orientation,
  
};
export type { Collision_Info } from "#root/Collision_Stuff/Collision_Type_Stuff.js"

import type { Base_Entity } from "#root/Entities/Base_Entity.js"
declare type Point = {
  x: number,
  y: number,
}
declare type Position = {
  x: number,
  y: number
}
declare type Position_Percentage = {
  xPercentage: number,
  yPercentage: number
}
declare type Direction = "right" | "left" | "up" | "down";
declare type OpposingDirections =
  | ["up", "down"]
  | ["down", "up"]
  | ["left", "right"]
  | ["right", "left"];
  
declare type Box = { width: number, height: number } & Position;
declare type Orientation = "vertical" | "horizontal"



// World State Emission
declare type VisibleEdge = {
  x1: number,
  x2: number,
  y1: number,
  y2: number
}
declare type VisibleEntity = {
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  edges: VisibleEdge[],
  tags: string[]
}
declare type VirtualizedEntity = VisibleEntity;
declare type CleanedEntity = VisibleEntity;
 
 
declare type End_Name = "firstEnd" | "secondEnd";
declare type End_Name_Alternative =  "topEnd" | "bottomEnd" | "leftEnd" | "rightEnd";

declare type End = {
    name: End_Name,
} & Position;

declare type Connections = {
    [EndName in End_Name]: End | null;
}

interface Entity_With_Ends_And_Orientation {
  getOrientation(): Orientation;
  getEnd(endName: End_Name | End_Name_Alternative): End;
}

/* same as calling Object.keys but avoids as ... cast in random usages
example:
for (const key of Object.keys(user)) {
becomes
for (const key of Typed_Object_Keys(user)) {
*/
function Typed_Object_Keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}
