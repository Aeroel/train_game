/**
 * Resolves collisions for a player entity against a list of walls.
 * It uses continuous collision detection to handle high velocities.
 * @param player The player object.
 * @param walls An array of wall objects.
 * @param dt The time delta for the current frame.
 */
function resolveCollisions(player, walls, dt) {
    let timeRemaining = dt;
    let currentVx = player.vx;
    let currentVy = player.vy;
    // Use a loop to resolve multiple sequential collisions within a single time step
    for (let i = 0; i < 5; i++) {
        let nearestCollisionTime = timeRemaining;
        let collisionDirection = null;
        let nearestWall = null;
        for (const wall of walls) {
            const relativeVx = currentVx - wall.vx;
            const relativeVy = currentVy - wall.vy;
            let txEntry, tyEntry;
            let txExit, tyExit;
            // Calculate time of entry and exit for x-axis
            if (relativeVx > 0) {
                txEntry = (wall.x - (player.x + player.w)) / relativeVx;
                txExit = (wall.x + wall.w - player.x) / relativeVx;
            }
            else if (relativeVx < 0) {
                txEntry = (wall.x + wall.w - player.x) / relativeVx;
                txExit = (wall.x - (player.x + player.w)) / relativeVx;
            }
            else {
                txEntry = -Infinity;
                txExit = Infinity;
            }
            // Calculate time of entry and exit for y-axis
            if (relativeVy > 0) {
                tyEntry = (wall.y - (player.y + player.h)) / relativeVy;
                tyExit = (wall.y + wall.h - player.y) / relativeVy;
            }
            else if (relativeVy < 0) {
                tyEntry = (wall.y + wall.h - player.y) / relativeVy;
                tyExit = (wall.y - (player.y + player.h)) / relativeVy;
            }
            else {
                tyEntry = -Infinity;
                tyExit = Infinity;
            }
            const tEntry = Math.max(txEntry, tyEntry);
            const tExit = Math.min(txExit, tyExit);
            if (tEntry < tExit && tEntry >= 0 && tEntry < nearestCollisionTime) {
                nearestCollisionTime = tEntry;
                nearestWall = wall;
                collisionDirection = txEntry > tyEntry ? 'x' : 'y';
            }
        }
        if (nearestWall && collisionDirection) {
            // Move player to the point of collision
            player.x += currentVx * nearestCollisionTime;
            player.y += currentVy * nearestCollisionTime;
            // Update the remaining time step
            timeRemaining -= nearestCollisionTime;
            // Update player velocity based on collision direction
            if (collisionDirection === 'x') {
                currentVx = nearestWall.vx;
            }
            else {
                currentVy = nearestWall.vy;
            }
        }
        else {
            // No more collisions this frame, move player for the rest of the time step
            player.x += currentVx * timeRemaining;
            player.y += currentVy * timeRemaining;
            break;
        }
    }
    // Update the player's final velocity
    player.vx = currentVx;
    player.vy = currentVy;
}
// === Test Runner Function ===
function runTest(testName, player, walls, expectedPlayer, timeStep = 1) {
    console.log(`\n=== ${testName} ===`);
    const initialPlayer = { ...player };
    const initialWalls = walls.map(w => ({ ...w }));
    // Create a deep copy for the resolve function to modify
    const playerToResolve = { ...player };
    // Calculate the final positions of the walls first, for comparison
    const wallFinals = walls.map(wall => ({
        x: wall.x + wall.vx * timeStep,
        y: wall.y + wall.vy * timeStep
    }));
    resolveCollisions(playerToResolve, initialWalls, timeStep);
    const playerPosPass = Math.abs(playerToResolve.x - expectedPlayer.x) < 0.001 && Math.abs(playerToResolve.y - expectedPlayer.y) < 0.001;
    const wallsPosPass = wallFinals.every((wallFinal, i) => Math.abs(initialWalls[i].x + initialWalls[i].vx * timeStep - wallFinal.x) < 0.001 &&
        Math.abs(initialWalls[i].y + initialWalls[i].vy * timeStep - wallFinal.y) < 0.001);
    console.log(`Initial Player: x=${initialPlayer.x}, y=${initialPlayer.y}, vx=${initialPlayer.vx}, vy=${initialPlayer.vy}, w=${initialPlayer.w}, h=${initialPlayer.h}`);
    initialWalls.forEach((wall, i) => console.log(`Initial Wall wall${i + 1}: x=${wall.x}, y=${wall.y}, vx=${wall.vx}, vy=${wall.vy}, w=${wall.w}, h=${wall.h}`));
    console.log(`Player final: x=${playerToResolve.x.toFixed(6)}, y=${playerToResolve.y.toFixed(6)}, vx=${playerToResolve.vx}, vy=${playerToResolve.vy}`);
    initialWalls.forEach((wall, i) => console.log(`Wall wall${i + 1} final: x=${wall.x + wall.vx * timeStep}, y=${wall.y + wall.vy * timeStep}`));
    console.log(`Expected Player: x=${expectedPlayer.x}, y=${expectedPlayer.y}`);
    console.log(`Test result: player pos ${playerPosPass ? 'OK' : 'FAIL'}, walls ${wallsPosPass ? 'OK' : 'FAIL'}`);
}
// === Running the Tests ===
runTest('Test 1 - Standing wall, moving player', { x: 0, y: 0, vx: 100, vy: 0, w: 10, h: 10 }, [{ x: 50, y: 0, vx: 0, vy: 0, w: 10, h: 10 }], { x: 40, y: 0 });
runTest('Test 2 - Moving wall, standing player', { x: 0, y: 0, vx: 0, vy: 0, w: 10, h: 10 }, [{ x: -100, y: 0, vx: 500, vy: 0, w: 10, h: 10 }], { x: 410, y: 0 });
runTest('Test 3 - Both move towards each other', { x: 100, y: 0, vx: -100, vy: 0, w: 10, h: 10 }, [{ x: 50, y: 0, vx: 100, vy: 0, w: 10, h: 10 }], { x: 160, y: 0 });
runTest('Test 4 - High velocity diagonal movement', { x: 0, y: 0, vx: 100000, vy: 100000, w: 10, h: 10 }, [{ x: 150, y: 150, vx: 0, vy: 0, w: 10, h: 10 }], { x: 100000, y: 140 });
runTest('Test 5 - High velocity diagonal + two walls', { x: 0, y: 0, vx: 100000, vy: 100000, w: 10, h: 10 }, [{ x: 140, y: 140, vx: -10, vy: -10, w: 10, h: 10 }, { x: 5000, y: 140, vx: 0, vy: 0, w: 10, h: 10 }], { x: 4990, y: 140 });
runTest('Test 6 - Corner case stationary walls', { x: 6, y: 5, vx: 1000, vy: 1000, w: 1, h: 1 }, [{ x: 0, y: 0, vx: 0, vy: 0, w: 2, h: 4 }, { x: 0, y: 0, vx: 0, vy: 0, w: 5, h: 4 }], { x: 2, y: 2 });
runTest('Test 7 - Corner case moving walls', { x: 6, y: 5, vx: 10000, vy: 10000, w: 1, h: 1 }, [{ x: 0, y: 0, vx: 100, vy: 100, w: 2, h: 4 }, { x: 0, y: 0, vx: 100, vy: 100, w: 5, h: 4 }], { x: 102, y: 102 });
