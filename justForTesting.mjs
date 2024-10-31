function equalizePositionSteps(positions1, positions2) {
    // Determine which array is shorter and which is longer.
    const [shorter, longer] = positions1.length < positions2.length
        ? [positions1, positions2]
        : [positions2, positions1];

    const targetLength = longer.length;
    const expandedPositions = [shorter[0]]; // Start with the first element from the shorter array.

    // Calculate the required number of interpolations.
    const stepsToAdd = targetLength - shorter.length;

    // Function to interpolate between two positions
    function interpolate(pos1, pos2, ratio) {
        return {
            x: pos1.x + (pos2.x - pos1.x) * ratio,
            y: pos1.y + (pos2.y - pos1.y) * ratio
        };
    }

    // Add interpolated positions between each consecutive pair in the shorter array.
    for (let i = 1; i < shorter.length - 1; i++) {
        const startPos = shorter[i - 1];
        const endPos = shorter[i];
        const intervalCount = Math.ceil(stepsToAdd / (shorter.length - 2));

        for (let j = 1; j <= intervalCount && expandedPositions.length < targetLength - 1; j++) {
            const ratio = j / (intervalCount + 1);
            const newPos = interpolate(startPos, endPos, ratio);
            expandedPositions.push(newPos);
        }

        // Add the actual position from shorter array.
        expandedPositions.push(shorter[i]);
    }

    // End with the last element from the shorter array.
    expandedPositions.push(shorter[shorter.length - 1]);

    // Handle any remaining positions if the target length is still not met.
    while (expandedPositions.length < targetLength) {
        expandedPositions.push(expandedPositions[expandedPositions.length - 1]);
    }

    return positions1.length < positions2.length
        ? [expandedPositions, longer]
        : [longer, expandedPositions];
}

// Example usage:
const entity1Positions = [
    { x: 100, y: 100 }, { x: 99.5, y: 101 }, { x: 99, y: 102 }, { x: 98.5, y: 103 },
    { x: 98, y: 104 }, { x: 97.5, y: 105 }, { x: 97, y: 106 }, { x: 96.5, y: 107 },
    { x: 96, y: 108 }, { x: 95.5, y: 109 }
];

const entity2Positions = [
    { x: 100, y: 100 }, { x: 99.5, y: 101 }, { x: 99, y: 102 }
];

const [equalized1, equalized2] = equalizePositionSteps(entity1Positions, entity2Positions);
console.log(equalized1);
console.log(equalized2);

                                                                        
