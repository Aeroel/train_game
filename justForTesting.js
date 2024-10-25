import { willEntitiesTouchAtAnyPoint, generateAllCurrentMovementPositions } from "./client/entityMovementImplementation";
const e1 = {x:100, y:100, width: 10, height:10, movingInDirections: new Set(["right"]), singleMovementDistance: 5};
const e2 = {x:105, y:105, width: 10, height:10, movingInDirections: new Set(["right"]), singleMovementDistance: 5};
console.log(willEntitiesTouchAtAnyPoint(e1, e2));
