export {
  type Point,
type Position, 
type Direction, 
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
declare type Direction = "right" | "left" | "up" | "down"
declare type Box  = {width: number, height: number} & Position;
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