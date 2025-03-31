export { type Point, type Position, type Direction, type Box };

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