
export { getPositionsPerTick, equalizePositionSteps };
function getPositionsPerTick(entity) {
    const { x, y, velocityX = 0, velocityY=0 } = entity;
    const steps = Math.max(Math.abs(velocityX), Math.abs(velocityY));
    const positions = [];

    if (steps === 0) {
        return [{ x:x + velocityX, y: entity.y + velocityY }]
    }

    for (let i = 0; i <= steps; i++) {
        const newX = x + ((velocityX / steps) * i);
        const newY = y + ((velocityY / steps) * i);
        positions.push({ x: newX, y: newY });
    }
    if (positions.length === 0) {
        return [{ x: entity.x + velocityX, y: entity.y + velocityY }]
    }
    return positions;
}
function equalizePositionSteps(positions1, positions2) {
    if(positions1.length === positions2.length) {
        return { entity1Pos: positions1, entity2Pos: positions2 };
    }
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
        ? { entity1Pos: expandedPositions, entity2Pos: longer }
        : { entity1Pos: longer, entity2Pos: expandedPositions };


}
