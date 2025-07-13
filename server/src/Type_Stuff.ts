export {
  Typed_Object_Keys,
  type Point,
  type Position,
  type Direction,
  type OpposingDirections,
  type Box,
  type Orientation,
  type VisibleEdge,
  type VisibleEntity,
  type VirtualizedEntity,
  type CleanedEntity,
};

declare type Point = {
  x: number,
  y: number,
}
declare type Position = {
  x: number,
  y: number
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
 
// same as calling Object.keys but avoids as ... cast in random usages
function Typed_Object_Keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}