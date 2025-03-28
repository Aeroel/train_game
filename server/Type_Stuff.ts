export { type Point, type Position, type Direction };

declare type Point = {
    x: number,
    y: number,
}
declare type Position = {
    x: number,
    y: number
}
declare type Direction = "right" | "left" | "up" | "down"