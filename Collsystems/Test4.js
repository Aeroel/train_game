var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var CollisionSystem = /** @class */ (function () {
    function CollisionSystem() {
    }
    /**
     * Main collision resolution function
     */
    CollisionSystem.resolveCollisions = function (player, walls) {
        var _this = this;
        // First, move all walls (they have priority)
        walls.forEach(function (wall) {
            wall.x += wall.vx;
            wall.y += wall.vy;
        });
        // Find all potential collisions with the player
        var collisions = [];
        walls.forEach(function (wall) {
            var collision = _this.sweepTest(player, wall);
            if (collision) {
                collisions.push(collision);
            }
        });
        // Sort by collision time (earliest first)
        collisions.sort(function (a, b) { return a.time - b.time; });
        // Resolve collisions in order
        for (var _i = 0, collisions_1 = collisions; _i < collisions_1.length; _i++) {
            var collision = collisions_1[_i];
            this.resolvePlayerWallCollision(player, collision);
        }
    };
    /**
     * Swept AABB collision detection
     */
    CollisionSystem.sweepTest = function (player, wall) {
        var _a, _b;
        // Calculate relative velocity (player relative to wall)
        var rvx = player.vx - wall.vx;
        var rvy = player.vy - wall.vy;
        // If no relative movement, check if already overlapping
        if (rvx === 0 && rvy === 0) {
            if (this.aabbOverlap(player, wall)) {
                return {
                    time: 0,
                    entityA: player,
                    entityB: wall,
                    normal: { x: 1, y: 0 } // Default normal
                };
            }
            return null;
        }
        // Expand wall by player's dimensions
        var expandedWall = {
            x: wall.x - player.width,
            y: wall.y - player.height,
            width: wall.width + player.width,
            height: wall.height + player.height
        };
        // Calculate intersection times for each axis
        var txEntry, txExit, tyEntry, tyExit;
        if (rvx === 0) {
            if (player.x < expandedWall.x || player.x > expandedWall.x + expandedWall.width) {
                return null;
            }
            txEntry = Number.NEGATIVE_INFINITY;
            txExit = Number.POSITIVE_INFINITY;
        }
        else {
            txEntry = (expandedWall.x - player.x) / rvx;
            txExit = (expandedWall.x + expandedWall.width - player.x) / rvx;
            if (txEntry > txExit) {
                _a = [txExit, txEntry], txEntry = _a[0], txExit = _a[1];
            }
        }
        if (rvy === 0) {
            if (player.y < expandedWall.y || player.y > expandedWall.y + expandedWall.height) {
                return null;
            }
            tyEntry = Number.NEGATIVE_INFINITY;
            tyExit = Number.POSITIVE_INFINITY;
        }
        else {
            tyEntry = (expandedWall.y - player.y) / rvy;
            tyExit = (expandedWall.y + expandedWall.height - player.y) / rvy;
            if (tyEntry > tyExit) {
                _b = [tyExit, tyEntry], tyEntry = _b[0], tyExit = _b[1];
            }
        }
        var entryTime = Math.max(txEntry, tyEntry);
        var exitTime = Math.min(txExit, tyExit);
        // No collision if entry > exit or collision is in the past or beyond current frame
        if (entryTime > exitTime || entryTime < 0 || entryTime > 1) {
            return null;
        }
        // Determine collision normal
        var normal = { x: 0, y: 0 };
        if (txEntry > tyEntry) {
            normal.x = rvx > 0 ? -1 : 1;
        }
        else {
            normal.y = rvy > 0 ? -1 : 1;
        }
        return {
            time: entryTime,
            entityA: player,
            entityB: wall,
            normal: normal
        };
    };
    /**
     * Check if two AABBs overlap
     */
    CollisionSystem.aabbOverlap = function (a, b) {
        return !(a.x >= b.x + b.width ||
            a.x + a.width <= b.x ||
            a.y >= b.y + b.height ||
            a.y + a.height <= b.y);
    };
    /**
     * Resolve collision between player and wall
     */
    CollisionSystem.resolvePlayerWallCollision = function (player, collision) {
        var wall = collision.entityB;
        // Move player to collision point
        var safeTime = Math.max(0, collision.time - 0.001); // Small safety margin
        player.x += player.vx * safeTime;
        player.y += player.vy * safeTime;
        // Calculate remaining velocity after partial movement
        var remainingVx = player.vx * (1 - safeTime);
        var remainingVy = player.vy * (1 - safeTime);
        // If wall is moving, add wall's push force to player
        if (wall.vx !== 0 || wall.vy !== 0) {
            // Wall pushes player
            player.x += wall.vx * (1 - safeTime);
            player.y += wall.vy * (1 - safeTime);
        }
        // Handle sliding along walls
        if (collision.normal.x !== 0) {
            // Vertical wall - slide vertically if possible
            player.vx = 0;
            if (!this.wouldCollideAfterSliding(player, [wall], 0, remainingVy)) {
                player.y += remainingVy;
            }
            player.vy = 0;
        }
        else if (collision.normal.y !== 0) {
            // Horizontal wall - slide horizontally if possible  
            player.vy = 0;
            if (!this.wouldCollideAfterSliding(player, [wall], remainingVx, 0)) {
                player.x += remainingVx;
            }
            player.vx = 0;
        }
    };
    /**
     * Check if sliding movement would cause collision
     */
    CollisionSystem.wouldCollideAfterSliding = function (player, walls, deltaX, deltaY) {
        var _this = this;
        var testPlayer = __assign(__assign({}, player), { x: player.x + deltaX, y: player.y + deltaY });
        return walls.some(function (wall) { return _this.aabbOverlap(testPlayer, wall); });
    };
    return CollisionSystem;
}());
// Test Runner
var TestRunner = /** @class */ (function () {
    function TestRunner() {
    }
    TestRunner.runAllTests = function () {
        console.log("Running Collision System Tests...\n");
        this.test1();
        this.test2();
        this.test3();
        this.test4();
        this.test5();
        this.test6();
    };
    TestRunner.createEntity = function (x, y, vx, vy, width, height, type) {
        return { x: x, y: y, vx: vx, vy: vy, width: width, height: height, type: type };
    };
    TestRunner.test1 = function () {
        console.log("Test 1: Standing wall, moving player");
        var player = this.createEntity(0, 0, 100, 0, 10, 10, 'player');
        var wall = this.createEntity(50, 0, 0, 0, 10, 10, 'wall');
        CollisionSystem.resolveCollisions(player, [wall]);
        console.log("Player: x=".concat(player.x, ", y=").concat(player.y, " (expected: x=40, y=0)"));
        console.log("Wall: x=".concat(wall.x, ", y=").concat(wall.y, " (expected: x=50, y=0)"));
        console.log("\u2713 ".concat(player.x === 40 && player.y === 0 && wall.x === 50 && wall.y === 0 ? 'PASS' : 'FAIL', "\n"));
    };
    TestRunner.test2 = function () {
        console.log("Test 2: Moving wall, standing player");
        var player = this.createEntity(0, 0, 0, 0, 10, 10, 'player');
        var wall = this.createEntity(-100, 0, 500, 0, 10, 10, 'wall');
        CollisionSystem.resolveCollisions(player, [wall]);
        console.log("Player: x=".concat(player.x, ", y=").concat(player.y, " (expected: x=410, y=0)"));
        console.log("Wall: x=".concat(wall.x, ", y=").concat(wall.y, " (expected: x=400, y=0)"));
        console.log("\u2713 ".concat(player.x === 410 && player.y === 0 && wall.x === 400 && wall.y === 0 ? 'PASS' : 'FAIL', "\n"));
    };
    TestRunner.test3 = function () {
        console.log("Test 3: Both entities move towards each other");
        var player = this.createEntity(100, 0, -100, 0, 10, 10, 'player');
        var wall = this.createEntity(50, 0, 100, 0, 10, 10, 'wall');
        CollisionSystem.resolveCollisions(player, [wall]);
        console.log("Player: x=".concat(player.x, ", y=").concat(player.y, " (expected: x=160, y=0)"));
        console.log("Wall: x=".concat(wall.x, ", y=").concat(wall.y, " (expected: x=150, y=0)"));
        console.log("\u2713 ".concat(player.x === 160 && player.y === 0 && wall.x === 150 && wall.y === 0 ? 'PASS' : 'FAIL', "\n"));
    };
    TestRunner.test4 = function () {
        console.log("Test 4: High velocity diagonal movement");
        var player = this.createEntity(0, 0, 100000, 100000, 10, 10, 'player');
        var wall = this.createEntity(150, 150, 0, 0, 10, 10, 'wall');
        CollisionSystem.resolveCollisions(player, [wall]);
        console.log("Player: x=".concat(player.x, ", y=").concat(player.y, " (expected: x=140, y=100000)"));
        console.log("Wall: x=".concat(wall.x, ", y=").concat(wall.y, " (expected: x=150, y=150)"));
        console.log("\u2713 ".concat(Math.abs(player.x - 140) < 1 && Math.abs(player.y - 100000) < 1 ? 'PASS' : 'FAIL', "\n"));
    };
    TestRunner.test5 = function () {
        console.log("Test 5: High velocity diagonal movement + two walls");
        var player = this.createEntity(0, 0, 100000, 100000, 10, 10, 'player');
        var wall1 = this.createEntity(140, 140, -10, -10, 10, 10, 'wall');
        var wall2 = this.createEntity(5000, 140, 0, 0, 10, 10, 'wall');
        CollisionSystem.resolveCollisions(player, [wall1, wall2]);
        console.log("Player: x=".concat(player.x, ", y=").concat(player.y, " (expected: x=4990, y=140)"));
        console.log("Wall1: x=".concat(wall1.x, ", y=").concat(wall1.y, " (expected: x=130, y=130)"));
        console.log("Wall2: x=".concat(wall2.x, ", y=").concat(wall2.y, " (expected: x=5000, y=140)"));
        console.log("\u2713 ".concat(Math.abs(player.x - 4990) < 1 && Math.abs(player.y - 140) < 1 ? 'PASS' : 'FAIL', "\n"));
    };
    TestRunner.test6 = function () {
        console.log("Test 6: Corner case (player moving, walls stationary)");
        var player = this.createEntity(6, 5, 1000, 1000, 10, 10, 'player');
        var wall1 = this.createEntity(0, 0, 0, 0, 2, 4, 'wall');
        var wall2 = this.createEntity(0, 0, 0, 0, 5, 4, 'wall');
        CollisionSystem.resolveCollisions(player, [wall1, wall2]);
        console.log("Player: x=".concat(player.x, ", y=").concat(player.y, " (expected: x=5, y=4)"));
        console.log("Wall1: x=".concat(wall1.x, ", y=").concat(wall1.y, " (expected: x=0, y=0)"));
        console.log("Wall2: x=".concat(wall2.x, ", y=").concat(wall2.y, " (expected: x=0, y=0)"));
        console.log("\u2713 ".concat(Math.abs(player.x - 5) < 1 && Math.abs(player.y - 4) < 1 ? 'PASS' : 'FAIL', "\n"));
    };
    return TestRunner;
}());
// Run tests
TestRunner.runAllTests();
