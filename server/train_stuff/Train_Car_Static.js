export { Train_Car_Static };
class Train_Car_Static {
    static newEntityXYBasedOnStuff(currentBackSideXY, currentFrontSideXY, prevFrontSideXY, prevBackSideXY, prevEntityXY) {
        // Destructure input coordinates for easier access
        const [currentBackX, currentBackY] = currentBackSideXY;
        const [currentFrontX, currentFrontY] = currentFrontSideXY;
        const [prevFrontX, prevFrontY] = prevFrontSideXY;
        const [prevBackX, prevBackY] = prevBackSideXY;
        const [prevEntityX, prevEntityY] = prevEntityXY;

        // Calculate the deltas for front and back sides
        const deltaFrontX = currentFrontX - prevFrontX;
        const deltaFrontY = currentFrontY - prevFrontY;
        const deltaBackX = currentBackX - prevBackX;
        const deltaBackY = currentBackY - prevBackY;

        // Calculate new Entity position based on deltas
        const newEntityX = prevEntityX + (deltaFrontX + deltaBackX) / 2; // Average of front and back deltas
        const newEntityY = prevEntityY + (deltaFrontY + deltaBackY) / 2; // Average of front and back deltas

        // Return the new Entity coordinates as an object
        return {
            newEntityXY: [newEntityX, newEntityY]
        };
    }


    static placeCarBackOnCurrentRail(entity, rail) {
        // Calculate center of the entity
        const centerX = entity.x + (entity.width / 2);
        const centerY = entity.y + (entity.height / 2);

        // Calculate area of the entity
        const entityArea = entity.width * entity.height;

        // Calculate size of the virtual box (5% of entity's area)
        const boxArea = entityArea * 0.05;

        // Assuming the virtual box is square for simplicity
        const boxSize = Math.sqrt(boxArea);

        // Define virtual box dimensions
        const boxWidth = boxSize;
        const boxHeight = boxSize;

        // Calculate virtual box coordinates
        const boxX = centerX - (boxWidth / 2);
        const boxY = centerY - (boxHeight / 2);

        // Calculate new position for the entity so that its center box touches the rail
        let newX = entity.x;
        let newY = entity.y;

        // Check if the virtual box is already touching or overlapping with the rail
        if (
            !(boxX <= rail.x + rail.width &&
                boxX + boxWidth > rail.x &&
                boxY <= rail.y + rail.height &&
                boxY + boxHeight > rail.y)
        ) {
            // If not touching, adjust position to make it touch
            // Move to align with left edge of rail if it's to the right
            if (boxX + boxWidth <= rail.x) {
                newX = rail.x - (boxWidth / 2); // Center the box at the left edge of the rail
            }
            // Move to align with right edge of rail if it's to the left
            else if (boxX >= rail.x + rail.width) {
                newX = rail.x + rail.width - (boxWidth / 2); // Center the box at the right edge of the rail
            }
            // Move vertically to align with top or bottom edge of rail
            else if (boxY + boxHeight <= rail.y) {
                newY = rail.y - (entity.height / 2); // Position above the rail
            }
            else if (boxY >= rail.y + rail.height) {
                newY = rail.y + rail.height - (entity.height / 2); // Position below the rail
            }
        }

        // Update entity's position
        entity.setX(newX);
        entity.setY(newY);
    }

    static placeCarOnEnd(entity, point) {
        // Calculate current center of the entity
        const currentCenterX = entity.x + (entity.width / 2);
        const currentCenterY = entity.y + (entity.height / 2);

        // Calculate the difference to move the center to the target point
        const deltaX = point.x - currentCenterX;
        const deltaY = point.y - currentCenterY;

        // Update entity's position to make its center touch the point
        const newX = entity.x + deltaX;
        const newY = entity.y + deltaY;
        entity.setX(newX);
        entity.setY(newY);
        // Return updated position of the entity
        return { x: newX, y: newY };
    }
}