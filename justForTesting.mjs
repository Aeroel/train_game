
const e1 = {x:100, y:100, width: 10, height:10, movingInDirections: new Set(["right","down"]), currentSpeed: 0};
const e2 = {x:105, y:105, width: 10, height:10, movingInDirections: new Set(["right"]), singleMovementDistance: 5};
console.log(expandForComparison({subpositions:[{x: 100, y: 100}], numberOfTimes:5}));

function expandForComparison({ subpositions, numberOfTimes }) {
    const expandedPositions = [...subpositions];
    const lastPosition = subpositions[subpositions.length - 1];

    while(expandedPositions.length < numberOfTimes) {
        expandedPositions.push({...lastPosition});
    }

    return expandedPositions;
}