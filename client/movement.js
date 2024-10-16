function movePlayer({player, xStep, yStep, entities}) {
    const newX = player.x + xStep;
    const newY = player.y + yStep;

    const wall = checkCollisionWithWalls(player, newX, newY, entities);

    if (wall) {
        // Determine the direction of movement and adjust position accordingly
        if (xStep > 0) {
            // Moving right, place player to the left of the wall
            player.x = wall.x - player.width;
        } else if (xStep < 0) {
            // Moving left, place player to the right of the wall
            player.x = wall.x + wall.width;
        } else if (yStep > 0) {
            // Moving down, place player above the wall
            player.y = wall.y - player.height;
        } else if (yStep < 0) {
            // Moving up, place player below the wall
            player.y = wall.y + wall.height;
        }
    } else {
        // No collision detected; move the player to the new position
        player.x = newX;
        player.y = newY;
    }
}



function rectIntersectsRect(r1, r2) {
    return (
        r1.x < r2.x + r2.width &&
        r1.x + r1.width > r2.x &&
        r1.y < r2.y + r2.height &&
        r1.y + r1.height > r2.y
    );
}

function checkCollisionWithWalls(player, newX, newY, entities) {
    // Define the player's new bounding box based on its new position
    const playerBox = {
        x: newX,
        y: newY,
        width: player.width,
        height: player.height
    };

    for (const entity of entities) {
        if(entity.type !== 'wall') {
            continue;
        }
        const wall = entity;
        const wallBox = {
            x: wall.x,
            y: wall.y,
            width: wall.width,
            height: wall.height
        };

        // Check if the player's bounding box intersects with the wall's bounding box
        if (rectIntersectsRect(playerBox, wallBox)) {
            return wallBox; // Return the wall that the player collides with
        }
    }
    return null; // No collision detected
}


export {
    movePlayer
}