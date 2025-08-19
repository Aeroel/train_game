class Entity {
    x;
    y;
    vx;
    vy;
    width;
    height;
    constructor(x, y, vx, vy, width, height) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = width;
        this.height = height;
    }
}
function collidePlayerWithWalls(player, walls) {
    for (const wall of walls) {
        wall.x += wall.vx;
        wall.y += wall.vy;
    }
    let remainingTime = 1.0;
    let currentX = player.x;
    let currentY = player.y;
    let currentVx = player.vx;
    let currentVy = player.vy;
    while (remainingTime > 0) {
        let earliestCollision = null;
        for (const wall of walls) {
            const relativeVx = currentVx - wall.vx;
            const relativeVy = currentVy - wall.vy;
            let entryX, exitX;
            if (relativeVx > 0) {
                entryX = (wall.x - (currentX + player.width)) / relativeVx;
                exitX = (wall.x + wall.width - currentX) / relativeVx;
            }
            else if (relativeVx < 0) {
                entryX = (wall.x + wall.width - currentX) / relativeVx;
                exitX = (wall.x - (currentX + player.width)) / relativeVx;
            }
            else {
                entryX = -Infinity;
                exitX = Infinity;
            }
            let entryY, exitY;
            if (relativeVy > 0) {
                entryY = (wall.y - (currentY + player.height)) / relativeVy;
                exitY = (wall.y + wall.height - currentY) / relativeVy;
            }
            else if (relativeVy < 0) {
                entryY = (wall.y + wall.height - currentY) / relativeVy;
                exitY = (wall.y - (currentY + player.height)) / relativeVy;
            }
            else {
                entryY = -Infinity;
                exitY = Infinity;
            }
            const entryTime = Math.max(entryX, entryY);
            const exitTime = Math.min(exitX, exitY);
            if (entryTime <= exitTime && entryTime >= 0 && entryTime <= remainingTime) {
                if (!earliestCollision || entryTime < earliestCollision.t) {
                    const normalX = entryX > entryY ? Math.sign(relativeVx) : 0;
                    const normalY = entryY > entryX ? Math.sign(relativeVy) : 0;
                    earliestCollision = { t: entryTime, normalX, normalY, wall };
                }
            }
        }
        if (!earliestCollision) {
            currentX += currentVx * remainingTime;
            currentY += currentVy * remainingTime;
            break;
        }
        const { t, normalX, normalY, wall } = earliestCollision;
        currentX += currentVx * t;
        currentY += currentVy * t;
        remainingTime -= t;
        if (wall.vx === 0 && wall.vy === 0) {
            if (normalX !== 0)
                currentVx = 0;
            if (normalY !== 0)
                currentVy = 0;
        }
        else {
            currentVx = wall.vx;
            currentVy = wall.vy;
        }
    }
    player.x = currentX;
    player.y = currentY;
}
// Tests
function testCollisionSystem() {
    function runTest(testName, player, walls, expectedPlayer, expectedWalls) {
        const initialPlayer = new Entity(player.x, player.y, player.vx, player.vy, player.width, player.height);
        const initialWalls = walls.map(w => new Entity(w.x, w.y, w.vx, w.vy, w.width, w.height));
        collidePlayerWithWalls(player, walls);
        let pass = true;
        if (Math.abs(player.x - expectedPlayer.x) > 0.001 || Math.abs(player.y - expectedPlayer.y) > 0.001) {
            pass = false;
        }
        for (let i = 0; i < walls.length; i++) {
            if (Math.abs(walls[i].x - expectedWalls[i].x) > 0.001 || Math.abs(walls[i].y - expectedWalls[i].y) > 0.001) {
                pass = false;
            }
        }
        console.log(`Test ${testName}: ${pass ? 'PASS' : 'FAIL'}`);
        if (!pass) {
            console.log(`  Initial Player: (${initialPlayer.x},${initialPlayer.y}) v(${initialPlayer.vx},${initialPlayer.vy})`);
            console.log(`  Final Player: (${player.x},${player.y})`);
            console.log(`  Expected Player: (${expectedPlayer.x},${expectedPlayer.y})`);
            for (let i = 0; i < walls.length; i++) {
                console.log(`  Wall${i + 1} Final: (${walls[i].x},${walls[i].y}) Expected: (${expectedWalls[i].x},${expectedWalls[i].y})`);
            }
        }
    }
    // Test 1
    let player1 = new Entity(0, 0, 100, 0, 10, 10);
    let wall1 = new Entity(50, 0, 0, 0, 10, 10);
    runTest("1", player1, [wall1], { x: 40, y: 0 }, [{ x: 50, y: 0 }]);
    // Test 2
    let player2 = new Entity(0, 0, 0, 0, 10, 10);
    let wall2 = new Entity(-100, 0, 500, 0, 10, 10);
    runTest("2", player2, [wall2], { x: 410, y: 0 }, [{ x: 400, y: 0 }]);
    // Test 3
    let player3 = new Entity(100, 0, -100, 0, 10, 10);
    let wall3 = new Entity(50, 0, 100, 0, 10, 10);
    runTest("3", player3, [wall3], { x: 160, y: 0 }, [{ x: 150, y: 0 }]);
    // Test 4
    let player4 = new Entity(0, 0, 100000, 100000, 10, 10);
    let wall4 = new Entity(150, 150, 0, 0, 10, 10);
    runTest("4", player4, [wall4], { x: 100000, y: 140 }, [{ x: 150, y: 150 }]);
    // Test 5
    let player5 = new Entity(0, 0, 100000, 100000, 10, 10);
    let wall5a = new Entity(140, 140, -10, -10, 10, 10);
    let wall5b = new Entity(5000, 140, 0, 0, 10, 10);
    runTest("5", player5, [wall5a, wall5b], { x: 4990, y: 140 }, [{ x: 130, y: 130 }, { x: 5000, y: 140 }]);
    // Test 6
    let player6 = new Entity(6, 5, 1000, 1000, 10, 10);
    let wall6a = new Entity(0, 0, 0, 0, 2, 4);
    let wall6b = new Entity(0, 0, 0, 0, 5, 4);
    runTest("6", player6, [wall6a, wall6b], { x: 2, y: 2 }, [{ x: 0, y: 0 }, { x: 0, y: 0 }]);
    // Test 7
    let player7 = new Entity(6, 5, 10000, 10000, 10, 10);
    let wall7a = new Entity(0, 0, 100, 100, 2, 4);
    let wall7b = new Entity(0, 0, 100, 100, 5, 4);
    runTest("7", player7, [wall7a, wall7b], { x: 102, y: 102 }, [{ x: 100, y: 100 }, { x: 100, y: 100 }]);
}
testCollisionSystem();
